# Contexto del Proyecto y Reglas para IA

## 1. Arquitectura e Infraestructura

Este es un sitio web 100% estático que se compila con Vite y se despliega en la infraestructura de Amazon Web Services (AWS).

### Flujo de despliegue (CI/CD)
1. El desarrollador realiza un `push` a la rama `main`.
2. GitHub Actions se activa automáticamente leyendo el archivo `.github/workflows/deploy.yml`.
3. El workflow ejecuta la secuencia de pasos:
   - **Checkout**: Descarga el código del repositorio.
   - **Node.js 20**: Configura el entorno de ejecución.
   - **Install**: Ejecuta `npm ci` para instalar dependencias.
   - **Build**: Ejecuta `npm run build` con Vite, generando los archivos estáticos finales en la carpeta `dist/`.
   - **AWS Credentials**: Se autentica con AWS usando `secrets.AWS_ACCESS_KEY_ID` y `secrets.AWS_SECRET_ACCESS_KEY`.
   - **Sync to S3**: Sube el contenido de `dist/` al bucket s3://paulbase.cloud con el comando `aws s3 sync dist/ s3://paulbase.cloud --delete`.
4. La distribución de contenido se sirve a través de **CloudFront** y **Route 53** apuntando al bucket S3.

**Restricción crítica:** No hay un backend en Node.js, Python o similar. El motor de Vite solo se usa durante el proceso de `build`. Los archivos finales en S3 son HTML, CSS y JavaScript puro.

## 2. Stack Tecnológico

| Tecnología | Versión / Detalle | Rol | Fuente en el código |
|---|---|---|---|
| **Vite** | `^8.0.10` | Bundler y servidor de desarrollo | `package.json` devDependencies |
| **Bootstrap** | `5.3.0` (CDN) | Framework CSS para grid y utilidades | `index.html` (CDN jsdelivr) |
| **Playwright** | `^1.61.1` | Testing E2E (actualmente con tests de ejemplo/no funcionales) | `package.json`, `playwright.config.js` |
| **JavaScript** | ES6+ (Módulos ES) | Lógica del frontend | `*.js` bajo `js/` |
| **CSS** | Custom properties, `@import`, Grid, Flexbox | Estilos con sistema de variables | `css/style.css` |
| **Node.js** | `lts/*` (CI) / `20` (deploy) | Entorno para Vite y CI | `.github/workflows/` |

### Detalle de dependencias detectadas en `package.json`:
- **DevDependencies:** `vite`, `@playwright/test`, `@types/node`.
- **No hay dependencias de producción.**

### Stack de frontend explícitamente NO utilizado:
- Sin React, Vue, Angular o Svelte.
- Sin TypeScript (el proyecto es JavaScript vanilla).
- Sin frameworks CSS como Tailwind (usa CSS propio + Bootstrap 5.3).
- Sin backend (Node.js, Express, Python, PHP, etc.).

## 3. Lógica de Negocio y Estructura

### Propósito del proyecto
**Paulbase Hub** es un "hub" que agrupa herramientas web internas y externas en un solo lugar. Centraliza el acceso a distintos subdominios y servicios del ecosistema `paulbase.cloud`.

### Funcionalidades principales
- **Catálogo de herramientas**: Renderiza tarjetas (`ToolCard`) desde la configuración centralizada `js/config/tools.js`.
- **Búsqueda en tiempo real**: Filtra herramientas por nombre y descripción.
- **Filtro por categorías**: Fitness, IT, Productividad, etc.
- **Indicador de destacados**: Las herramientas con `featured: true` se muestran primero y con un badge especial.
- **Animación del título**: El `<h1>` tiene un efecto "platinado" que se activa 800ms después de cargar el DOM.
- **Diseño responsive**: CSS Grid + Bootstrap para adaptar a móviles y escritorio.

### Estructura de archivos y conexión

- `index.html` ← Punto de entrada. Carga Bootstrap (CDN) + `css/style.css` + `js/app.js` (type="module").
- `js/app.js` ← Clase principal `HubApp`. Inicia todo, gestiona estado, renderiza componentes.
- `js/config/tools.js` ← Fuente de datos de herramientas y categorías.
- `js/components/ToolCard.js` ← Clase que genera el HTML de cada tarjeta.
- `js/modules/SearchBar.js` ← Clase que crea y controla el input de búsqueda.
- `js/modules/CategoryFilter.js` ← Clase que crea y controla los botones de categoría.
- `css/style.css` ← Hoja de entrada. Solo importa los modulos vía `@import`.
- `css/base.css` ← Variables CSS globales y reset del body.
- `css/components/buttons.css` ← Estilos de botones (gradientes TempoGym, tech glow, etc.).
- `css/components/cards.css` ← Grid de tarjetas, estados hover, busqueda y responsive.
- `css/components/header.css` ← Animación del efecto platinado.
- `.github/workflows/deploy.yml` ← Pipeline de despliegue a AWS S3.
- `.github/workflows/playwright.yml` ← Pipeline de tests E2E (no funcional, tiene tests de ejemplo).
- `package.json` ← Scripts: dev (vite), build (vite build), preview.
- `playwright.config.js` ← Configuración de tests (Chromium, Firefox, WebKit).
- `tests/example.spec.js` ← Tests de Playwright placeholder (apuntan a playwright.dev, no al proyecto).
- `CHANGELOG.md` ← Historial de cambios (v1.0.0, v0.1.0).
- `dist/` → Carpeta de salida del build (generada por Vite, ignorada por git).

