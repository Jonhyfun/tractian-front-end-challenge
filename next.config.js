/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tractian-img.s3.amazonaws.com']
  }
}

module.exports = nextConfig
