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


test('TikTok: solo se pide el script externo tras clic explícito', async ({ page }) => {
  let externalRequests = 0
  await page.route('https://www.tiktok.com/embed.js', async route => {
    externalRequests += 1
    await route.fulfill({ status: 200, contentType: 'application/javascript', body: '/* stub oficial en QA: no representa feed real */' })
  })
  await page.goto('/index.html#/')
  await expect(page.locator('#caliza-tiktok-widget')).toBeHidden()
  expect(externalRequests).toBe(0)
  await page.getByRole('button', { name: /Mostrar videos de TikTok/ }).click()
  await expect(page.locator('#caliza-tiktok-widget')).toBeVisible()
  await expect(page.locator('#caliza-tiktok-widget blockquote.tiktok-embed')).toHaveAttribute('data-unique-id', 'calizastone')
  await expect.poll(() => externalRequests).toBe(1)
  expect(externalRequests).toBe(1)
})


test('navegación estable: sin transiciones root, sin colisiones ni scroll horizontal', async ({ page }, info) => {
  await page.addInitScript(() => {
    (document as Document & { startViewTransition?: (...args: unknown[]) => unknown }).startViewTransition = () => {
      throw new Error('Root View Transition deshabilitada para evitar superposición')
    }
  })
  const routeList = ['/', '/living-design/coleccion', '/living-design/familia/mesas-de-comedor',
    '/stone-design', '/stone-design/brief', '/stone-care', '/stone-care/diagnostico',
    '/proyectos', '/materiales', '/inspiracion', '/contacto', '/grupo']
  for (const route of routeList) {
    await page.goto('/index.html#' + route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    const geometry = await page.evaluate(() => {
      const main = document.getElementById('main')!
      const footer = document.querySelector('.o8-footer')!
      const header = document.querySelector('.o8-header')!
      const a=main.getBoundingClientRect(), b=footer.getBoundingClientRect(), h=header.getBoundingClientRect()
      return {headerBottom:h.bottom,mainTop:a.top, mainBottom:a.bottom,footerTop:b.top,
        viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
        mainHeight:a.height,scrollHeight:document.documentElement.scrollHeight}
    })
    expect(geometry.scrollWidth, route + ' horizontal overflow').toBeLessThanOrEqual(geometry.viewport+2)
    expect(geometry.mainTop, route + ' header overlap').toBeGreaterThanOrEqual(geometry.headerBottom-2)
    expect(geometry.mainBottom, route + ' footer overlap').toBeLessThanOrEqual(geometry.footerTop+2)
    expect(geometry.mainHeight, route + ' empty content').toBeGreaterThan(250)
    if (route === '/') {
      await page.screenshot({path:info.outputPath('caliza-home-settled.png'),fullPage:true,animations:'disabled'})
    }
  }
})

test('banner de revisión fuera del héroe y colección con dos tarjetas editoriales', async ({page}) => {
  await page.goto('/index.html#/')
  await expect(page.locator('.caliza-publication-note')).toHaveCount(1)
  const order=await page.evaluate(()=> {
    const main=document.getElementById('main')!, note=document.querySelector('.caliza-publication-note')!
    return Boolean(main.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING)
  })
  expect(order).toBeTruthy()
  await expect(page.locator('.caliza-family-grid-featured .caliza-family-card')).toHaveCount(2)
  const widths = await page.locator('.caliza-family-grid-featured .caliza-family-card').evaluateAll(els=>els.map(el=>el.getBoundingClientRect().width))
  expect(Math.min(...widths)).toBeGreaterThan(180)
})


test('foco editorial legible y CTA WhatsApp no oculta textos en ficha desktop', async ({page},info) => {
  await page.goto('/index.html#/living-design/coleccion')
  await page.locator('.caliza-family-card h3 a').first().click()
  await expect(page).toHaveURL(/#\/living-design\/familia\/mesas-de-comedor/)
  const heading=page.locator('.exp-page-intro h1')
  await expect(heading).toBeVisible()
  const style=await heading.evaluate(el=>({focused:el===document.activeElement,outline:getComputedStyle(el).outlineStyle}))
  expect(style.focused).toBeTruthy()
  expect(style.outline).toBe('none')
  const wa=page.locator('#floating-whatsapp')
  await expect(wa).toHaveAttribute('href',/wa\.me\/573025983218/)
  const width=await wa.evaluate(el=>el.getBoundingClientRect().width)
  expect(width).toBeLessThanOrEqual(64)
  const collision=await page.evaluate(()=>{
    const wa=document.querySelector('#floating-whatsapp')!.getBoundingClientRect()
    const p=document.querySelector('.caliza-detail-content>p')!.getBoundingClientRect()
    return Math.max(0,Math.min(wa.right,p.right)-Math.max(wa.left,p.left)) *
           Math.max(0,Math.min(wa.bottom,p.bottom)-Math.max(wa.top,p.top))
  })
  expect(collision).toBe(0)
  await page.screenshot({path:info.outputPath('familia-final-no-overlap.png'),fullPage:true,animations:'disabled'})
})

test('auditoría de accesibilidad WCAG A/AA en todas las rutas importantes', async ({ page }) => {
  const findings: Array<{ route: string; id: string; impact: string | null; selectors: string[][] }> = []
  for (const route of ['/', '/stone-design', '/stone-design/brief', '/living-design', '/living-design/coleccion', '/living-design/familia/mesas-de-comedor', '/stone-care', '/stone-care/diagnostico', '/proyectos', '/materiales', '/grupo', '/inspiracion', '/contacto']) {
    await page.goto('/index.html#' + route)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze()
    findings.push(...results.violations.map(v => ({
      route, id: v.id, impact: v.impact,
      selectors: v.nodes.map(n => n.target),
    })))
  }
  expect(findings).toEqual([])
})


test('R9: recuperar el sistema PR18 sin perder navegación, catálogo y trazabilidad', async ({ page }, info) => {
  test.setTimeout(150_000);
  const routes=['/','/stone-design','/living-design','/stone-care','/proyectos','/living-design/coleccion','/materiales','/archivo'];
  for(const route of routes){
    await page.goto('/index.html#'+route);
    await page.evaluate(()=>document.fonts.ready);
    await expect(page.getByRole('heading',{level:1})).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+2)).toBe(true);
    if(['/', '/stone-design','/living-design','/stone-care'].includes(route)){
      const hero=page.locator('.exp-hero');
      await expect(hero).toHaveCount(1);
      await expect(hero.locator('img')).toHaveCount(1);
      const properties=await hero.evaluate(el => {
        const img=el.querySelector('img') as HTMLImageElement;
        const heading=el.querySelector('h1') as HTMLElement;
        return {realHero:el.classList.contains('caliza-editorial-real-hero'),
          fit:getComputedStyle(img).objectFit,loaded:img.complete && img.naturalWidth>0,
          serif:getComputedStyle(heading).fontFamily};
      });
      expect(properties.realHero).toBe(false);
      expect(properties.fit).toBe('cover');
      expect(properties.loaded).toBe(true);
      expect(properties.serif).toMatch(/Playfair/);
    }
    if(route==='/'){
      await expect(page.locator('.o8-pillars .o8-pillar')).toHaveCount(3);
      await expect(page.locator('.caliza-r8-project-story')).toHaveCount(0);
      await expect(page.locator('.caliza-r8-living-story')).toHaveCount(0);
      await expect(page.locator('.caliza-r8-material-story')).toHaveCount(0);
      await expect(page.locator('.exp-banner')).toHaveCount(2);
      await expect(page.locator('.caliza-journeys')).toHaveCount(1);
    }
    const images=page.locator('#main img');
    for(let i=0,n=Math.min(await images.count(),route==='/'?9:6);i<n;i++){
      const im=images.nth(i);
      if(!(await im.isVisible()))continue;
      await im.scrollIntoViewIfNeeded();
      await expect.poll(()=>im.evaluate(el=>(el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth>0),
        {timeout:10_000}).toBe(true);
    }
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:info.outputPath('r9-'+(route==='/'?'home':route.replaceAll('/','-').replace(/^-/,'') )+'.png'),
      fullPage:route==='/',animations:'disabled'});
  }
});
