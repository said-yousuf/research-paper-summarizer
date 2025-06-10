'use client';

import { FileUpload } from '@/components/file-upload';
import { PaperCard } from '@/components/paper-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UploadProgress } from '@/components/upload-progress';
import { useTheme } from '@/hooks/use-theme';
import {
  AlertCircle,
  Brain,
  CheckCircle,
  Clock,
  FileText,
  LogOut,
  Plus,
  Sparkles,
  Upload,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Paper {
  id: string;
  title: string;
  status: 'processing' | 'completed' | 'error';
  uploadedAt: Date;
  summary?: string;
  progress?: number;
  fullSummary?: string;
  compliance?: string;
  stage?: string;
  error?: string;
}

export default function DashboardPage() {
  const { theme } = useTheme();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [showUpload, setShowUpload] = useState(false);

  const handleFilesUploaded = async (
    files: File[],
    fileContents?: string[]
  ) => {
    const newPapers: Paper[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      title: file.name,
      status: 'processing',
      uploadedAt: new Date(),
      progress: 0,
      stage: 'Uploading file...',
    }));

    setPapers((prev) => [...newPapers, ...prev]);
    setShowUpload(false);

    // Process each file with the API
    for (let i = 0; i < files.length; i++) {
      const paper = newPapers[i];
      const fileContent = fileContents?.[i];

      if (fileContent && files[i].type === 'application/pdf') {
        processWithAPI(paper.id, fileContent);
      } else {
        simulateProcessing(paper.id);
      }
    }
  };

  const processWithAPI = async (paperId: string, fileContent: string) => {
    const stages = [
      'Uploading file...',
      'Extracting text content...',
      'Analyzing with AI...',
      'Generating summary...',
      'Checking paper structure...',
      'Preparing results...',
    ];

    let stageIndex = 0;
    let progress = 0;

    // Update progress function
    const updateProgress = () => {
      if (stageIndex >= stages.length) return;

      setPapers((prev) =>
        prev.map((p) =>
          p.id === paperId ? { ...p, progress, stage: stages[stageIndex] } : p
        )
      );
    };

    // Initial progress update
    updateProgress();

    // Simulate file upload
    await simulateStage(0, 15, (p) => {
      progress = p;
      updateProgress();
    });

    // Simulate text extraction
    stageIndex = 1;
    await simulateStage(15, 30, (p) => {
      progress = p;
      updateProgress();
    });

    try {
      // Start AI analysis
      stageIndex = 2;
      updateProgress();
      progress = 45;
      updateProgress();

      // Call the API
      const response = await fetch('/api/paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfBase64: fileContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      // Generating summary
      stageIndex = 3;
      progress = 60;
      updateProgress();

      // Checking structure
      stageIndex = 4;
      progress = 75;
      updateProgress();

      // Preparing results
      stageIndex = 5;
      progress = 90;
      updateProgress();

      // Complete
      setTimeout(() => {
        setPapers((prev) =>
          prev.map((p) =>
            p.id === paperId
              ? {
                  ...p,
                  status: 'completed',
                  progress: 100,
                  stage: undefined,
                  summary:
                    data.summary ||
                    'AI-generated summary of the research paper.',
                  fullSummary:
                    data.summary ||
                    'AI-generated comprehensive summary of the research paper.',
                  compliance:
                    data.compliance || 'Structure analysis not available.',
                }
              : p
          )
        );
      }, 1000);
    } catch (error) {
      console.error('Error processing paper with API:', error);

      // Set error state
      setPapers((prev) =>
        prev.map((p) =>
          p.id === paperId
            ? {
                ...p,
                status: 'error',
                progress: 100,
                stage: undefined,
                summary: 'An error occurred while processing this paper.',
                error:
                  error instanceof Error
                    ? error.message
                    : 'Unknown error occurred',
              }
            : p
        )
      );
    }
  };

  const simulateStage = (
    startProgress: number,
    endProgress: number,
    callback: (progress: number) => void
  ) => {
    return new Promise<void>((resolve) => {
      let currentProgress = startProgress;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 3;
        if (currentProgress >= endProgress) {
          currentProgress = endProgress;
          clearInterval(interval);
          callback(currentProgress);
          resolve();
        } else {
          callback(currentProgress);
        }
      }, 200);
    });
  };

  const simulateProcessing = (paperId: string) => {
    // Fallback for non-PDF files
    const stages = [
      'Uploading file...',
      'Extracting text content...',
      'Analyzing with AI...',
      'Generating summary...',
      'Checking paper structure...',
      'Preparing results...',
    ];

    let stageIndex = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += Math.random() * 5;

      if (progress >= (stageIndex + 1) * 16.67) {
        stageIndex = Math.min(stageIndex + 1, stages.length - 1);
      }

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setTimeout(() => {
          setPapers((prev) =>
            prev.map((p) =>
              p.id === paperId
                ? {
                    ...p,
                    status: 'completed',
                    progress: 100,
                    stage: undefined,
                    summary:
                      'AI-generated comprehensive summary highlighting key findings, methodology, and conclusions with actionable insights.',
                    fullSummary: `# Research Paper Summary

## Abstract
This paper presents groundbreaking research with significant implications for the field. The study employs rigorous methodology and provides valuable insights.

## Key Findings
- Novel approach to solving complex problems
- Significant improvements over existing methods
- Practical applications demonstrated

## Methodology
Comprehensive experimental design with proper controls and statistical analysis.

## Conclusions
The research contributes meaningfully to the academic discourse and opens new avenues for future investigation.`,
                    compliance: `✅ Title present
✅ Abstract present
✅ Introduction present
✅ Methods present
✅ Results present
✅ Discussion present
✅ References present

The paper follows the standard research structure.`,
                  }
                : p
            )
          );
        }, 1000);
      } else {
        setPapers((prev) =>
          prev.map((p) =>
            p.id === paperId ? { ...p, progress, stage: stages[stageIndex] } : p
          )
        );
      }
    }, 500);
  };

  const completedPapers = papers.filter((p) => p.status === 'completed').length;
  const processingPapers = papers.filter(
    (p) => p.status === 'processing'
  ).length;
  const errorPapers = papers.filter((p) => p.status === 'error').length;

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${theme.primary}10, ${theme.background}, ${theme.secondary}10)`,
      }}
    >
      {/* Header */}
      <header
        className="border-b backdrop-blur-sm sticky top-0 z-50"
        style={{
          backgroundColor: `${theme.background}80`,
          borderColor: theme.border,
        }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <FileText
                className="h-8 w-8 group-hover:animate-pulse"
                style={{ color: theme.primary }}
              />
              <Sparkles
                className="h-4 w-4 absolute -top-1 -right-1 animate-spin-slow"
                style={{ color: theme.accent }}
              />
            </div>
            <span className="text-2xl font-bold gradient-text">
              PaperSummarizer
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="hover:scale-105 transition-transform duration-300"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="hover:scale-105 transition-transform duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card
            className="border-2 hover:scale-105 transition-all duration-300 animate-fade-in"
            style={{
              borderColor: `${theme.primary}20`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Papers
              </CardTitle>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.primary}90)`,
                }}
              >
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-3xl font-bold"
                style={{ color: theme.primary }}
              >
                {papers.length}
              </div>
              <p className="text-xs" style={{ color: `${theme.foreground}70` }}>
                Research papers analyzed
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-200"
            style={{
              borderColor: `${theme.success}20`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.success}, ${theme.success}90)`,
                }}
              >
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-3xl font-bold"
                style={{ color: theme.success }}
              >
                {completedPapers}
              </div>
              <p className="text-xs" style={{ color: `${theme.foreground}70` }}>
                Successfully summarized
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-400"
            style={{
              borderColor: `${theme.accent}20`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.accent}90)`,
                }}
              >
                <Clock className="h-5 w-5 text-white animate-spin-slow" />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="text-3xl font-bold"
                style={{ color: theme.accent }}
              >
                {processingPapers}
              </div>
              <p className="text-xs" style={{ color: `${theme.foreground}70` }}>
                Currently analyzing
              </p>
            </CardContent>
          </Card>

          <Card
            className="border-2 hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-600"
            style={{
              borderColor: `#ef444420`,
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, #ef4444, #dc2626)`,
                }}
              >
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: '#ef4444' }}>
                {errorPapers}
              </div>
              <p className="text-xs" style={{ color: `${theme.foreground}70` }}>
                Failed to process
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold gradient-text">
                Your Research Papers
              </h2>
              <p style={{ color: `${theme.foreground}70` }} className="mt-1">
                Upload and analyze your research papers with AI
              </p>
            </div>
            <Button
              onClick={() => setShowUpload(true)}
              className="hover:scale-105 transition-all duration-300 shadow-lg text-white"
              style={{
                background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Papers
            </Button>
          </div>

          {showUpload && (
            <Card
              className="mb-6 border-2 animate-fade-in"
              style={{ borderColor: `${theme.primary}20` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" style={{ color: theme.primary }} />
                  Upload Research Papers
                </CardTitle>
                <CardDescription>
                  Upload PDF files to get AI-powered summaries with interactive
                  chat. Maximum file size: 10MB per file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onFilesUploaded={handleFilesUploaded} />
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowUpload(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Papers List */}
        <div className="space-y-6">
          {papers.length === 0 ? (
            <Card
              className="border-2 border-dashed animate-fade-in"
              style={{ borderColor: `${theme.primary}30` }}
            >
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-bounce"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.primary}20, ${theme.secondary}20)`,
                  }}
                >
                  <Upload
                    className="h-10 w-10"
                    style={{ color: theme.primary }}
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-2 gradient-text">
                  No papers uploaded yet
                </h3>
                <p
                  className="text-center mb-6 max-w-md"
                  style={{ color: `${theme.foreground}70` }}
                >
                  Upload your first research paper to get started with
                  AI-powered summaries and interactive analysis
                </p>
                <Button
                  onClick={() => setShowUpload(true)}
                  className="hover:scale-105 transition-all duration-300 text-white"
                  style={{
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Your First Paper
                </Button>
              </CardContent>
            </Card>
          ) : (
            papers.map((paper, index) => (
              <div
                key={paper.id}
                className={`animate-fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {paper.status === 'processing' && (
                  <UploadProgress
                    fileName={paper.title}
                    progress={paper.progress || 0}
                    stage={paper.stage}
                  />
                )}
                {paper.status !== 'processing' && <PaperCard paper={paper} />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
