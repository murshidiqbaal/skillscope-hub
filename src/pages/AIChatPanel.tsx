import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, History, Trash2 } from "lucide-react";
import { sendChatMessage } from "@/api/index";
import { saveChatLog, fetchChatLogs } from "@/services/supabase";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  async function loadHistory() {
    try {
      const logs = await fetchChatLogs();
      setChatHistory(logs || []);
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(input);
      const aiResponse = response.reply || response.response || "No response from AI";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Save to Supabase
      await saveChatLog(userMessage.content, assistantMessage.content);
      loadHistory();
    } catch (err: any) {
      toast.error("Failed to get AI response");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4 overflow-hidden">
      <div className="flex flex-1 flex-col space-y-4 overflow-hidden">
        <PageHeader title="AI Chat Testing" description="Test your FastAPI backend and Groq AI integrations" />
        
        <Card className="flex flex-1 flex-col overflow-hidden glass-card border-white/5 bg-[#0F1320]/50 backdrop-blur-xl">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pr-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Ready to test</h3>
                  <p className="max-w-xs text-sm">Send a message to test your unified backend and AI logic.</p>
                </div>
              )}
              
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[80%] items-start gap-3 rounded-2xl p-4 ${
                      message.role === "user" 
                        ? "bg-primary text-white" 
                        : "bg-secondary/50 border border-white/5 text-gray-200"
                    }`}>
                      <div className={`mt-0.5 rounded-lg p-1.5 ${message.role === "user" ? "bg-white/20" : "bg-primary/20"}`}>
                        {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className="text-[10px] opacity-50">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-secondary/50 p-4 text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm italic">SkillScope AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          
          <div className="border-t border-white/5 p-4 bg-black/20">
            <form onSubmit={handleSend} className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 rounded-xl"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-xl px-4 h-auto aspect-square">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </Card>
      </div>

      <Card className="w-80 hidden xl:flex flex-col glass-card border-white/5 bg-[#0F1320]/30 overflow-hidden">
        <div className="p-4 border-bottom border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <History className="h-4 w-4 text-primary" />
            <span>Session Logs</span>
          </div>
          <Badge variant="outline" className="text-[10px] py-0">{chatHistory.length}</Badge>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-3">
            {chatHistory.length === 0 ? (
              <p className="text-xs text-center text-muted-foreground py-10 italic">No logs found</p>
            ) : (
              chatHistory.slice(0, 15).map((log) => (
                <div key={log.id} className="p-3 rounded-xl border border-white/5 bg-black/20 space-y-2 hover:bg-black/30 transition-colors cursor-default group">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <p className="text-[11px] text-gray-300 truncate font-medium">{log.message}</p>
                  </div>
                  <div className="flex items-start gap-2 pl-2 border-l border-primary/30">
                    <Bot className="h-3 w-3 text-primary/70 shrink-0" />
                    <p className="text-[10px] text-gray-400 line-clamp-2">{log.response}</p>
                  </div>
                  <div className="text-[9px] text-muted-foreground text-right pt-1 opacity-50">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="p-3 border-t border-white/5 bg-black/10">
          <Button variant="ghost" size="sm" className="w-full text-[11px] text-muted-foreground hover:text-white h-8" asChild>
            <a href="/logs">View Full History</a>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Badge({ children, variant, className }: any) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
      variant === "outline" ? "border-white/10 text-muted-foreground" : "bg-primary text-white"
    } ${className}`}>
      {children}
    </span>
  );
}
