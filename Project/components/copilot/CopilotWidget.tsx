'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useUiStore } from '../../stores/uiStore';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  Trash2, 
  ChevronDown, 
  Loader2,
  HelpCircle
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CopilotWidget() {
  const { activeRole, activeTab, isOnboardingActive } = useUiStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic context suggestions based on active view and role
  const suggestions = useMemo(() => {
    if (activeRole === 'Employee' && isOnboardingActive) {
      return [
        "What is my onboarding checklist?",
        "Who is my buddy?",
        "How do I complete pre-joining tasks?"
      ];
    }
    switch (activeTab) {
      case "Attendance":
        return [
          "How do I clock in with a selfie?",
          "What are geolocation & IP checks?",
          "How do I view my shift calendar?"
        ];
      case "Leave":
        return [
          "Check casual leave balance",
          "How do I request sick off-time?",
          activeRole === 'Manager' || activeRole === 'HR' ? "Review pending leave requests" : "Show status of my request"
        ];
      case "Performance":
        return [
          "What are my active OKRs?",
          "View my performance review",
          "Goal completion percentage"
        ];
      case "Contributions":
        return [
          "How do points work?",
          "Show leaderboard rank",
          "Browse available tasks to claim"
        ];
      case "Training":
        return [
          "SOC2 & GDPR compliance training",
          "How do I earn certificates?",
          "Mandatory training checklist"
        ];
      case "Team":
        return [
          "Platform engineering team roster",
          "Who is my manager?",
          activeRole === 'Manager' ? "Team approval coordination" : "Meet my coworkers"
        ];
      case "Analytics":
        return [
          "Show org headcount analytics",
          "Headcount by department",
          "View personal attendance stats"
        ];
      case "Announcements":
        return [
          "Acknowledge recent policies",
          activeRole === 'HR' || activeRole === 'Admin' ? "How do I create targeted alerts?" : "Recent company bulletins"
        ];
      default:
        return [
          "How do I request off-time?",
          "Gamified contributions system",
          "Switch roles to test workflows"
        ];
    }
  }, [activeTab, activeRole, isOnboardingActive]);

  // Set context-specific greeting when opening for the first time or clearing
  useEffect(() => {
    if (messages.length === 0) {
      let greeting = `Hello! I am your WorkFlow Copilot, your personalized AI HR assistant. `;
      if (activeRole === 'Employee' && isOnboardingActive) {
        greeting += `Welcome to WorkFlow! I see you are a new joiner. I can guide you through pre-joining documents, introduce your buddy Alex Rivera, or show your CEO welcome video.`;
      } else {
        greeting += `I am aware that you are currently on the **${activeTab}** workspace as a **${activeRole}**. How can I help you navigate this section or answer any HR policy questions?`;
      }
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isOpen, messages.length, activeRole, activeTab, isOnboardingActive]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          currentView: activeTab,
          userRole: activeRole,
          isOnboarding: activeRole === 'Employee' && isOnboardingActive
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get copilot response');
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      setIsTyping(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantResponse = "";

      // Initialize the stream bubble in the messages list
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          assistantResponse += chunk;
          
          setMessages(prev => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                role: 'assistant',
                content: assistantResponse
              };
            }
            return updated;
          });
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Apologies, I encountered an error communicating with the API. Please check your connection and try again.' }
      ]);
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute bottom-[76px] right-5 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all bg-gradient-to-tr from-teal-550 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white hover:scale-105 active:scale-95 border border-white/20 select-none z-40 group cursor-pointer"
        aria-label="Open HR Copilot Chat"
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" />
        ) : (
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1.5 -right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Persistent Chat Window Container */}
      {isOpen && (
        <div className="absolute bottom-[136px] right-4 left-4 h-[440px] z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-100 dark:border-zinc-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 px-4 py-3 text-white flex items-center justify-between border-b border-teal-500/20 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center border border-white/15">
                <Bot className="w-4 h-4 text-orange-300" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold tracking-tight">WorkFlow Copilot</h4>
                  <span className="text-[8px] uppercase tracking-wider bg-orange-500 text-white font-black px-1.5 py-0.5 rounded-full scale-90">
                    AI Assist
                  </span>
                </div>
                <p className="text-[9px] text-teal-100 font-medium">
                  {activeRole} • {activeTab}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                type="button"
                title="Clear Chat History"
                className="p-1.5 hover:bg-white/10 rounded-lg text-teal-200 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="p-1.5 hover:bg-white/10 rounded-lg text-teal-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-zinc-950/20">
            {messages.map((msg, idx) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex gap-2 max-w-[85%] ${isAssistant ? 'self-start mr-auto' : 'self-end ml-auto flex-row-reverse'}`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                    isAssistant 
                      ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 border-teal-100 dark:border-teal-900/40' 
                      : 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 border-orange-100 dark:border-orange-900/40'
                  }`}>
                    {isAssistant ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`rounded-2xl p-3 text-2xs leading-relaxed shadow-sm font-medium ${
                    isAssistant 
                      ? 'bg-white dark:bg-zinc-850 text-slate-700 dark:text-zinc-200 rounded-tl-sm border border-slate-100 dark:border-zinc-800' 
                      : 'bg-gradient-to-tr from-teal-500 to-teal-600 text-white rounded-tr-sm'
                  }`}>
                    {/* Render markdown style lines nicely */}
                    {msg.content.split('\n').map((line, lIdx) => {
                      let formatted = line;
                      const boldRegex = /\*\*(.*?)\*\*/g;
                      const parts = [];
                      let lastIndex = 0;
                      let match;
                      
                      while ((match = boldRegex.exec(line)) !== null) {
                        parts.push(line.substring(lastIndex, match.index));
                        parts.push(<strong key={match.index} className="font-extrabold text-teal-850 dark:text-teal-300">{match[1]}</strong>);
                        lastIndex = boldRegex.lastIndex;
                      }
                      parts.push(line.substring(lastIndex));

                      return (
                        <p key={lIdx} className={lIdx > 0 ? "mt-1.5" : ""}>
                          {parts.length > 1 ? parts : formatted}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 max-w-[85%] self-start mr-auto">
                <div className="w-6 h-6 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 border border-teal-100 dark:border-teal-900/40 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-white dark:bg-zinc-850 text-slate-400 dark:text-zinc-500 rounded-2xl rounded-tl-sm p-3 text-2xs border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center gap-1.5">
                  <span>Thinking</span>
                  <span className="flex gap-1 items-center mt-1">
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce duration-300" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce duration-300" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-1 rounded-full bg-slate-400 animate-bounce duration-300" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context-Aware Suggestion Chips */}
          <div className="px-3.5 py-2 bg-slate-50/50 dark:bg-zinc-950/30 border-t border-slate-100 dark:border-zinc-800 flex-shrink-0">
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">
              <HelpCircle className="w-3 h-3 text-teal-500" />
              <span>Context Questions</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 select-none flex-nowrap scrollbar-none">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(sug)}
                  className="px-3 py-1.5 bg-white hover:bg-teal-50 text-[10px] font-bold text-slate-600 hover:text-teal-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-teal-950/20 dark:hover:text-teal-400 border border-slate-150 dark:border-zinc-850 hover:border-teal-200 dark:hover:border-teal-900 rounded-full transition-all whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Form Footer */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="p-3 border-t border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about WorkFlow..."
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 text-2xs text-slate-800 dark:text-zinc-200 border border-slate-100 dark:border-zinc-850 rounded-2xl focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-zinc-950 transition-all font-medium disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white disabled:bg-slate-100 disabled:text-slate-400 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-650 transition-colors shadow-md select-none cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
