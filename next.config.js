/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com', // This is essential for Cloudinary images
      'images.unsplash.com'
    ],
  },
}

module.exports = nextConfig