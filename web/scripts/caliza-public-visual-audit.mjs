/* Read-only public-site QA. No cookies/credentials, no form submissions, no state mutation. */
import { chromium, request } from '@playwright/test'
import fs from 'node:fs/promises'
const origin='https://www.calizagroup.shop'
const output='../artifacts/caliza-live-audit'
await fs.mkdir(output,{recursive:true})
const results={timestamp:new Date().toISOString(),url:origin,checks:[]}
const browser=await chromium.launch({headless:true})
const agent=await browser.newContext({ignoreHTTPSErrors:false})
try {
 for(const width of [1440,390]) {
  const page=await agent.newPage({viewport:{width,height:width===1440?900:844},deviceScaleFactor:1})
  try {
   const response=await page.goto(origin,{waitUntil:'domcontentloaded',timeout:25000})
   await page.waitForTimeout(1500)
   const findings=await page.evaluate(()=>({
     title:document.title,
     href:location.href,
     robots:document.querySelector('meta[name="robots"]')?.content ?? null,
     canonical:document.querySelector('link[rel="canonical"]')?.href ?? null,
     firstHeading:document.querySelector('h1')?.textContent?.trim()?.slice(0,130) ?? null,
     heroImage:document.querySelector('.exp-hero img')?.currentSrc ?? null,
     images:[...document.querySelectorAll('#main img')].slice(0,12).map(i=>({src:i.currentSrc,loaded:i.complete && i.naturalWidth>0})),
     overflow:document.documentElement.scrollWidth>window.innerWidth+3
   }))
   results.checks.push({width,httpStatus:response?.status(),headers:{'x-robots-tag':response?.headers()['x-robots-tag']||null},...findings})
   await page.screenshot({path:`${output}/live-${width}.png`,fullPage:true,animations:'disabled'})
  }catch(error){results.checks.push({width,error:String(error).slice(0,400)})}
  finally{await page.close()}
 }
 const api=await request.newContext()
 for(const path of ['/robots.txt','/sitemap.xml']){
  try{const r=await api.get(origin+path,{timeout:15000});results[path]={status:r.status(),text:(await r.text()).slice(0,1400),headers:{'content-type':r.headers()['content-type']}}}
  catch(error){results[path]={error:String(error).slice(0,320)}}
 }
}catch(error){results.unexpectedError=String(error).slice(0,400)}
finally{await browser.close()}
await fs.writeFile(`${output}/audit.json`,JSON.stringify(results,null,2))
console.log('CALIZA READ-ONLY PUBLIC AUDIT:',JSON.stringify(results).slice(0,5000))
if(results.checks.every(c=>c.error))process.exitCode=2
