"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Trash2,
  MessageCircle,
  Sparkles,
  FileCheck,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SummaryViewer } from "@/components/summary-viewer"
import { ChatBot } from "@/components/chatbot"
import { useTheme } from "@/hooks/use-theme"

interface Paper {
  id: string
  title: string
  status: "processing" | "completed" | "error"
  uploadedAt: Date
  summary?: string
  progress?: number
  fullSummary?: string
  compliance?: string
}

interface PaperCardProps {
  paper: Paper
}

export function PaperCard({ paper }: PaperCardProps) {
  const { theme } = useTheme()
  const [showFullSummary, setShowFullSummary] = useState(false)
  const [showSummaryViewer, setShowSummaryViewer] = useState(false)
  const [showChatBot, setShowChatBot] = useState(false)
  const [showCompliance, setShowCompliance] = useState(false)

  const getStatusIcon = () => {
    switch (paper.status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" style={{ color: theme.success }} />
      case "processing":
        return <Clock className="h-4 w-4 animate-spin" style={{ color: theme.accent }} />
      case "error":
        return <AlertCircle className="h-4 w-4" style={{ color: theme.destructive }} />
    }
  }

  const getStatusColor = () => {
    switch (paper.status) {
      case "completed":
        return {
          bg: `${theme.success}10`,
          text: theme.success,
          border: `${theme.success}30`,
          hover: `${theme.success}20`,
        }
      case "processing":
        return {
          bg: `${theme.accent}10`,
          text: theme.accent,
          border: `${theme.accent}30`,
          hover: `${theme.accent}20`,
        }
      case "error":
        return {
          bg: `${theme.destructive}10`,
          text: theme.destructive,
          border: `${theme.destructive}30`,
          hover: `${theme.destructive}20`,
        }
    }
  }

  const truncatedSummary =
    paper.summary && paper.summary.length > 200 ? paper.summary.substring(0, 200) + "..." : paper.summary

  const handleDownload = () => {
    if (paper.fullSummary) {
      const blob = new Blob([paper.fullSummary], { type: "text/markdown" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${paper.title.replace(".pdf", "")}_summary.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const statusColors = getStatusColor()

  return (
    <>
      <Card
        className="border-2 hover:shadow-xl group animate-fade-in transition-all duration-300"
        style={{
          borderColor: `${theme.primary}40`,
          hover: { borderColor: `${theme.primary}` },
        }}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.primary}20, ${theme.secondary}20)`,
                }}
              >
                <FileText className="h-6 w-6" style={{ color: theme.primary }} />
              </div>
              <div className="flex-1">
                <CardTitle
                  className="text-xl group-hover:transition-colors duration-300"
                  style={{
                    color: theme.foreground,
                    hover: { color: theme.primary },
                  }}
                >
                  {paper.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3" />
                  Uploaded {formatDistanceToNow(paper.uploadedAt, { addSuffix: true })}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="transition-colors duration-300"
              style={{
                backgroundColor: statusColors.bg,
                color: statusColors.text,
                borderColor: statusColors.border,
                hover: { backgroundColor: statusColors.hover },
              }}
            >
              {getStatusIcon()}
              <span className="ml-2 capitalize font-medium">{paper.status}</span>
            </Badge>
          </div>
        </CardHeader>

        {paper.summary && (
          <CardContent>
            <div className="space-y-6">
              <div
                className="rounded-xl p-4 border"
                style={{
                  background: `linear-gradient(to right, ${theme.primary}05, ${theme.secondary}05)`,
                  borderColor: `${theme.primary}10`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4" style={{ color: theme.primary }} />
                  <h4 className="font-semibold" style={{ color: theme.primary }}>
                    AI Summary
                  </h4>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: `${theme.foreground}90` }}>
                  {showFullSummary ? paper.summary : truncatedSummary}
                </p>
                {paper.summary.length > 200 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-2 hover:text-primary-600"
                    style={{ color: theme.primary }}
                    onClick={() => setShowFullSummary(!showFullSummary)}
                  >
                    {showFullSummary ? "Show less" : "Read more"}
                  </Button>
                )}
              </div>

              {paper.compliance && showCompliance && (
                <div
                  className="rounded-xl p-4 border"
                  style={{
                    background: `linear-gradient(to right, ${theme.secondary}05, ${theme.accent}05)`,
                    borderColor: `${theme.secondary}10`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FileCheck className="h-4 w-4" style={{ color: theme.secondary }} />
                    <h4 className="font-semibold" style={{ color: theme.secondary }}>
                      Structure Analysis
                    </h4>
                  </div>
                  <pre
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: `${theme.foreground}90` }}
                  >
                    {paper.compliance}
                  </pre>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSummaryViewer(true)}
                  className="hover:scale-105 transition-all duration-300"
                  style={{
                    borderColor: `${theme.primary}30`,
                    hover: { borderColor: theme.primary },
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Summary
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChatBot(true)}
                  className="hover:scale-105 transition-all duration-300"
                  style={{
                    borderColor: `${theme.secondary}30`,
                    hover: { borderColor: theme.secondary },
                    background: `linear-gradient(to right, ${theme.secondary}05, ${theme.secondary}10)`,
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Paper
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="hover:scale-105 transition-all duration-300"
                  style={{
                    borderColor: `${theme.accent}30`,
                    hover: { borderColor: theme.accent },
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Summary
                </Button>

                {paper.compliance && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCompliance(!showCompliance)}
                    className="hover:scale-105 transition-all duration-300"
                    style={{
                      borderColor: `${theme.secondary}30`,
                      hover: { borderColor: theme.secondary },
                    }}
                  >
                    <FileCheck className="h-4 w-4 mr-2" />
                    {showCompliance ? "Hide Structure" : "Show Structure"}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="hover:scale-105 transition-all duration-300"
                  style={{
                    color: theme.destructive,
                    hover: { color: `${theme.destructive}` },
                    borderColor: `${theme.destructive}30`,
                    hover: { borderColor: theme.destructive },
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Summary Viewer Modal */}
      {showSummaryViewer && <SummaryViewer paper={paper} onClose={() => setShowSummaryViewer(false)} />}

      {/* ChatBot Modal */}
      {showChatBot && <ChatBot paper={paper} onClose={() => setShowChatBot(false)} />}
    </>
  )
}
