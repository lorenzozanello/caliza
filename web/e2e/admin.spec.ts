import { expect, test } from '@playwright/test'

test('el equipo entra al panel y ve el catálogo', async ({ page }) => {
  await page.goto('/admin/login')
  await page.waitForLoadState('networkidle')
  await page.getByLabel(/correo/i).fill(process.env.SEED_ADMIN_EMAIL || 'admin@caliza.co')
  await page.getByLabel(/contraseña/i).fill(process.env.SEED_ADMIN_PASSWORD || 'caliza-dev-2026')
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()
  await expect(page).not.toHaveURL(/login/)
  await page.goto('/admin/collections/products')
  await expect(page.getByText('Mesa Estrato').first()).toBeVisible()
})

test('la API no expone pedidos sin sesión', async ({ request }) => {
  const r = await request.get('/api/orders')
  expect([401, 403]).toContain(r.status())
})
