#!/usr/bin/env node

/**
 * CLI Tool: Generate Agent Documentation
 * Scans a folder and generates AI-powered README.agent.md documentation
 * 
 * Usage:
 *   pnpm generate-docs <folder-path>
 *   pnpm generate-docs /path/to/my/project
 */

import { scanFolder } from '@repo/folder-scanner'
import { AIClient } from '@repo/ai-client'
import fs from 'fs/promises'
import path from 'path'

const args = process.argv.slice(2)

async function main() {
  if (args.length === 0) {
    console.error('❌ Error: Please provide a folder path')
    console.log('\nUsage:')
    console.log('  pnpm generate-docs <folder-path>')
    console.log('\nExample:')
    console.log('  pnpm generate-docs /path/to/my/project')
    process.exit(1)
  }

  const folderPath = args[0]

  try {
    // Verify folder exists
    const stats = await fs.stat(folderPath)
    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${folderPath}`)
    }

    console.log(`\n📁 Scanning folder: ${folderPath}`)

    // Scan folder
    const manifest = await scanFolder(folderPath)
    console.log(`✅ Scanned ${manifest.totalFiles} files in ${manifest.totalDirectories} directories`)

    // Log file type breakdown
    console.log('\n📊 File types found:')
    Object.entries(manifest.filesByType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`)
    })

    // Generate documentation
    console.log('\n🤖 Generating AI documentation...')
    const aiClient = new AIClient()
    const readmeContent = await aiClient.generateReadme({
      folderPath,
      manifest,
    })

    // Write README.agent.md
    const readmePath = path.join(folderPath, 'README.agent.md')
    await fs.writeFile(readmePath, readmeContent, 'utf-8')
    console.log(`✅ Documentation generated: ${readmePath}`)

    console.log('\n🎉 Done! Your AI documentation is ready.')
    console.log(`\nYou can now view the generated file at:`)
    console.log(`  ${readmePath}`)

  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
