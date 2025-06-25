'use client';

import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/hooks/use-theme';
import { Download, FileCheck, FileText, Sparkles } from 'lucide-react';

interface Paper {
  id: string;
  title: string;
  status: 'processing' | 'completed' | 'error';
  uploadedAt: Date;
  summary?: string;
  fullSummary?: string;
  compliance?: string;
}

interface SummaryViewerProps {
  paper: Paper;
  onClose: () => void;
}

export function SummaryViewer({ paper, onClose }: SummaryViewerProps) {
  const { theme } = useTheme();

  const handleDownload = () => {
    if (paper.fullSummary) {
      const blob = new Blob([paper.fullSummary], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${paper.title.replace('.pdf', '')}_summary.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full p-0 overflow-hidden"
        style={{ backgroundColor: theme.background }}
      >
        <DialogHeader
          className="p-6 pb-4 border-b"
          style={{
            background: `linear-gradient(to right, ${theme.primary}05, ${theme.secondary}05)`,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.secondary})`,
                }}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="h-4 w-4"
                    style={{ color: theme.primary }}
                  />
                  <span>AI Analysis</span>
                </div>
                <p
                  className="text-sm font-normal mt-1"
                  style={{ color: `${theme.foreground}70` }}
                >
                  {paper.title}
                </p>
              </div>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="hover:scale-105 transition-transform duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="summary" className="w-full">
          <div className="border-b" style={{ borderColor: theme.border }}>
            <TabsList className="p-0 bg-transparent">
              <TabsTrigger
                value="summary"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none py-3 px-6"
                style={{
                  color: theme.foreground,
                  borderColor: 'transparent',
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Summary
              </TabsTrigger>
              {paper.compliance && (
                <TabsTrigger
                  value="structure"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-secondary data-[state=active]:shadow-none py-3 px-6"
                  style={{
                    color: theme.foreground,
                    borderColor: 'transparent',
                  }}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Structure Analysis
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="summary" className="mt-0">
            <ScrollArea className="flex-1 p-6 max-h-[70vh] w-full overflow-auto">
              <div className="prose prose-sm w-full max-w-full break-words">
                {paper.fullSummary || paper.summary ? (
                  <ReactMarkdown>
                    {paper.fullSummary || paper.summary || ''}
                  </ReactMarkdown>
                ) : (
                  <p style={{ color: `${theme.foreground}70` }}>
                    No detailed summary available.
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {paper.compliance && (
            <TabsContent value="structure" className="mt-0">
              <ScrollArea className="flex-1 p-6 max-h-[70vh] w-full overflow-auto">
                <div className="prose prose-sm w-full max-w-full break-words">
                  <h2
                    className="text-xl font-semibold mb-4"
                    style={{ color: theme.secondary }}
                  >
                    Paper Structure Analysis
                  </h2>
                  <div className="space-y-4">
                    <ReactMarkdown
                      components={{
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 space-y-2">{children}</ul>
                        ),
                        li: ({ children }) => {
                          const content = Array.isArray(children) ? children[0] : children;
                          const isChecked = typeof content === 'string' && content.includes('✓');
                          const isWarning = typeof content === 'string' && content.includes('⚠️');
                          
                          return (
                            <li className="flex items-start gap-2">
                              {isChecked ? (
                                <span className="text-green-500 mt-1">✓</span>
                              ) : isWarning ? (
                                <span className="text-yellow-500 mt-1">⚠️</span>
                              ) : (
                                <span className="text-gray-400 mt-1">•</span>
                              )}
                              <span className="flex-1">
                                {typeof content === 'string' ? content.replace(/^\s*[✓•⚠️]\s*/, '') : children}
                              </span>
                            </li>
                          );
                        },
                        strong: ({ children }) => (
                          <strong className="font-semibold">
                            {children}
                          </strong>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">
                            {children}
                          </code>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-semibold mt-4 mb-2">
                            {children}
                          </h3>
                        ),
                      }}
                    >
                      {paper.compliance || 'No structure analysis available.'}
                    </ReactMarkdown>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
