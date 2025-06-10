"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Loader2, Brain, Sparkles, CheckCircle, FileSearch, FileCheck } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"

interface UploadProgressProps {
  fileName: string
  progress: number
  stage?: string
}

export function UploadProgress({ fileName, progress, stage }: UploadProgressProps) {
  const { theme } = useTheme()

  const getProgressText = (progress: number, stage?: string) => {
    if (stage) return stage

    if (progress < 15) return "Uploading file..."
    if (progress < 30) return "Extracting text content..."
    if (progress < 45) return "Analyzing with AI..."
    if (progress < 60) return "Generating summary..."
    if (progress < 75) return "Checking paper structure..."
    if (progress < 90) return "Preparing results..."
    return "Finalizing..."
  }

  const getProgressIcon = (progress: number, stage?: string) => {
    if (stage === "Uploading file...") return <FileText className="h-5 w-5" style={{ color: theme.primary }} />
    if (stage === "Extracting text content...")
      return <FileSearch className="h-5 w-5 animate-pulse" style={{ color: theme.secondary }} />
    if (stage === "Analyzing with AI...")
      return <Brain className="h-5 w-5 animate-bounce" style={{ color: theme.accent }} />
    if (stage === "Generating summary...")
      return <Sparkles className="h-5 w-5 animate-spin" style={{ color: theme.primary }} />
    if (stage === "Checking paper structure...")
      return <FileCheck className="h-5 w-5 animate-pulse" style={{ color: theme.secondary }} />
    if (stage === "Preparing results...")
      return <Loader2 className="h-5 w-5 animate-spin" style={{ color: theme.accent }} />

    if (progress < 15) return <FileText className="h-5 w-5" style={{ color: theme.primary }} />
    if (progress < 30) return <FileSearch className="h-5 w-5 animate-pulse" style={{ color: theme.secondary }} />
    if (progress < 45) return <Brain className="h-5 w-5 animate-bounce" style={{ color: theme.accent }} />
    if (progress < 60) return <Sparkles className="h-5 w-5 animate-spin" style={{ color: theme.primary }} />
    if (progress < 75) return <FileCheck className="h-5 w-5 animate-pulse" style={{ color: theme.secondary }} />
    if (progress < 90) return <Loader2 className="h-5 w-5 animate-spin" style={{ color: theme.accent }} />
    return <CheckCircle className="h-5 w-5 animate-bounce" style={{ color: theme.success }} />
  }

  return (
    <Card
      className="border-2 animate-pulse-glow"
      style={{
        borderColor: `${theme.primary}30`,
        background: `linear-gradient(to right, ${theme.primary}05, ${theme.background}, ${theme.secondary}05)`,
      }}
    >
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom right, ${theme.primary}20, ${theme.secondary}20)`,
              }}
            >
              {getProgressIcon(progress, stage)}
            </div>
            <div
              className="absolute -inset-1 rounded-xl blur opacity-60 animate-pulse"
              style={{
                background: `linear-gradient(to right, ${theme.primary}30, ${theme.secondary}30)`,
              }}
            ></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-semibold truncate max-w-[300px] text-lg">{fileName}</p>
              <span className="text-lg font-bold" style={{ color: theme.primary }}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-3"
              style={
                {
                  backgroundColor: theme.muted,
                  "--progress-background": `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                } as React.CSSProperties
              }
            />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: theme.primary }}></div>
              <p className="text-sm font-medium" style={{ color: `${theme.foreground}70` }}>
                {getProgressText(progress, stage)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
