import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import { es } from '@payloadcms/translations/languages/es'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Materials } from './collections/Materials'
import { Projects } from './collections/Projects'
import { Products } from './collections/Products'
import { Orders } from './collections/Orders'
import { Leads } from './collections/Leads'
import { Settings } from './globals/Settings'
import { Home } from './globals/Home'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const dbUri = process.env.DATABASE_URI || 'file:./caliza.db'

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: ' · Caliza' },
  },
  i18n: { supportedLanguages: { es }, fallbackLanguage: 'es' },
  collections: [Products, Projects, Materials, Orders, Leads, Media, Users],
  globals: [Home, Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-caliza-no-usar-en-produccion',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: dbUri.startsWith('postgres')
    ? postgresAdapter({ pool: { connectionString: dbUri } })
    : sqliteAdapter({ client: { url: dbUri } }),
  sharp,
})
