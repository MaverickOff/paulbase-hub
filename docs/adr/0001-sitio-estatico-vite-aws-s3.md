# ADR 0001: Adoptar arquitectura 100% estática con Vite y despliegue en AWS S3/CloudFront

## Estado

Aceptado

## Contexto

Paulbase Hub es un proyecto personal escalable que centraliza el acceso a herramientas web del ecosistema `paulbase.cloud`. En la fase inicial del proyecto se evaluó cómo estructurar la arquitectura de frontend para soportar funcionalidades como catálogo de herramientas, búsqueda en tiempo real y filtros por categorías.

La evaluación se centró en estos criterios:

1. **Sin necesidad de backend**: el proyecto solo requiere mostrar información estática (tarjetas de herramientas) y aplicar filtros del lado del cliente. No existe persistencia de datos compleja ni lógica de negocio que justifique un servidor.
2. **Escalabilidad para un solo desarrollador**: el despliegue debe ser automatizado y de bajo costo, ideal para un proyecto personal.
3. **Componentización ligera**: necesidad de organizar el código en módulos reutilizables sin incurrir en la complejidad de un framework pesado.
4. **Futura centralización**: el objetivo es que el hub agrupe herramientas internas y externas del ecosistema, lo que requiere un frontend rápido y estable.

## Decisión

Se eligó construir un sitio web **100% estático** utilizando **Vite** como bundler y **JavaScript Vanilla (ES6+)** para la lógica del frontend, sin emplear frameworks reactivos como React, Vue, Angular o Svelte. El despliegue se realiza mediante un pipeline de CI/CD con **GitHub Actions**, sincronizando los artefactos resultantes de `npm run build` a un bucket de **Amazon S3** (`s3://paulbase.cloud`, servido a través de **CloudFront** y **Route 53**.

Las razones que sustentan esta elección frente a alternativas más pesadas son:

- **Simplicidad sobre complejidad innecesaria**: frameworks como React o Vue introducerían una sobrecarga tecnológica desproporcionada para un sitio que consiste principalmente en renderizar tarjetas y aplicar filtros locales. El Virtual DOM y el estado reactivo no son necesarios.
- **Vite optimiza sin abstraer**: ofrece Hot Module Replacement, tree-shaking y bundling optimizado para producción sin obligar a adoptar una arquitectura de componentes de un framework específico. Esto conserva el control directo sobre el DOM.
- **AWS S3 + CloudFront es idóneo para contenido estático**: S3 es el servicio nativo de AWS para almacenar y servir archivos estáticos, y CloudFront proporciona una CDN global de bajo costo. Esta combinación es extremadamente rentable para un proyecto personal y elimina la necesidad de gestionar servidores.
- **Mantenimiento por un solo desarrollador**: la ausencia de backend, base de datos o lógica de servidor reduce drásticamente la superficie de mantenimiento y los costos operativos.

## Consecuencias

### Ventajas

- **Rendimiento superior en carga inicial**: al no cargar un runtime de framework, el bundle de JavaScript es mínimo. La aplicación se carga rápidamente, ya que el HTML, CSS y JS son nativos del navegador.
- **Costo operativo casi nulo**: S3 y CloudFront tienen un modelo de precios por consumo que es extremadamente económico para sitios de tráfico bajo a medio, característicos de un proyecto personal.
- **Control total sobre la interfaz**: la interacción directa con el DOM (`document.getElementById`, `addEventListener`) permite optimizaciones específicas sin las abstracciones o restricciones de un framework.
- **Pipeline CI/CD simple y confiable**: el flujo de `git push` → GitHub Actions `build` → `aws s3 sync` es directo, rápido y fácil de depurar.
- **Independencia tecnológica**: no hay acoplamiento a la curva de aprendizaje, ciclo de vida o dependencias de un framework específico.

### Limitaciones y Compromisos Técnicos

- **Manejo manual del estado**: sin un framework reactivo, el estado de la aplicación (por ejemplo, la categoría activa o el texto de búsqueda) debe gestionarse explícitamente. La actualización de la UI se realiza manipulando el DOM directamente, lo que puede volverse más complejo si el proyecto escala a docenas de componentes interactivos.
- **Sin Server-Side Rendering (SSR)**: el sitio es puramente client-side. Esto limita la optimización para SEO de contenido dinámico, aunque en el caso de un "hub" de herramientas con contenido conocido y predecible, este factor es menor.
- **Complejidad creciente con la escala**: si en el futuro el hub añade secciones con alta interacción (gestión de usuario, paneles de administración, etc.), el código Vanilla podría volverse difícil de mantener comparado con un framework estructurado.
- **Seguridad del lado del cliente**: al ser un frontend estático servido desde S3, la lógica de negocio sensible debe residir en servicios externos o funciones serverless; cualquier clave o lógica sensible incluida en el bundle será accesible públicamente.
