/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*'
      },
      {
        source: '/github',
        destination: 'https://github.com/nerdstarcode?tab=repositories'
      },
      {
        source: '/nerdstarcode/:path*',
        destination: 'https://github.com/nerdstarcode/:path*'
      },
    ]
  }
}

module.exports = nextConfig
