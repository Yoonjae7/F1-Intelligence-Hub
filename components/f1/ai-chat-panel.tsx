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

const fixedDate = new Date('2024-01-01T00:00:00Z');

interface DashboardData {
  session?: {
    name: string;
    location: string;
    country: string;
    circuit?: string;
    date?: string;
    year?: number;
    laps?: number;
  };
  drivers?: Array<{
    number: number;
    code: string;
    name: string;
    team: string;
    position: number;
    gap: string;
    fastestLap?: string;
  }>;
  weather?: {
    airTemp?: number;
    trackTemp?: number;
    humidity?: number;
    windSpeed?: number;
    rainfall?: boolean;
  };
  raceSummary?: {
    winner: string;
    winningTeam: string;
    fastestLap?: { driver: string; time: string; lap: number };
    polePosition: string;
    driversChampion: string;
    constructorsChampion: string;
    keyEvents?: string[];
  };
}

interface AIChatPanelProps {
  onHighlightChart: (chart: string | null) => void;
  session?: DashboardData['session'];
  isLive?: boolean;
  dashboardData?: DashboardData;
}

export function AIChatPanel({ onHighlightChart, session, isLive = false, dashboardData }: AIChatPanelProps) {
  const sessionYear = session?.year || (session?.date ? new Date(session.date).getFullYear() : 2024);
  const sessionLocation = session?.location || "the circuit";
  const dataType = isLive ? "live" : "historical";
  
  const getWelcomeMessage = (): string => {
    return `Hello! Welcome to the F1 Intelligence Hub by Yoonae Lee! 🏎️\n\nI'm your AI race analyst with access to the ${sessionYear} ${sessionLocation} Grand Prix data currently displayed on your dashboard.\n\nI can answer questions about:\n• Race results and driver positions\n• Lap times and performance\n• Tyre strategies\n• Weather conditions\n• Gap analysis\n\nAsk me anything about the data you're seeing!`;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: fixedDate,
    },
  ]);
  
  const [hasUpdatedWelcome, setHasUpdatedWelcome] = useState(false);
  
  useEffect(() => {
    if (session && !hasUpdatedWelcome) {
      setMessages(prev => {
        if (prev.length === 1 && prev[0].id === "1") {
          return [{
            ...prev[0],
            content: getWelcomeMessage(),
          }];
        }
        return prev;
      });
      setHasUpdatedWelcome(true);
    }
  }, [session, hasUpdatedWelcome]);

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
          // Send dashboard data for AI context
          dashboardData: {
            session: dashboardData?.session || session,
            drivers: dashboardData?.drivers,
            weather: dashboardData?.weather,
            raceSummary: dashboardData?.raceSummary,
            isLive,
          },
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
    <div className="bg-card rounded-none lg:rounded-xl border-0 lg:border border-border flex flex-col h-full">
      {/* Header - hidden on mobile since parent provides it */}
      <div className="hidden lg:flex p-4 border-b border-border items-center gap-2">
        <Sparkles className="h-4 w-4 text-chart-1" />
        <h3 className="text-sm font-semibold text-foreground">Race Intelligence</h3>
        <span className="text-xs text-muted-foreground ml-auto">
          {isLive ? '🔴 Live' : `📊 ${sessionYear}`}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[90%] rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                message.role === "user"
                  ? "bg-secondary text-foreground"
                  : "bg-muted/50 text-foreground"
              }`}
            >
              <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
              {message.chartRef && (
                <button
                  type="button"
                  onClick={() => onHighlightChart(message.chartRef || null)}
                  className="mt-2 flex items-center gap-1 text-xs text-chart-1 hover:text-chart-1/80 active:text-chart-1/60 transition-colors"
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
            <div className="bg-muted/50 rounded-2xl px-4 py-3">
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

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the race data..."
            className="flex-1 bg-muted/50 border border-border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 h-10 w-10 sm:h-11 sm:w-11 rounded-xl"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-2 text-center">
          AI has access to your dashboard data
        </p>
      </form>
    </div>
  );
}
