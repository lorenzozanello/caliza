import test from 'node:test'
import assert from 'node:assert/strict'
import { PUBLIC_PRODUCT, PUBLIC_PROJECT, PUBLIC_MATERIAL } from '../src/lib/publication.ts'
import { CALIZA_WHATSAPP, CALIZA_INSTAGRAM, CALIZA_TIKTOK, officialWhatsApp, officialSocialProfile } from '../src/lib/official-channels.ts'

function evaluate(where, record) {
  if (where.and) return where.and.every((clause) => evaluate(clause, record))
  for (const [key, operators] of Object.entries(where)) {
    const value = record[key]
    if ('equals' in operators && value !== operators.equals) return false
    if ('not_equals' in operators && value === operators.not_equals) return false
    if ('exists' in operators && (value !== null && value !== undefined && value !== '') !== operators.exists) return false
  }
  return true
}

test('no product from an empty or illustrative catalogue can be published', () => {
  const approved = { sourceProductId: 'CAT-001', status: 'publicado', publicationApproved: true, imageRightsConfirmed: true, isExample: false }
  assert.equal(evaluate(PUBLIC_PRODUCT, approved), true)
  for (const key of ['sourceProductId', 'status', 'publicationApproved', 'imageRightsConfirmed', 'isExample']) {
    const invalid = { ...approved, [key]: { sourceProductId: '', status: 'borrador', publicationApproved: false, imageRightsConfirmed: false, isExample: true }[key] }
    assert.equal(evaluate(PUBLIC_PRODUCT, invalid), false, `${key} must block publication`)
  }
})

test('projects and materials need a source record and approval', () => {
  assert.equal(evaluate(PUBLIC_PROJECT, { sourceProjectId: 'PROY-001', publicationApproved: true, imageRightsConfirmed: true, isExample: false }), true)
  assert.equal(evaluate(PUBLIC_PROJECT, { sourceProjectId: '', publicationApproved: true, imageRightsConfirmed: true, isExample: false }), false)
  assert.equal(evaluate(PUBLIC_MATERIAL, { sourceMaterialId: null, publicationApproved: true }), false)
  assert.equal(evaluate(PUBLIC_MATERIAL, { sourceMaterialId: 'MAT-001', publicationApproved: true }), true)
})

test('legacy CMS profiles never override confirmed owner channels', () => {
  assert.equal(officialWhatsApp('570000000000'), CALIZA_WHATSAPP)
  assert.equal(officialWhatsApp('573001112233'), CALIZA_WHATSAPP)
  assert.equal(officialWhatsApp(CALIZA_WHATSAPP), CALIZA_WHATSAPP)
  assert.equal(officialSocialProfile('https://www.instagram.com/otheraccount/', 'instagram'), CALIZA_INSTAGRAM)
  assert.equal(officialSocialProfile('https://www.tiktok.com/@otheraccount', 'tiktok'), CALIZA_TIKTOK)
  assert.equal(officialSocialProfile('https://www.instagram.com/calizastonedesign/', 'instagram'), CALIZA_INSTAGRAM)
  assert.equal(officialSocialProfile('https://www.tiktok.com/@calizastone', 'tiktok'), CALIZA_TIKTOK)
})
