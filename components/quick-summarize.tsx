"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Sparkles } from "lucide-react"
import { FileUpload } from "@/components/file-upload"
import { UploadProgress } from "@/components/upload-progress"
import { useTheme } from "@/hooks/use-theme"

interface QuickSummarizeProps {
  onClose: () => void
}

export function QuickSummarize({ onClose }: QuickSummarizeProps) {
  const { theme } = useTheme()
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFilesUploaded = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles)
    setIsProcessing(true)

    // Simulate processing
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15
      if (currentProgress >= 100) {
        setProgress(100)
        clearInterval(interval)
        setTimeout(() => {
          setIsProcessing(false)
          // Redirect to signup or show results
        }, 1000)
      } else {
        setProgress(currentProgress)
      }
    }, 500)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" style={{ backgroundColor: theme.background }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6" style={{ color: theme.primary }} />
            Quick Summarize Demo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!isProcessing ? (
            <>
              <Card
                className="border-2"
                style={{
                  borderColor: `${theme.primary}20`,
                  backgroundColor: `${theme.primary}05`,
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" style={{ color: theme.primary }} />
                    Try Our AI Summarizer
                  </CardTitle>
                  <CardDescription>
                    Upload a research paper to see our AI in action. This is a demo - sign up for full features!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFilesUploaded={handleFilesUploaded} />
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-sm mb-4" style={{ color: `${theme.foreground}70` }}>
                  Want full access to unlimited summaries and advanced features?
                </p>
                <Button
                  onClick={onClose}
                  className="text-white"
                  style={{
                    background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                  }}
                >
                  Sign Up for Full Access
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {files.map((file, index) => (
                <UploadProgress key={index} fileName={file.name} progress={progress} />
              ))}
              <div className="text-center pt-4">
                <p className="text-sm" style={{ color: `${theme.foreground}70` }}>
                  Processing your paper... Sign up to see the full summary!
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
