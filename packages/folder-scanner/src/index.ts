import { FolderNode, FileManifest } from '@repo/core'
import { promises as fs } from 'fs'
import { join, basename } from 'path'

export async function scanFolder(folderPath: string): Promise<FileManifest> {
  const structure = await scanDirectory(folderPath)
  const manifest = generateManifest(structure)
  return manifest
}

async function scanDirectory(dirPath: string): Promise<FolderNode> {
  const name = basename(dirPath)
  const entries = await fs.readdir(dirPath, { withFileTypes: true })

  const children: FolderNode[] = []

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    const node: FolderNode = {
      id: fullPath,
      name: entry.name,
      path: fullPath,
      type: entry.isDirectory() ? 'directory' : 'file',
    }

    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      node.children = (await scanDirectory(fullPath)).children || []
    }

    children.push(node)
  }

  return {
    id: dirPath,
    name,
    path: dirPath,
    type: 'directory',
    children,
  }
}

function generateManifest(structure: FolderNode): FileManifest {
  const filesByType: Record<string, number> = {}
  let totalFiles = 0
  let totalDirectories = 0

  function traverse(node: FolderNode) {
    if (node.type === 'directory') {
      totalDirectories++
      node.children?.forEach(traverse)
    } else {
      totalFiles++
      const ext = node.name.split('.').pop() || 'no-extension'
      filesByType[ext] = (filesByType[ext] || 0) + 1
    }
  }

  traverse(structure)

  return {
    totalFiles,
    totalDirectories,
    filesByType,
    structure: structure.children || [],
  }
}
