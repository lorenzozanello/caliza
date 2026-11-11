import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('portada, colecciones y cinco familias documentadas', async ({ page }, info) => {
  await page.goto('/index.html#/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('.caliza-social-showcase')).toBeVisible()
  await page.goto('/index.html#/living-design/coleccion')
  await expect(page.locator('.caliza-family-card')).toHaveCount(5)
  await page.goto('/index.html#/living-design/familia/mesas-de-comedor')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mesas de comedor')
  for (const name of ['Base de piedra', 'Base de hierro', 'Base de madera']) {
    await expect(page.locator('.caliza-source-list')).toContainText(name)
  }
  await expect(page.locator('#family-inquiry-form')).toBeVisible()
  await page.screenshot({ path: info.outputPath('familia-comedor.png'), fullPage: true })
})

test('WhatsApp oficial, círculo verde y navegación por teclado', async ({ page }) => {
  await page.goto('/index.html#/')
  const whatsapp = page.locator('#floating-whatsapp')
  await expect(whatsapp).toHaveAttribute('href', /wa\.me\/573025983218/)
  const icon = page.locator('.caliza-whatsapp-logo')
  await expect(icon).toHaveCount(1)
  const bg = await whatsapp.evaluate(el => getComputedStyle(el).backgroundColor)
  expect(bg).toBe('rgb(37, 211, 102)')
  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main')).toBeFocused()
  expect(new URL(page.url()).hash).toBe('#/')
})

test('redes visibles, sin conexión externa sin consentimiento', async ({ page }) => {
  const outside: string[] = []
  page.on('request', req => {
    if (/instagram\.com|tiktok\.com/.test(new URL(req.url()).hostname)) outside.push(req.url())
  })
  await page.goto('/index.html#/')
  await expect(page.locator('.caliza-instagram-live')).toBeVisible()
  await expect(page.getByRole('button', { name: /Ver publicaciones recientes/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Mostrar videos de TikTok/ })).toBeVisible()
  expect(outside).toHaveLength(0)
  await page.getByRole('button', { name: /Ver publicaciones recientes/ }).click()
  await expect(page.locator('#caliza-instagram-feed')).toContainText('todavía no está disponible')
  expect(outside).toHaveLength(0)
})

test('auditoría de accesibilidad WCAG A/AA en portada y catálogo', async ({ page }) => {
  for (const route of ['/', '/living-design/coleccion', '/contacto']) {
    await page.goto('/index.html#' + route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations.map(v => ({
      id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target)
    }))).toEqual([])
  }
})
