// Core Types and Utilities
// Shared across all packages

export interface FolderNode {
  id: string
  name: string
  path: string
  type: 'file' | 'directory'
  children?: FolderNode[]
}

export interface FileManifest {
  totalFiles: number
  totalDirectories: number
  filesByType: Record<string, number>
  structure: FolderNode[]
}

export interface GenerationStatus {
  status: 'idle' | 'scanning' | 'generating' | 'complete' | 'error'
  progress: number
  currentFolder?: string
  error?: string
}
