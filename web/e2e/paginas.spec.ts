import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const axe = async (page: Page) => {
  await expect(page).toHaveTitle(/Caliza/)
  const r = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).disableRules(['color-contrast']).analyze()
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([])
}

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e })
})

const PAGES: [string, RegExp][] = [
  ['/stone', /La piedra que/],
  ['/care', /Lo que dura/],
  ['/proyectos', /Proyectos/],
  ['/materiales', /La piedra/],
  ['/estudio', /Tres generaciones/],
  ['/legal/terminos', /Términos y condiciones/],
]

for (const [path, heading] of PAGES) {
  test(`${path} se presenta completa y accesible`, async ({ page }) => {
    const r = await page.goto(path)
    expect(r?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
    await axe(page)
  })
}

test('el menú lleva a cada línea', async ({ page, isMobile }) => {
  await page.goto('/design')
  for (const [label, path] of [['Stone', '/stone'], ['Care', '/care'], ['Proyectos', '/proyectos'], ['Materiales', '/materiales'], ['Estudio', '/estudio']]) {
    if (isMobile) await page.getByRole('button', { name: 'Abrir menú' }).click()
    const nav = isMobile ? page.locator('#menu') : page.getByRole('navigation', { name: 'Principal' })
    await nav.getByRole('link', { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
})

test('Care arma el mensaje de WhatsApp con lo que le pasa a la superficie', async ({ page }) => {
  await page.goto('/care?utm_source=tiktok')
  await page.getByRole('button', { name: 'Tiene manchas' }).click()
  await page.getByRole('button', { name: 'Perdió el brillo' }).click()
  await expect(page.getByTestId('care-message')).toContainText('mi superficie en piedra tiene manchas y perdió el brillo')
  const href = decodeURIComponent((await page.getByTestId('care-wa').getAttribute('href'))!)
  expect(href).toContain('tiene manchas y perdió el brillo')
  expect(href).toContain('(Los vi en TikTok.)')
  await expect(page.getByTestId('lead-form').getByRole('button', { name: 'Cuidar una superficie' })).toHaveAttribute('aria-pressed', 'true')
})

test('los proyectos se filtran por línea y cada caso lleva al siguiente', async ({ page }) => {
  await page.goto('/proyectos?linea=design')
  await expect(page.getByText('Comedor Sobremesa')).toBeVisible()
  await expect(page.getByText('Casa Bosque')).toHaveCount(0)
  await page.getByText('Comedor Sobremesa').click()
  await expect(page).toHaveURL(/\/proyectos\/comedor-sobremesa/)
  const next = page.getByRole('link', { name: /Siguiente proyecto/ })
  await expect(next).toBeVisible()
  await next.click()
  await expect(page).not.toHaveURL(/comedor-sobremesa/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('el visor amplía la foto, acerca la veta y se cierra con Escape', async ({ page }) => {
  await page.goto('/design/mesa-estrato')
  const trigger = page.getByRole('button', { name: /^Ampliar foto/ }).first()
  await trigger.click()
  const box = page.getByTestId('lightbox')
  await expect(box).toBeVisible()
  await expect(box.getByRole('button', { name: 'Cerrar visor' })).toBeFocused()
  await expect(box).toContainText('1 / 3')
  await page.keyboard.press('ArrowRight')
  await expect(box).toContainText('2 / 3')
  await box.getByRole('button', { name: 'Acercar la veta' }).click()
  await expect(box.getByRole('button', { name: 'Alejar' })).toHaveAttribute('aria-pressed', 'true')
  await axe(page)
  await page.keyboard.press('Escape')
  await expect(box).toHaveCount(0)
  await expect(trigger).toBeFocused()
})

test('las páginas legales en borrador lo dicen y no se indexan', async ({ page, request }) => {
  await page.goto('/legal/datos-personales')
  await expect(page.getByRole('note')).toContainText('Borrador pendiente de revisión legal')
  expect(await page.locator('meta[name="robots"]').getAttribute('content')).toContain('noindex')
  const sitemap = await (await request.get('/sitemap.xml')).text()
  for (const path of ['/stone', '/care', '/proyectos', '/materiales', '/estudio']) expect(sitemap).toContain(`${path}<`)
  expect(sitemap).not.toContain('/legal/')
})
