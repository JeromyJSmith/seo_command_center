import { NextRequest, NextResponse } from 'next/server';
import { scanFolder } from '@repo/folder-scanner';

export async function POST(request: NextRequest) {
  try {
    const { folderPath } = await request.json();

    if (!folderPath || typeof folderPath !== 'string') {
      return NextResponse.json(
        { error: 'Invalid folderPath provided' },
        { status: 400 }
      );
    }

    const manifest = await scanFolder(folderPath);

    return NextResponse.json(manifest);
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to scan folder',
      },
      { status: 500 }
    );
  }
}
