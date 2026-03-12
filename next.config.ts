import type { NextConfig } from 'next'

// GitHub Actions sets GITHUB_REPOSITORY as "owner/repo-name"
// This lets the same config work across multiple repos automatically
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath = repo ? `/${repo}` : ''

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
}

export default nextConfig
