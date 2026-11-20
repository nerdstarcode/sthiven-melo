import type { NextConfig } from 'next'

const GITHUB_PROFILE = 'https://github.com/nerdstarcode'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/github', destination: `${GITHUB_PROFILE}?tab=repositories` },
      { source: '/nerdstarcode/:path*', destination: `${GITHUB_PROFILE}/:path*` },
    ]
  },
}

export default nextConfig
