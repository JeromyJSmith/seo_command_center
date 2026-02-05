'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { JsonView } from '@/components/json-view';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

interface ScanStatus {
  status: 'idle' | 'scanning' | 'complete' | 'error';
  progress?: number;
  message?: string;
  folderPath?: string;
}

interface GenerationStatus {
  status: 'idle' | 'generating' | 'complete' | 'error';
  message?: string;
  filePath?: string;
}

export default function AgentDashboard() {
  const [folderPath, setFolderPath] = useState('');
  const [scanStatus, setScanStatus] = useState<ScanStatus>({ status: 'idle' });
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({ status: 'idle' });
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleScan = async () => {
    if (!folderPath.trim()) {
      toast.error('Please enter a folder path');
      return;
    }

    setIsScanning(true);
    setScanStatus({ status: 'scanning', message: 'Analyzing folder structure...' });

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderPath }),
      });

      if (!response.ok) throw new Error('Scan failed');

      const data = await response.json();
      setScanResult(data);
      setScanStatus({
        status: 'complete',
        message: `Successfully scanned ${data.stats?.totalFiles || 0} files`,
        folderPath,
      });
      toast.success('Folder scanned successfully');
    } catch (error) {
      setScanStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Scan failed',
      });
      toast.error('Failed to scan folder');
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerate = async () => {
    if (!scanResult) {
      toast.error('Please scan a folder first');
      return;
    }

    setIsGenerating(true);
    setGenerationStatus({ status: 'generating', message: 'Generating AI documentation...' });

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderPath,
          manifest: scanResult,
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setGenerationStatus({
        status: 'complete',
        message: 'Documentation generated successfully',
        filePath: data.filePath,
      });
      toast.success('Documentation generated');
    } catch (error) {
      setGenerationStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Generation failed',
      });
      toast.error('Failed to generate documentation');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Agent Dashboard</h1>
          <p className="text-lg text-slate-600">
            Generate AI-powered documentation for your projects
          </p>
        </div>

        <div className="grid gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Scan Folder</CardTitle>
              <CardDescription>
                Enter the absolute path to a folder you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="/path/to/your/folder"
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  disabled={isScanning}
                />
                <Button
                  onClick={handleScan}
                  disabled={isScanning || !folderPath.trim()}
                  className="gap-2"
                >
                  {isScanning && <Loader2 className="h-4 w-4 animate-spin" />}
                  Scan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scan Status */}
          {scanStatus.status !== 'idle' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {scanStatus.status === 'scanning' && (
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                  )}
                  {scanStatus.status === 'complete' && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {scanStatus.status === 'error' && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Scan Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{scanStatus.message}</p>
                {scanStatus.folderPath && (
                  <Badge className="mt-2">{scanStatus.folderPath}</Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tabs for Results and Generation */}
          {scanResult && (
            <Tabs defaultValue="structure" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="structure">Folder Structure</TabsTrigger>
                <TabsTrigger value="generate">Generate Docs</TabsTrigger>
              </TabsList>

              <TabsContent value="structure" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scanned Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-950 rounded-lg p-4 overflow-auto max-h-96">
                      <JsonView
                        value={scanResult}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#e2e8f0',
                          lineHeight: '1.5',
                          fontSize: '12px',
                          fontFamily: 'monospace',
                        }}
                        collapsed={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="generate" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate Documentation</CardTitle>
                    <CardDescription>
                      Create AI-powered README.agent.md using your scanned folder structure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="w-full gap-2"
                      size="lg"
                    >
                      {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
                      Generate Documentation
                    </Button>

                    {generationStatus.status !== 'idle' && (
                      <Alert
                        variant={
                          generationStatus.status === 'error' ? 'destructive' : 'default'
                        }
                      >
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{generationStatus.message}</AlertDescription>
                      </Alert>
                    )}

                    {generationStatus.filePath && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm font-medium text-green-900">
                          Generated: {generationStatus.filePath}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
