import { test, expect } from '@playwright/test';

/**
 * Test E2E: La barra de búsqueda debe filtrar las tarjetas renderizadas
 * por nombre y descripción, ocultando las que no coincidan.
 *
 * Flujo:
 *  1. Navega a la página principal (servidor local de Vite).
 *  2. Localiza el input de búsqueda.
 *  3. Escribe "TempoGym".
 *  4. Verifica que solo queden tarjetas que contengan el texto buscado.
 */
test('La barra de búsqueda filtra las tarjetas mostrando solo las que coinciden', async ({ page }) => {
  // 1. Navegación
  await page.goto('/');

  // 2. Localizar el input (clase inyectada por SearchBar.js)
  const searchInput = page.locator('.search-input');
  await expect(searchInput).toBeVisible();

  // 3. Escribir el término de búsqueda
  await searchInput.fill('TempoGym');

  // 4. Verificar resultados en el contenedor de tarjetas
  const toolsContainer = page.locator('#tools-container');
  await expect(toolsContainer).toBeVisible();

  const visibleCards = toolsContainer.locator('.tool-card');

  // Debe quedar exactamente una tarjeta visible
  await expect(visibleCards).toHaveCount(1);

  // Esa tarjeta debe contener el texto buscado
  await expect(visibleCards.first()).toContainText('TempoGym');

  // Las demás tarjetas (Basic Tools) deben haber desaparecido del DOM
  const hiddenCard = page.locator('.tool-card', { hasText: 'Basic Tools' });
  await expect(hiddenCard).toHaveCount(0);
});
