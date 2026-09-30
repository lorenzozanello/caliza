import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const axe = async (page: import('@playwright/test').Page) => {
  await expect(page).toHaveTitle(/Caliza/)
  const r = await new AxeBuilder({ page: page as never }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).disableRules(['color-contrast']).analyze()
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([])
}

test.beforeEach(async ({ page }) => {
  page.on('pageerror', (e) => { throw e })
})

test('la home presenta las tres líneas, la colección y el contacto', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Piedra natural')
  for (const line of ['Stone', 'Design', 'Care']) await expect(page.getByText(`Caliza ${line}`).first()).toBeAttached()
  await expect(page.getByText('Mesa Estrato').first()).toBeAttached()
  await expect(page.locator('#contacto')).toBeAttached()
  await axe(page)
})

test('los enlaces de WhatsApp llevan el origen de la campaña', async ({ page }) => {
  await page.goto('/?utm_source=instagram')
  await page.goto('/design/mesa-estrato')
  const href = await page.getByTestId('wa-config').getAttribute('href')
  expect(href).toContain('wa.me/570000000000')
  expect(decodeURIComponent(href!)).toContain('Mesa Estrato')
  expect(decodeURIComponent(href!)).toContain('(Los vi en Instagram.)')
})

test('la tienda filtra por disponibilidad', async ({ page }) => {
  await page.goto('/design?disponibilidad=inmediata')
  await expect(page.getByText('Consola Umbral')).toBeVisible()
  await expect(page.getByText('Mesa Estrato')).toHaveCount(0)
  await axe(page)
})

test('el configurador recalcula el precio', async ({ page }) => {
  await page.goto('/design/mesa-estrato')
  await expect(page.getByTestId('price')).toHaveText(/8\.900\.000/)
  await page.getByTestId('size').getByRole('button', { name: /10 personas/ }).click()
  await expect(page.getByTestId('price')).toHaveText(/10\.600\.000/)
  await page.getByRole('button', { name: /Oscuro profundo/ }).click()
  await expect(page.getByTestId('stone-name')).toHaveText('Oscuro profundo')
  await expect(page.getByTestId('price')).toHaveText(/11\.200\.000/)
  await axe(page)
})

test('compra completa: carrito, pago con anticipo y seguimiento', async ({ page }) => {
  await page.goto('/design/mesa-estrato')
  await page.getByTestId('add-to-cart').click()
  await page.getByRole('link', { name: /Ir a pagar/ }).click()
  await expect(page).toHaveURL(/\/checkout/)
  await page.getByTestId('pay').click()
  await expect(page.getByText('Escribe tu nombre completo.')).toBeVisible()
  await page.getByLabel('Nombre completo').fill('Cliente de Prueba')
  await page.getByLabel('WhatsApp').fill('3001234567')
  await page.getByLabel('Dirección').fill('Calle 1 # 2-3')
  await expect(page.getByTestId('today')).toHaveText(/4\.450\.000/)
  await page.getByTestId('pay').click()
  await expect(page).toHaveURL(/\/pago\/simulado/)
  await page.getByTestId('decline').click()
  await expect(page).toHaveURL(/pago=rechazado/)
  await expect(page.getByText('El pago no se completó')).toBeVisible()
  await page.getByRole('button', { name: /Pagar/ }).click()
  await page.getByTestId('approve').click()
  await expect(page.getByTestId('order-stage')).toHaveText('Anticipo recibido')
  await expect(page.getByTestId('amount-paid')).toHaveText(/4\.450\.000/)
  await expect(page.getByTestId('timeline').locator('li').first()).toHaveClass(/done/)
  await expect(page.getByTestId('timeline').locator('li.now')).toContainText('Elegimos tu placa')
  await axe(page)
})

const stockOf = async (request: import('@playwright/test').APIRequestContext, slug: string) => {
  const r = await request.get(`/api/products?where[slug][equals]=${slug}&depth=0`)
  return ((await r.json()).docs[0]?.stock ?? 0) as number
}

test('la entrega inmediata se paga completa y descuenta unidades', async ({ page, request }) => {
  const before = await stockOf(request, 'consola-umbral')
  expect(before).toBeGreaterThan(0)
  await page.goto('/design/consola-umbral')
  await page.getByTestId('add-to-cart').click()
  await page.goto('/checkout')
  await expect(page.getByTestId('plan-anticipo')).toHaveCount(0)
  await page.getByLabel('Nombre completo').fill('Cliente de Prueba')
  await page.getByLabel('WhatsApp').fill('3001234567')
  await page.getByLabel('Dirección').fill('Calle 1 # 2-3')
  await page.getByTestId('pay').click()
  await page.getByTestId('approve').click()
  await expect(page.getByTestId('order-stage')).toHaveText('Pago recibido')
  expect(await stockOf(request, 'consola-umbral')).toBe(before - 1)
})

test('el formulario de contacto registra el prospecto', async ({ page }) => {
  await page.goto('/#contacto')
  const form = page.getByTestId('lead-form')
  await form.getByLabel('Nombre').fill('Prospecto de Prueba')
  await form.getByLabel('WhatsApp').fill('3009876543')
  await form.getByRole('button', { name: /Agendar videollamada/ }).click()
  await expect(page.getByTestId('lead-success')).toBeVisible()
})

test('una página inexistente responde 404', async ({ page }) => {
  const r = await page.goto('/design/no-existe')
  expect(r?.status()).toBe(404)
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toBeVisible()
})

test('las imágenes del catálogo cargan en cualquier dominio', async ({ page }) => {
  for (const path of ['/', '/design', '/design/mesa-estrato', '/proyectos/casa-bosque']) {
    await page.goto(path)
    const srcs = await page.locator('main img').evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute('src') ?? ''))
    expect(srcs.filter((s) => /^https?:\/\/localhost:3000/.test(s))).toEqual([])
    for (const src of new Set(srcs.filter((s) => s.startsWith('/')))) {
      expect((await page.request.get(src)).status(), src).toBe(200)
    }
  }
})
