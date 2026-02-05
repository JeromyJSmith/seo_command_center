'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { JsonView } from '@/components/json-view';
import { AlertCircle, Copy, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function JsonExplorer() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleParse = () => {
    try {
      setError(null);
      const data = JSON.parse(input);
      setParsed(data);
      toast.success('JSON parsed successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setParsed(null);
      toast.error('Failed to parse JSON');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setParsed(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">JSON Explorer</h1>
          <p className="text-lg text-slate-600">
            Parse, visualize, and explore JSON documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Paste your JSON here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder='{\n  "key": "value"\n}'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="font-mono text-sm h-96 resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={handleParse} className="flex-1">
                  Parse
                </Button>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="gap-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Copy
                </Button>
                <Button onClick={handleClear} variant="outline">
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Output</CardTitle>
              <CardDescription>
                {error ? 'Parsing error' : 'Formatted visualization'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {parsed && !error && (
                <div className="bg-slate-950 rounded-lg p-4 overflow-auto max-h-96">
                  <JsonView
                    value={parsed}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#e2e8f0',
                      lineHeight: '1.5',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>
              )}
              {!parsed && !error && (
                <div className="text-center py-12 text-slate-400">
                  <p>Parse JSON to see formatted output</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
