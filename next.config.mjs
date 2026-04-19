/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export — no serverless functions, no Node.js server.
  // Vercel serves the output as plain static files from the CDN edge.
  output: 'export',
};

export default nextConfig;
