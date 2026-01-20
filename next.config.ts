import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  images: {
    loader: 'custom',
    loaderFile: './image-loader.ts',
  },
  // Your Next.js config here
  webpack: (webpackConfig: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
} satisfies NextConfig

export default withPayload(nextConfig, { devBundleServerPackages: false })
