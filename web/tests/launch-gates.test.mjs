import test from 'node:test'
import assert from 'node:assert/strict'
import { publicSiteApproved, commerceApproved, previewSimulationApproved, CALIZA_TARGET_DOMAIN } from '../src/lib/launch-gates.ts'

const granted = Object.freeze({
  NEXT_PUBLIC_SITE_URL: 'https://calizagroup.shop',
  CALIZA_DOMAIN_VERIFIED: 'true',
  CALIZA_LEGAL_APPROVED: 'true',
  CALIZA_PUBLICATION_APPROVED: 'true',
  CALIZA_PRODUCTS_APPROVED: 'true',
  CALIZA_CHECKOUT_APPROVED: 'true',
  CALIZA_PAYMENT_PROVIDER_APPROVED: 'true',
  PAYMENTS_PROVIDER: 'wompi',
})
test('no QA/public launch without domain, legal and owner approval', () => {
  assert.equal(CALIZA_TARGET_DOMAIN, 'calizagroup.shop')
  assert.equal(publicSiteApproved({}), false)
  assert.equal(publicSiteApproved(granted), true)
  for (const key of ['CALIZA_DOMAIN_VERIFIED','CALIZA_LEGAL_APPROVED','CALIZA_PUBLICATION_APPROVED','NEXT_PUBLIC_SITE_URL']) {
    assert.equal(publicSiteApproved({ ...granted, [key]: undefined }), false, key)
  }
  for (const url of ['http://calizagroup.shop','https://calizagroup.shop.evil.com',
    'https://preview.vercel.app','https://calizagroup.shop/other','https://user@calizagroup.shop']) {
    assert.equal(publicSiteApproved({ ...granted, NEXT_PUBLIC_SITE_URL: url }), false, url)
  }
})
test('checkout stays off until all independent payment gates are satisfied', () => {
  assert.equal(commerceApproved({}), false)
  assert.equal(commerceApproved(granted), true)
  for (const key of ['CALIZA_PRODUCTS_APPROVED','CALIZA_CHECKOUT_APPROVED','CALIZA_PAYMENT_PROVIDER_APPROVED']) {
    assert.equal(commerceApproved({ ...granted, [key]: 'false' }), false, key)
  }
  assert.equal(commerceApproved({ ...granted, PAYMENTS_PROVIDER: 'simulated' }), false)
})
test('simulated payments are never permitted in Production', () => {
  assert.equal(previewSimulationApproved({}), false)
  assert.equal(previewSimulationApproved({NODE_ENV:'production',VERCEL_ENV:'preview',CALIZA_TEST_PAYMENTS_APPROVED:'true',PAYMENTS_PROVIDER:'simulated'}), false)
  assert.equal(previewSimulationApproved({NODE_ENV:'development',VERCEL_ENV:'preview',CALIZA_TEST_PAYMENTS_APPROVED:'true',PAYMENTS_PROVIDER:'simulated'}), true)
})
