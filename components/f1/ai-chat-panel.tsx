"use client";

import React from "react"

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  chartRef?: string;
  timestamp: Date;
}

// Use a fixed date to avoid hydration mismatch
const fixedDate = new Date('2024-01-01T00:00:00Z');

const getInitialMessages = (): Message[] => [
  {
    id: "1",
    role: "assistant",
    content: "Hello! Welcome to the F1 Intelligence Hub by Yoonae Lee! 🏎️\n\nI'm your AI race analyst here to help you understand race data, strategies, and performance insights. Currently analyzing demo data from Monaco.\n\nAsk me anything about lap times, tyre strategies, driver performance, or race dynamics!",
    timestamp: fixedDate,
  },
];

interface Session {
  name: string;
  location: string;
  country: string;
}

interface AIChatPanelProps {
  onHighlightChart: (chart: string | null) => void;
  session?: Session;
  isLive?: boolean;
}

export function AIChatPanel({ onHighlightChart, session, isLive = false }: AIChatPanelProps) {
  const sessionName = session ? `${session.location} ${session.name}` : "Monaco";
  const liveStatus = isLive ? "LIVE" : "demo";
  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Call the API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        chartRef: data.chartRef,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting right now. Please make sure your GROQ_API_KEY is set in .env.local file.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-chart-1" />
        <h3 className="text-sm font-semibold text-foreground">Race Intelligence</h3>
        <span className="text-xs text-muted-foreground ml-auto">AI Analyst</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-secondary text-foreground"
                  : "bg-muted/50 text-foreground"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              {message.chartRef && (
                <button
                  type="button"
                  onClick={() => onHighlightChart(message.chartRef || null)}
                  className="mt-2 flex items-center gap-1 text-xs text-chart-1 hover:text-chart-1/80 transition-colors"
                >
                  <ChevronRight className="h-3 w-3" />
                  View referenced chart
                </button>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/50 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about race strategy..."
            className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI responses are generated for demo purposes
        </p>
      </form>
    </div>
  );
}
