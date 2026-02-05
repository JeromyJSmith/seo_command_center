// Vercel AI SDK Client
// Wrapper for AI Gateway integration with Claude API

import { generateText, streamText, LanguageModel } from 'ai'
import { z } from 'zod'
import { FileManifest, FolderNode } from '@repo/core'

export interface AIClientConfig {
  apiKey?: string
  model?: string
}

export class AIClient {
  private apiKey: string
  private model: string

  constructor(config: AIClientConfig = {}) {
    this.apiKey = config.apiKey || process.env.AI_GATEWAY_API_KEY || ''
    this.model = config.model || 'anthropic/claude-3-5-sonnet'
  }

  private buildFileTree(nodes: FolderNode[], indent = 0): string {
    let tree = ''
    for (const node of nodes) {
      const prefix = '  '.repeat(indent)
      if (node.type === 'file') {
        tree += `${prefix}├── ${node.name}\n`
      } else {
        tree += `${prefix}├── ${node.name}/\n`
        if (node.children) {
          tree += this.buildFileTree(node.children, indent + 1)
        }
      }
    }
    return tree
  }

  async generateReadme(folderInfo: {
    folderPath: string
    manifest: FileManifest
  }): Promise<string> {
    const { folderPath, manifest } = folderInfo
    const folderName = folderPath.split('/').pop() || 'Project'
    const fileTree = this.buildFileTree(manifest.structure)

    const prompt = `You are an AI documentation specialist. Generate a comprehensive README.agent.md file for the following folder structure. This documentation should help AI agents understand the purpose, structure, and usage of this folder.

Folder Name: ${folderName}
Folder Path: ${folderPath}

Folder Statistics:
- Total Files: ${manifest.totalFiles}
- Total Directories: ${manifest.totalDirectories}
- File Types: ${Object.entries(manifest.filesByType).map(([type, count]) => `${type} (${count})`).join(', ')}

Folder Structure:
\`\`\`
${fileTree}
\`\`\`

Generate a detailed README.agent.md with the following sections:

1. **Purpose**: A brief description of what this folder contains and its primary function.
2. **Agent Usage**: How AI agents should interact with files in this folder, any conventions to follow.
3. **Contents**: Detailed breakdown of key directories and files, their purposes, and relationships.
4. **File Organization**: Best practices for organizing files in this folder.
5. **Dependencies**: Any external dependencies or relationships to other folders.
6. **Integration Points**: Key entry points or interfaces for integration with other systems.
7. **Notes for AI Systems**: Any special considerations for AI agents when working with this folder.

Format the response as clean, well-structured markdown with proper heading hierarchy. Be specific to the actual file structure provided.`

    const result = await generateText({
      model: this.model as unknown as LanguageModel,
      prompt,
    })

    // Wrap with frontmatter
    const frontmatter = `---
generated: ${new Date().toISOString()}
folder: ${folderName}
path: ${folderPath}
---

`

    return frontmatter + result.text
  }

  async* streamFolderAnalysis(folderPath: string) {
    const prompt = `Analyze this folder structure and provide insights: ${folderPath}`

    const stream = await streamText({
      model: this.model as unknown as LanguageModel,
      prompt,
    })

    for await (const chunk of stream.textStream) {
      yield chunk
    }
  }
}

export { z as Zod }
