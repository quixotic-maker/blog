import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Req 22.1/22.2: fully static generation for Homepage and all Project_Pages.
  output: 'export',
  // Req 22.3: author Project_Page content in MDX.
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  images: {
    // Static export cannot use the default (server) image optimizer.
    unoptimized: true,
  },
  reactStrictMode: true,
  // Allow cross-origin requests during development from local network
  allowedDevOrigins: ['192.168.1.124'],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
