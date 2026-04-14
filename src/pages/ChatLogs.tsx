import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Calendar, RefreshCcw, MessageSquare, Bot, User, ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { fetchChatLogs } from "@/services/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewLog, setViewLog] = useState<any | null>(null);

  useEffect(() => {
    loadLogs();
  }, [searchQuery]);

  async function loadLogs() {
    setIsLoading(true);
    try {
      const data = await fetchChatLogs(searchQuery);
      setLogs(data || []);
    } catch (err: any) {
      toast.error("Failed to load logs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Chat History Logs" description="Review all AI interactions and system responses" />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by message content..."
            className="pl-9 bg-black/20 border-white/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="bg-black/20 border-white/5 gap-2" onClick={loadLogs}>
            <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="bg-black/20 border-white/5 gap-2">
            <Calendar className="h-3.5 w-3.5" />
            Filter Date
          </Button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/5 bg-[#0F1320]/50 backdrop-blur-xl overflow-hidden"
      >
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>User Message</TableHead>
              <TableHead>AI Response</TableHead>
              <TableHead className="w-[150px]">Timestamp</TableHead>
              <TableHead className="text-right w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-white/5 animate-pulse">
                  <TableCell><div className="h-4 bg-white/5 rounded w-8" /></TableCell>
                  <TableCell><div className="h-4 bg-white/5 rounded w-full" /></TableCell>
                  <TableCell><div className="h-4 bg-white/5 rounded w-full" /></TableCell>
                  <TableCell><div className="h-4 bg-white/5 rounded w-24" /></TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No chat logs found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white-[0.02] transition-colors">
                  <TableCell className="text-xs text-muted-foreground font-mono">#{log.id.toString().slice(-4)}</TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-sm">
                      <div className="mt-1 rounded bg-secondary p-1 shrink-0"><User className="h-3 w-3" /></div>
                      <p className="text-sm leading-relaxed line-clamp-2">{log.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2 max-w-md">
                      <div className="mt-1 rounded bg-primary/20 p-1 shrink-0"><Bot className="h-3 w-3 text-primary" /></div>
                      <p className="text-sm leading-relaxed line-clamp-3 text-gray-300">{log.response}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 text-primary" onClick={() => setViewLog(log)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t border-white/5 bg-black/10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground italic">Showing {logs.length} entries</p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled><ArrowLeft className="h-4 w-4" /></Button>
            <span className="text-xs font-medium">Page 1</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled><ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </motion.div>

      <Dialog open={!!viewLog} onOpenChange={() => setViewLog(null)}>
        <DialogContent className="max-w-3xl bg-[#0F1320] border-white/5 text-white max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Interaction Preview
              <span className="text-muted-foreground text-sm font-normal font-mono ml-2">#{viewLog?.id?.toString().slice(-6)}</span>
            </DialogTitle>
          </DialogHeader>
          {viewLog && (
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                    <User className="h-4 w-4" /> User Prompter
                    {viewLog.user_id && <span className="text-xs text-muted-foreground ml-auto font-mono">{viewLog.user_id}</span>}
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm leading-relaxed text-gray-200 shadow-inner">
                    {viewLog.message}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/80 mt-2">
                    <Bot className="h-4 w-4 text-primary" /> AI Assistant Response
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap shadow-inner">
                    {viewLog.response}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(viewLog.created_at).toLocaleString()}
                  </div>
                  <div>Sender: {viewLog.sender || "System"}</div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
