import { NextRequest, NextResponse } from 'next/server';
import { AIClient } from '@repo/ai-client';
import { FileManifest } from '@repo/core';
import fs from 'fs/promises';
import path from 'path';

const aiClient = new AIClient({});

export async function POST(request: NextRequest) {
  try {
    const { folderPath, manifest } = await request.json();

    if (!folderPath || !manifest) {
      return NextResponse.json(
        { error: 'Missing folderPath or manifest' },
        { status: 400 }
      );
    }

    // Generate README content using AI
    const readmeContent = await aiClient.generateReadme({
      folderPath,
      manifest: manifest as FileManifest,
    });

    // Create README.agent.md file
    const readmePath = path.join(folderPath, 'README.agent.md');
    await fs.writeFile(readmePath, readmeContent, 'utf-8');

    return NextResponse.json({
      success: true,
      filePath: readmePath,
      message: 'Documentation generated successfully',
    });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate documentation',
      },
      { status: 500 }
    );
  }
}
