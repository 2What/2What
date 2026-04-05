/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for GitHub Pages — replace with your actual repo name
  basePath: "/2What",

  // Static export — required for GitHub Pages
  output: "export",

  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;