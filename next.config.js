/** @type {import('next').NextConfig} */
const nextConfig = {
  // Create a minimal self-contained production bundle so deployment
  // does not need to ship the full node_modules directory.
  output: 'standalone',
  async headers() {
    return [
      {
        source: '/api/payment/webhook',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ]
  },
}
module.exports = nextConfig
