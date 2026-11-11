import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/tienda', destination: '/design', permanent: true },
      { source: '/living-design', destination: '/design', permanent: true },
      { source: '/stone-design', destination: '/stone', permanent: true },
      { source: '/stone-care', destination: '/care', permanent: true },
      { source: '/grupo', destination: '/estudio', permanent: true },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
