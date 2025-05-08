import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const nextConfig: NextConfig = {
  /* config options here */
  output:'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  typescript:{
    ignoreBuildErrors:true
  },
};
 
 
const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options:{
    remarkPlugins:[remarkGfm]
  }
})
 
// Merge MDX config with Next.js config
export default withMDX(nextConfig)
