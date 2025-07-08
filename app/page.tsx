'use client';

import { QuickSummarize } from '@/components/quick-summarize';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTheme } from '@/hooks/use-theme';
import {
  ArrowRight,
  Brain,
  Clock,
  FileText,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [showQuickSummarize, setShowQuickSummarize] = useState(false);
  const { theme } = useTheme();

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: `linear-gradient(to bottom right, ${theme.muted}, ${theme.background}, ${theme.muted})`,
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-4 lg:px-6 h-20 flex items-center glass-effect"
        style={{
          background: `rgba(255, 255, 255, 0.8)`,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <Link
          className="flex items-center justify-center animate-bounce-in"
          href="/"
        >
          <div className="relative">
            <FileText
              className="h-8 w-8 animate-pulse-glow"
              style={{ color: theme.primary }}
            />
            <Sparkles
              className="h-4 w-4 absolute -top-1 -right-1 animate-spin-slow"
              style={{ color: theme.accent }}
            />
          </div>
          <span className="ml-3 text-2xl font-bold gradient-text">
            PaperSummarizer
          </span>
        </Link>
        <nav className="ml-auto flex gap-6 sm:gap-8 items-center">
          <Link
            className="text-sm font-medium hover:scale-105 transition-all duration-300"
            style={{ color: theme.foreground }}
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:scale-105 transition-all duration-300"
            style={{ color: theme.foreground }}
            href="#how-it-works"
          >
            How it Works
          </Link>
          <Button
            variant="outline"
            onClick={() => setShowQuickSummarize(true)}
            className="hidden sm:flex hover:scale-105 transition-transform duration-300"
          >
            Try Now
          </Button>
          <Link href="/dashboard">
            <Button
              className="hover:scale-105 transition-all duration-300 shadow-lg text-white"
              style={{
                background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
              }}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${theme.primary}10, transparent, ${theme.secondary}10)`,
            }}
          ></div>
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-6 animate-slide-in-left">
                <div className="space-y-4">
                  <div
                    className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium animate-bounce-in"
                    style={{
                      backgroundColor: `${theme.primary}20`,
                      color: theme.primary,
                    }}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI-Powered Research Assistant
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                    Summarize Research Papers with{' '}
                    <span className="gradient-text animate-pulse">
                      AI Magic
                    </span>
                  </h1>
                  <p
                    className="max-w-[600px] text-lg md:text-xl leading-relaxed"
                    style={{ color: `${theme.foreground}90` }}
                  >
                    Transform hours of reading into minutes of understanding.
                    Upload your research papers and get intelligent,
                    comprehensive summaries powered by cutting-edge AI
                    technology.
                  </p>
                </div>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="w-full min-[400px]:w-auto text-lg px-8 py-6 hover:scale-105 transition-all duration-300 shadow-xl text-white"
                      style={{
                        background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                      }}
                    >
                      <Brain className="mr-2 h-5 w-5" />
                      Start Summarizing
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowQuickSummarize(true)}
                    className="w-full min-[400px]:w-auto text-lg px-8 py-6 hover:scale-105 transition-all duration-300 border-2"
                    style={{ borderColor: theme.primary }}
                  >
                    Try Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-8 pt-4">
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: `${theme.foreground}70` }}
                  >
                    <Users
                      className="h-4 w-4"
                      style={{ color: theme.success }}
                    />
                    <span>10,000+ researchers</span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: `${theme.foreground}70` }}
                  >
                    <Clock
                      className="h-4 w-4"
                      style={{ color: theme.accent }}
                    />
                    <span>Save 5+ hours daily</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center animate-slide-in-right">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-3xl blur-3xl animate-pulse-glow"
                    style={{
                      background: `linear-gradient(to right, ${theme.primary}30, ${theme.secondary}30)`,
                    }}
                  ></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 animate-float">
                    <Image
                      alt="Research Papers Dashboard"
                      className="rounded-2xl shadow-lg"
                      height="500"
                      src="/ai.jpeg?height=500&width=600"
                      width="600"
                    />
                    <div
                      className="absolute -top-4 -right-4 text-white rounded-full p-3 animate-bounce"
                      style={{ backgroundColor: theme.success }}
                    >
                      <Zap className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-16 md:py-24 lg:py-32"
          style={{ backgroundColor: theme.background }}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in">
              <div className="space-y-4">
                <div
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: `${theme.secondary}20`,
                    color: theme.secondary,
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Powerful Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">
                  Everything Researchers Need
                </h2>
                <p
                  className="max-w-[900px] text-lg md:text-xl leading-relaxed"
                  style={{ color: `${theme.foreground}70` }}
                >
                  Advanced AI capabilities designed specifically for academic
                  research and paper analysis
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <Card
                className="relative overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-in border-2 hover:shadow-xl"
                style={{
                  borderColor: `${theme.primary}50`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.primary}05, transparent)`,
                  }}
                ></div>
                <CardHeader className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:animate-bounce"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.primary}90)`,
                    }}
                  >
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">
                    Lightning Fast Analysis
                  </CardTitle>
                  <CardDescription className="text-base">
                    Get comprehensive summaries in under 30 seconds using
                    state-of-the-art AI models trained on millions of research
                    papers
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="relative overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-200 border-2 hover:shadow-xl"
                style={{
                  borderColor: `${theme.secondary}50`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.secondary}05, transparent)`,
                  }}
                ></div>
                <CardHeader className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:animate-bounce"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.secondary}, ${theme.secondary}90)`,
                    }}
                  >
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Multiple Formats</CardTitle>
                  <CardDescription className="text-base">
                    Support for PDF, DOC, DOCX, and TXT files. Upload multiple
                    papers simultaneously and process them in batch
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="relative overflow-hidden group hover:scale-105 transition-all duration-300 animate-fade-in animate-delay-400 border-2 hover:shadow-xl"
                style={{
                  borderColor: `${theme.accent}50`,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom right, ${theme.accent}05, transparent)`,
                  }}
                ></div>
                <CardHeader className="relative">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:animate-bounce"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.accent}90)`,
                    }}
                  >
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Secure & Private</CardTitle>
                  <CardDescription className="text-base">
                    Enterprise-grade security with end-to-end encryption. Your
                    research papers are processed securely and never stored
                    permanently
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section
          id="how-it-works"
          className="w-full py-16 md:py-24 lg:py-32"
          style={{
            background: `linear-gradient(to bottom right, ${theme.muted}, ${theme.background}, ${theme.primary}05)`,
          }}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center animate-fade-in">
              <div className="space-y-4">
                <div
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: `${theme.accent}20`,
                    color: theme.accent,
                  }}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Simple Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl gradient-text">
                  How It Works
                </h2>
                <p
                  className="max-w-[900px] text-lg md:text-xl leading-relaxed"
                  style={{ color: `${theme.foreground}70` }}
                >
                  Three simple steps to transform your research workflow
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-12 py-12 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-6 text-center group animate-slide-in-left">
                <div className="relative">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.primary}90)`,
                    }}
                  >
                    1
                  </div>
                  <div
                    className="absolute -inset-2 rounded-full blur-xl"
                    style={{ backgroundColor: `${theme.primary}20` }}
                  ></div>
                </div>
                <h3 className="text-2xl font-bold">Upload Papers</h3>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: `${theme.foreground}70` }}
                >
                  Drag and drop your research papers or click to browse. Support
                  for multiple files with real-time progress tracking.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-6 text-center group animate-slide-in-left animate-delay-200">
                <div className="relative">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.secondary}, ${theme.secondary}90)`,
                    }}
                  >
                    2
                  </div>
                  <div
                    className="absolute -inset-2 rounded-full blur-xl"
                    style={{ backgroundColor: `${theme.secondary}20` }}
                  ></div>
                </div>
                <h3 className="text-2xl font-bold">AI Analysis</h3>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: `${theme.foreground}70` }}
                >
                  Our advanced AI models analyze your papers, extract key
                  insights, and identify important findings with contextual
                  understanding.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-6 text-center group animate-slide-in-left animate-delay-400">
                <div className="relative">
                  <div
                    className="flex h-20 w-20 items-center justify-center rounded-full text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.accent}90)`,
                    }}
                  >
                    3
                  </div>
                  <div
                    className="absolute -inset-2 rounded-full blur-xl"
                    style={{ backgroundColor: `${theme.accent}20` }}
                  ></div>
                </div>
                <h3 className="text-2xl font-bold">Get Results</h3>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: `${theme.foreground}70` }}
                >
                  Receive comprehensive summaries with key points, methodology,
                  conclusions, and interactive chat for deeper insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden text-white"
          style={{
            background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary}, ${theme.primary})`,
          }}
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center justify-center space-y-6 text-center animate-fade-in">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Transform Your Research?
                </h2>
                <p className="max-w-[600px] text-white/90 text-lg md:text-xl leading-relaxed">
                  Join thousands of researchers who are saving time and gaining
                  deeper insights with AI-powered paper summaries.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300 shadow-xl bg-white text-foreground"
                  >
                    <Brain className="mr-2 h-5 w-5" />
                    Get Started Free
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowQuickSummarize(true)}
                  className="text-lg px-8 py-6 hover:scale-105 transition-all duration-300 border-white/30 text-white hover:bg-white/10"
                >
                  Try Demo Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t"
        style={{
          backgroundColor: theme.background,
          borderColor: theme.border,
        }}
      >
        <p className="text-sm" style={{ color: `${theme.foreground}70` }}>
          © 2024 PaperSummarizer. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-6 sm:gap-8">
          <Link
            className="text-sm"
            style={{ color: `${theme.foreground}70` }}
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-sm"
            style={{ color: `${theme.foreground}70` }}
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-sm"
            style={{ color: `${theme.foreground}70` }}
            href="#"
          >
            Contact
          </Link>
        </nav>
      </footer>

      {/* Quick Summarize Modal */}
      {showQuickSummarize && (
        <QuickSummarize onClose={() => setShowQuickSummarize(false)} />
      )}
    </div>
  );
}
