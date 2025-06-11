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
import { Bot, Brain, MessageCircle, Send, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Paper {
  id: string;
  title: string;
  status: 'processing' | 'completed' | 'error';
  uploadedAt: Date;
  summary?: string;
  fullSummary?: string;
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  paper: Paper;
  onClose: () => void;
}

export function ChatBot({ paper, onClose }: ChatBotProps) {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your AI research assistant. I've analyzed "${paper.title}" and I'm ready to answer any questions you have about this paper. What would you like to know?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What are the main findings?',
    'Explain the methodology',
    'What are the limitations?',
    'How does this relate to other research?',
    'What are the practical applications?',
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(content.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes('main finding') ||
      lowerQuestion.includes('key finding')
    ) {
      return 'Based on my analysis of this paper, the main findings include significant improvements in accuracy and efficiency. The research demonstrates a novel approach that outperforms existing methods by 25-30%. The authors also identified three critical factors that contribute to the success of their methodology.';
    } else if (
      lowerQuestion.includes('methodology') ||
      lowerQuestion.includes('method')
    ) {
      return 'The methodology employed in this study follows a rigorous experimental design. The researchers used a combination of quantitative and qualitative approaches, with a sample size of over 1,000 participants. They implemented proper control groups and used statistical analysis to validate their results. The study design ensures reproducibility and reliability of the findings.';
    } else if (lowerQuestion.includes('limitation')) {
      return 'The paper acknowledges several limitations: 1) The study was conducted in a controlled environment which may not reflect real-world conditions, 2) The sample size, while substantial, was limited to a specific demographic, 3) Long-term effects were not evaluated due to time constraints, and 4) Some variables could not be controlled for due to ethical considerations.';
    } else if (
      lowerQuestion.includes('application') ||
      lowerQuestion.includes('practical')
    ) {
      return 'This research has several practical applications: 1) It can be immediately implemented in clinical settings to improve patient outcomes, 2) The methodology can be adapted for use in educational institutions, 3) Industry applications include process optimization and quality control, and 4) The findings inform policy decisions in relevant regulatory frameworks.';
    } else if (
      lowerQuestion.includes('relate') ||
      lowerQuestion.includes('other research')
    ) {
      return 'This work builds upon previous research by Johnson et al. (2022) and extends the findings of Smith & Brown (2021). It contradicts some earlier assumptions made by Wilson (2020) while supporting the theoretical framework proposed by Davis et al. (2019). The authors position their work as a significant advancement in the field, bridging gaps between theoretical models and practical implementation.';
    } else {
      return "That's an interesting question about this research paper. Based on my analysis of the content, I can provide insights into various aspects of the study including its methodology, findings, implications, and connections to broader research. Could you be more specific about what aspect you'd like me to focus on? I'm here to help you understand this paper better!";
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] p-0 flex flex-col"
        style={{ backgroundColor: theme.background }}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:scale-105 transition-transform duration-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Suggested Questions */}
        <div
          className="p-4 border-b"
          style={{
            backgroundColor: `${theme.muted}30`,
            borderColor: theme.border,
          }}
        >
          <p
            className="text-sm mb-3"
            style={{ color: `${theme.foreground}70` }}
          >
            Suggested questions:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(question)}
                className="text-xs hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: theme.primary,
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                } animate-fade-in`}
              >
                {message.type === 'bot' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `linear-gradient(to bottom right, ${theme.secondary}, ${theme.primary})`,
                    }}
                  >
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <Card
                  className="max-w-[80%] p-4"
                  style={{
                    backgroundColor:
                      message.type === 'user'
                        ? `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`
                        : `${theme.muted}50`,
                    borderColor:
                      message.type === 'user'
                        ? 'transparent'
                        : `${theme.primary}20`,
                    color: message.type === 'user' ? 'white' : theme.foreground,
                  }}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className="text-xs mt-2"
                    style={{
                      color:
                        message.type === 'user'
                          ? 'rgba(255, 255, 255, 0.7)'
                          : `${theme.foreground}70`,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
                {message.type === 'user' && (
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
            ))}

            {isTyping && (
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
                  className="p-4"
                  style={{
                    backgroundColor: `${theme.muted}50`,
                    borderColor: `${theme.primary}20`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: theme.primary }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: theme.primary,
                          animationDelay: '0.1s',
                        }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{
                          backgroundColor: theme.primary,
                          animationDelay: '0.2s',
                        }}
                      ></div>
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

        {/* Input */}
        <div
          className="p-4 border-t"
          style={{
            backgroundColor: `${theme.muted}30`,
            borderColor: theme.border,
          }}
        >
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about this paper..."
              onKeyPress={(e) =>
                e.key === 'Enter' && handleSendMessage(inputValue)
              }
              className="flex-1"
              disabled={isTyping}
              style={{
                backgroundColor: theme.background,
                borderColor: theme.border,
              }}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
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
