/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{
      source: '/api/payment/webhook',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
    }]
  },
}
module.exports = nextConfig
