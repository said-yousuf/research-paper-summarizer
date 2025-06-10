"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, X, FileText, Sparkles, FileCheck } from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Paper {
  id: string
  title: string
  status: "processing" | "completed" | "error"
  uploadedAt: Date
  summary?: string
  fullSummary?: string
  compliance?: string
}

interface SummaryViewerProps {
  paper: Paper
  onClose: () => void
}

export function SummaryViewer({ paper, onClose }: SummaryViewerProps) {
  const { theme } = useTheme()

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

  const formatSummary = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mb-4 mt-6" style={{ color: theme.primary }}>
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mb-3 mt-5" style={{ color: theme.secondary }}>
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mb-2 mt-4" style={{ color: theme.accent }}>
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1" style={{ color: `${theme.foreground}70` }}>
            {line.substring(2)}
          </li>
        )
      } else if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={index} className="font-semibold mb-2">
            {line.slice(2, -2)}
          </p>
        )
      } else if (line.trim() === "") {
        return <br key={index} />
      } else {
        return (
          <p key={index} className="mb-2 leading-relaxed" style={{ color: theme.foreground }}>
            {line}
          </p>
        )
      }
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0" style={{ backgroundColor: theme.background }}>
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
                  <Sparkles className="h-4 w-4" style={{ color: theme.primary }} />
                  <span>AI Analysis</span>
                </div>
                <p className="text-sm font-normal mt-1" style={{ color: `${theme.foreground}70` }}>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:scale-105 transition-transform duration-300"
              >
                <X className="h-4 w-4" />
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
                  borderColor: "transparent",
                  dataState: { active: { borderColor: theme.primary, color: theme.primary } },
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
                    borderColor: "transparent",
                    dataState: { active: { borderColor: theme.secondary, color: theme.secondary } },
                  }}
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Structure Analysis
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <TabsContent value="summary" className="mt-0">
            <ScrollArea className="flex-1 p-6 max-h-[70vh]">
              <div className="prose prose-sm max-w-none">
                {paper.fullSummary ? (
                  formatSummary(paper.fullSummary)
                ) : (
                  <p style={{ color: `${theme.foreground}70` }}>No detailed summary available.</p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {paper.compliance && (
            <TabsContent value="structure" className="mt-0">
              <ScrollArea className="flex-1 p-6 max-h-[70vh]">
                <div className="prose prose-sm max-w-none">
                  <h2 className="text-xl font-semibold mb-4" style={{ color: theme.secondary }}>
                    Paper Structure Analysis
                  </h2>
                  <pre className="whitespace-pre-wrap text-base leading-relaxed" style={{ color: theme.foreground }}>
                    {paper.compliance}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
