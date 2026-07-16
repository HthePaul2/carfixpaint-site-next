import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Needed for a custom global 404 with multiple root layouts ((frontend) + (payload)).
    globalNotFound: true,
    // Inline CSS into HTML to remove render-blocking stylesheet round-trips (PSI cold load).
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/hero.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/hero.avif',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/hero-mobile.webp',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/hero-mobile.avif',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/servicii/mecanica-auto-brasov',
        destination: '/servicii/mecanica-diagnoza-climatizare-brasov',
        permanent: true,
      },
      {
        source: '/servicii/diagnoza-auto-brasov',
        destination: '/servicii/mecanica-diagnoza-climatizare-brasov',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
