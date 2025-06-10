'use client';

import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { AlertCircle, File, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesUploaded: (files: File[], fileContents?: string[]) => void;
  maxFiles?: number;
}

export function FileUpload({
  onFilesUploaded,
  maxFiles = 10,
}: FileUploadProps) {
  const { theme } = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const reasons = rejectedFiles
          .map((f) => f.errors[0]?.message)
          .join(', ');
        setError(`Some files were rejected: ${reasons}`);
        return;
      }

      // Check file sizes (max 10MB per file)
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > 10 * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError(
          `Files too large (max 10MB): ${oversizedFiles
            .map((f) => f.name)
            .join(', ')}`
        );
        return;
      }

      // Limit the number of files
      const filesToAdd = acceptedFiles.slice(
        0,
        maxFiles - selectedFiles.length
      );
      if (filesToAdd.length < acceptedFiles.length) {
        setError(
          `Only ${maxFiles} files allowed. ${
            acceptedFiles.length - filesToAdd.length
          } files were not added.`
        );
      }

      setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    },
    [selectedFiles.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'text/plain': ['.txt'],
    },
    multiple: true,
    maxFiles: maxFiles,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      setIsLoading(true);
      setError(null);

      try {
        // For PDF files, we'll need to convert them to base64 for the API
        const fileContents: string[] = [];

        for (const file of selectedFiles) {
          if (file.type === 'application/pdf') {
            const base64 = await convertFileToBase64(file);
            fileContents.push(base64);
          } else {
            // For non-PDF files, we'll just use the text content
            const text = await file.text();
            fileContents.push(text);
          }
        }

        onFilesUploaded(selectedFiles, fileContents);
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error processing files:', error);
        setError('Failed to process files. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Content = base64String.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    );
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          error ? 'border-red-300 bg-red-50' : ''
        )}
        style={{
          borderColor: error
            ? '#fca5a5'
            : isDragActive
            ? theme.primary
            : `${theme.foreground}25`,
          backgroundColor: error
            ? '#fef2f2'
            : isDragActive
            ? `${theme.primary}05`
            : 'transparent',
        }}
      >
        <input {...getInputProps()} />
        <Upload
          className="h-10 w-10 mx-auto mb-4"
          style={{ color: error ? '#ef4444' : `${theme.foreground}50` }}
        />
        {isDragActive ? (
          <p className="text-lg">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">Drag & drop research papers here</p>
            <p
              className="text-sm mb-4"
              style={{ color: `${theme.foreground}70` }}
            >
              or click to browse files
            </p>
            <Button variant="outline">Browse Files</Button>
          </div>
        )}
        <p className="text-xs mt-4" style={{ color: `${theme.foreground}70` }}>
          Supports PDF, DOC, DOCX, and TXT files (max 10MB each)
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ backgroundColor: theme.muted }}
              >
                <div className="flex items-center space-x-2">
                  <File
                    className="h-4 w-4"
                    style={{ color: `${theme.foreground}70` }}
                  />
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: `${theme.foreground}70` }}
                    >
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleUpload}
            className="w-full text-white"
            disabled={isLoading}
            style={{
              background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
            }}
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                Upload {selectedFiles.length}{' '}
                {selectedFiles.length === 1 ? 'File' : 'Files'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