### Flujo de datos
1. `index.html` carga `css/style.css` y `js/app.js` (type="module").
2. `app.js` importa la configuración y los componentes.
3. `HubApp` crea instancias de `SearchBar`, `CategoryFilter` e inyecta los HTML en los contenedores `#search-container`, `#categories-container`.
4. `HubApp` recorre los datos de `toolsConfig` para crear instancias de `ToolCard` e inyectarlas en `#tools-container`.
5. Los eventos de búsqueda y filtro por categoría se propagan con callbacks hacia `HubApp`, que ejecuta `applyFilters()` y re-renderiza `#tools-container`.

## 4. Convenciones de Código

### JavaScript
- **Módulos ES6**: uso exclusivo de `import` / `export` (ningun `require` ni `module.exports`).
- **Clases para componentes**: `class ToolCard`, `class SearchBar`, `class CategoryFilter`, `class HubApp`.
- **Callbacks para comunicación**: los componentes hijos reciben funciones `(value) => this.handleX(value)` para propagar cambios al padre.
- **Interacción con el DOM directa**: `document.getElementById()`, `querySelector()`, `addEventListener()` (sin virtual DOM).
- **Control de valores numéricos no validados**: El código asume que los valores booleanos de `featured` son correctos y no valida si los contenedores existen antes de inyectar contenido.

### CSS
- **Variables CSS en `:root`**: definidas en `base.css` y referenciadas con `var(--nombre)`.
- **Sistema de imports**: `style.css` actua como indice, usando `@import url("...");`.
- **Keyword `!important`**: Usado extensivamente en lugares donde la especificidad de Bootstrap choca con los estilos propios.
- **Unidades modernas**: uso de `dvh` para altura en moviles, `rem` y `vw` como principal.
- **Desactivación de la interacción táctil**: El atributo `user-scalable=no` está presente en el metatag `viewport` del `index.html`.
- **Hueco de seguridad en Conten-Security-Policy**: El encabezado CSP permitido por 'self' y 'unsafe-inline' permite la ejecución de código inline, generando un riesgo menor de XSS que debe ser conocido.

## 5. DIRECTIVAS ESTRICTAS PARA AGENTES IA

### Regla 1: MANTENER el modelo solo-cliente, sin backend
- **Esta prohibido** agregar cualquier tipo de backend (Express, FastAPI, Spring, etc.) o consumir APIs externas que manejen logica compleja del lado del servidor.
- El proyecto es y debe seguir siendo un frontend estatico 100%. No agregar archivos `server.js`, rutas API, ni funciones serverless.
- Si se necesita "persistencia", usar soluciones del lado del cliente (`localStorage`, `IndexedDB`) como maximo.

### Regla 2: PRESERVAR la compatibilidad con el entorno de build y despliegue
- Todo cambio en el pipeline de GitHub Actions debe conservar la compatibilidad con el bucket S3 existente (`s3://paulbase.cloud`) y el modelo de despliegue basico de Vite (`npm run build` -> `dist/` -> `aws s3 sync`).
- No modificar el flujo de `deploy.yml` para introducir dependencias de infraestructura CloudFormation, CDK o Terraform no existentes en el repositorio actual.
- Asegurar que los `import/export` y las rutas relativas funcionen dentro del modelo `type="module"` de Vite.

### Regla 3: RESPETAR la estructura de componentes Vanilla JS y el modelo de datos unificado
- Seguir el patron existente: crear/editar componentes como clases JS con un metodo `render()` que devuelve HTML string o un nodo DOM, y un metodo `init()` o manejador de eventos separado.
- Para agregar nuevas herramientas, **unicamente** tocar el archivo `js/config/tools.js`. No crear nuevos archivos JS ni duplicar la fuente de datos.
- Para agregar nuevas categorias, modificar el arreglo `categories` en el mismo `js/config/tools.js`. Asegurar que el `id` de la categoria exista en la propiedad `category` de al fin de los objetos de herramientas.