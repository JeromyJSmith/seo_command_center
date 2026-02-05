// Vercel AI SDK Client
// Wrapper for AI Gateway integration

import { generateText, streamText, LanguageModel } from 'ai'
import { z } from 'zod'

export interface AIClientConfig {
  apiKey: string
  model?: string
}

export class AIClient {
  private apiKey: string
  private model: string

  constructor(config: AIClientConfig) {
    this.apiKey = config.apiKey
    this.model = config.model || 'openai/gpt-4-turbo'
  }

  async generateReadme(folderInfo: {
    name: string
    description: string
    files: string[]
  }): Promise<string> {
    const prompt = `Generate a README.agent.md file for a folder with the following information:

Folder Name: ${folderInfo.name}
Description: ${folderInfo.description}
Files: ${folderInfo.files.join(', ')}

The README should include:
1. Purpose - What this folder contains and why
2. Agent Usage - How AI agents should interact with this folder
3. Contents - Key files and structure
4. Tools Available - Any scripts or resources
5. Dependencies - Relationships to other folders

Format as markdown.`

    const result = await generateText({
      model: this.model as unknown as LanguageModel,
      prompt,
      apiKey: this.apiKey,
    })

    return result.text
  }

  async* streamFolderAnalysis(folderPath: string) {
    const prompt = `Analyze this folder structure and provide insights: ${folderPath}`

    const stream = await streamText({
      model: this.model as unknown as LanguageModel,
      prompt,
      apiKey: this.apiKey,
    })

    for await (const chunk of stream.textStream) {
      yield chunk
    }
  }
}

export { z as Zod }
