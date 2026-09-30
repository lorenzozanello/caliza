import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'
import { cache } from 'react'

export const getPayloadClient = cache(() => getPayload({ config }))

export const getSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'settings', depth: 0 })
})
