'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from '@/hooks/use-theme';
import { useChatStore } from '@/lib/store/chat-store';
import { Bot, Brain, MessageCircle, Send, User } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface Paper {
  id: string;
  title: string;
  status: 'processing' | 'completed' | 'error';
  uploadedAt: Date;
  summary?: string;
  fullSummary?: string;
  compliance?: string;
}

interface ChatBotProps {
  paper: Paper;
  onClose: () => void;
  open: boolean;
}

// Memoize the suggested questions outside the component
const SUGGESTED_QUESTIONS = [
  'What are the main findings?',
  'Explain the methodology',
  'What are the limitations?',
  'How does this relate to other research?',
  'What are the practical applications?',
] as const;

export function ChatBot({ paper, onClose, open }: ChatBotProps) {
  const { theme } = useTheme();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Use Zustand selectors with proper memoization
  const messages = useChatStore(
    useCallback((state) => state.messages[paper.id] || [], [paper.id])
  );

  const isLoading = useChatStore((state) => state.isLoading);
  const addMessage = useChatStore((state) => state.addMessage);
  const setLoading = useChatStore((state) => state.setLoading);

  // Memoize the welcome message
  const welcomeMessage = useMemo(
    () => ({
      role: 'assistant' as const,
      content: `Hello! I'm your AI research assistant. I've analyzed "${paper.title}" and I'm ready to answer any questions you have about this paper. What would you like to know?`,
    }),
    [paper.title]
  );

  // Initialize with welcome message if no messages exist
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (open && messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      // Check if we've already shown the welcome message for this session
      const hasWelcomeMessage = messages.some(
        (msg) =>
          msg.role === 'assistant' &&
          msg.content.includes("I'm your AI research assistant")
      );
      if (!hasWelcomeMessage) {
        const welcomeMsg = {
          ...welcomeMessage,
          id: 'welcome-' + Date.now(),
          timestamp: Date.now(),
        };
        addMessage(paper.id, welcomeMsg);
      }
    }
  }, [open, messages, paper.id, addMessage, welcomeMessage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollAreaRef.current?.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  // Memoize the handleSendMessage function
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      try {
        await addMessage(paper.id, {
          role: 'user',
          content: content.trim(),
        });
        setInputValue('');
        setLoading(true);

        // Get paper content for context
        const paperContent = [
          paper.summary,
          paper.fullSummary,
          paper.compliance,
        ]
          .filter(Boolean)
          .join('\n\n');

        // Prepare messages for API
        const apiMessages = messages
          .slice(-4)
          .map(({ role, content }) => ({ role, content }));

        // Add current user message
        apiMessages.push({
          role: 'user',
          content: content.trim(),
        });

        // Call chat API
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: apiMessages, paperContent }),
        });

        if (!response.ok) throw new Error('Failed to get response from AI');

        const data = await response.json();
        await addMessage(paper.id, {
          role: 'assistant',
          content: data.message.content,
        });
      } catch (error) {
        console.error('Error sending message:', error);
        await addMessage(paper.id, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    },
    [isLoading, paper, messages, addMessage, setLoading]
  );

  // Memoize the handleSuggestedQuestion function
  const handleSuggestedQuestion = useCallback(
    (question: string) => {
      handleSendMessage(question);
    },
    [handleSendMessage]
  );

  // Memoize the handleKeyDown function
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(inputValue);
      }
    },
    [inputValue, handleSendMessage]
  );

  // Render function for messages
  const renderMessages = useCallback(() => {
    return messages.map((message) => (
      <div
        key={message.id}
        className={`flex gap-3 ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        } animate-fade-in`}
      >
        {message.role !== 'user' && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(to bottom right, ${theme.secondary}, ${theme.primary})`,
            }}
          >
            <Bot className="h-4 w-4 text-white" />
          </div>
        )}
        <div className="w-full max-w-[90%] overflow-hidden">
          <Card
            className={`p-4 break-words w-full ${
              message.role === 'user' ? 'bg-gradient-to-r' : ''
            }`}
            style={{
              background:
                message.role === 'user'
                  ? `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`
                  : `${theme.muted}50`,
              borderColor:
                message.role === 'user' ? 'transparent' : `${theme.primary}20`,
              color: message.role === 'user' ? 'white' : theme.foreground,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              maxWidth: '100%',
            }}
          >
            <div className="prose prose-sm dark:prose-invert max-w-none break-words prose-headings:mt-0 prose-p:my-2 prose-pre:bg-gray-900 prose-pre:p-4 prose-pre:rounded-md">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: ({
                    inline,
                    className = '',
                    children,
                    ...props
                  }: {
                    inline?: boolean;
                    className?: string;
                    children?: React.ReactNode;
                    // [key: string]: unknown;
                  }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative">
                        <SyntaxHighlighter
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          style={vscDarkPlus as any}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md text-sm my-2 overflow-x-auto"
                          customStyle={{
                            margin: 0,
                            padding: '1rem',
                            backgroundColor: '#1E1E1E',
                            borderRadius: '0.5rem',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  a: (props) => (
                    <a
                      {...props}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                  ul: (props) => (
                    <ul className="list-disc pl-5 space-y-1" {...props} />
                  ),
                  ol: (props) => (
                    <ol className="list-decimal pl-5 space-y-1" {...props} />
                  ),
                  blockquote: (props) => (
                    <blockquote
                      className="border-l-4 border-gray-300 pl-4 italic"
                      {...props}
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            <p
              className="text-xs mt-2 opacity-80 text-right"
              style={{
                color:
                  message.role === 'user'
                    ? 'rgba(255, 255, 255, 0.8)'
                    : `${theme.foreground}70`,
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </p>
          </Card>
        </div>
        {message.role === 'user' && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(to bottom right, ${theme.accent}, ${theme.accent}90)`,
            }}
          >
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
    ));
  }, [messages, theme]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl w-[90vw] max-h-[90vh] p-0 flex flex-col"
        style={{
          backgroundColor: theme.background,
          width: '90vw',
          maxWidth: '1200px',
        }}
      >
        <DialogHeader
          className="p-6 pb-4 border-b"
          style={{
            background: `linear-gradient(to right, ${theme.secondary}05, ${theme.primary}05)`,
            borderColor: theme.border,
          }}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.secondary}, ${theme.primary})`,
                }}
              >
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <MessageCircle
                    className="h-4 w-4"
                    style={{ color: theme.secondary }}
                  />
                  <span>Chat with Paper</span>
                </div>
                <p
                  className="text-sm font-normal mt-1 truncate max-w-[400px]"
                  style={{ color: `${theme.foreground}70` }}
                >
                  {paper.title}
                </p>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea
            ref={scrollAreaRef}
            className="h-full w-full overflow-x-hidden"
            style={{
              height: 'calc(90vh - 200px)',
              maxWidth: '100%',
            }}
          >
            <div className="p-4 space-y-4 w-full max-w-full">
              {renderMessages()}
              {isLoading && (
                <div className="flex gap-3 justify-start animate-fade-in">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.secondary}, ${theme.primary})`,
                    }}
                  >
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <Card
                    className="p-4 whitespace-pre-wrap break-words"
                    style={{
                      backgroundColor: `${theme.muted}50`,
                      borderColor: `${theme.primary}20`,
                      maxWidth: '90%',
                      wordWrap: 'break-word',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                              backgroundColor: theme.primary,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-sm"
                        style={{ color: `${theme.foreground}70` }}
                      >
                        AI is thinking...
                      </span>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div
          className="p-4 border-t"
          style={{
            backgroundColor: `${theme.muted}30`,
            borderColor: theme.border,
          }}
        >
          {messages.length <= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              {SUGGESTED_QUESTIONS.map((question) => (
                <Button
                  key={question}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs hover:scale-105 transition-all duration-300 text-left justify-start h-auto py-2 whitespace-normal"
                  style={{
                    borderColor: theme.primary,
                    color: theme.foreground,
                    backgroundColor: theme.background,
                  }}
                >
                  {question}
                </Button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about this paper..."
              className="flex-1"
              disabled={isLoading}
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
                color: theme.foreground,
              }}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="hover:scale-105 transition-all duration-300 text-white"
              style={{
                background: `linear-gradient(to right, ${theme.secondary}, ${theme.primary})`,
              }}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
