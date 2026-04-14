import { PageHeader } from "@/components/dashboard/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, RefreshCcw, FileText, ArrowLeft, ArrowRight, User, Eye, Target, CheckCircle2, XCircle } from "lucide-react";
import { fetchResumeAnalyses } from "@/services/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResumeAnalytics() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [viewLog, setViewLog] = useState<any | null>(null);

  useEffect(() => {
    loadAnalyses();
  }, [searchQuery]);

  async function loadAnalyses() {
    setIsLoading(true);
    try {
      const data = await fetchResumeAnalyses();
      // Simple client-side filtering if user_id is a UUID we format it, but search can be limited.
      const filtered = (data || []).filter((log) => 
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (log.user_id && log.user_id.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setLogs(filtered);
    } catch (err: any) {
      toast.error("Failed to load resume analyses");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success bg-success/10 border-success/20";
    if (score >= 50) return "text-warning bg-warning/10 border-warning/20";
    return "text-destructive bg-destructive/10 border-destructive/20";
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Resume Analyses Logs" description="Review automated resume matching evaluations" />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or User UUID..."
            className="pl-9 bg-black/20 border-white/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" className="bg-black/20 border-white/5 gap-2" onClick={loadAnalyses}>
            <RefreshCcw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
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
              <TableHead className="w-[120px]">Analysis ID</TableHead>
              <TableHead>User / Profile</TableHead>
              <TableHead className="text-center">Match Score</TableHead>
              <TableHead>Detected Skills</TableHead>
              <TableHead>Missing Skills</TableHead>
              <TableHead className="w-[150px]">Evaluation Date</TableHead>
              <TableHead className="text-right w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-white/5 animate-pulse">
                  <TableCell><div className="h-4 bg-white/5 rounded w-16" /></TableCell>
                  <TableCell><div className="h-4 bg-white/5 rounded w-32" /></TableCell>
                  <TableCell><div className="h-6 bg-white/5 rounded-full w-12 mx-auto" /></TableCell>
                  <TableCell><div className="h-4 bg-white/5 rounded w-full" /></TableCell>
                  <TableCell><div className="h-4 bg-white/5 rounded w-full" /></TableCell>
                  <TableCell><div className="h-4 bg-white/5 rounded w-24" /></TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No resume analyses found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="border-white/5 hover:bg-white-[0.02] transition-colors">
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer" title={log.id}>
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      ...{log.id.slice(-6)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <div className="rounded bg-secondary p-1 shrink-0"><User className="h-3.5 w-3.5 text-muted-foreground" /></div>
                       <span className="text-sm font-mono text-gray-300 truncate max-w-[140px]" title={log.user_id}>
                          {log.user_id ? `...${log.user_id.slice(-8)}` : "Anonymous"}
                       </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`font-bold px-2 py-0.5 ${getScoreColor(log.match_score)}`}>
                      {log.match_score}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {log.detected_skills && Array.isArray(log.detected_skills) ? (
                        log.detected_skills.slice(0, 3).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                         <span className="text-xs text-muted-foreground italic">None detected</span>
                      )}
                      {log.detected_skills && log.detected_skills.length > 3 && (
                        <span className="text-[10px] text-muted-foreground pl-1">+{log.detected_skills.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {log.missing_skills && Array.isArray(log.missing_skills) ? (
                        log.missing_skills.slice(0, 3).map((skill: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] px-1.5 py-0">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                         <span className="text-xs text-muted-foreground italic">0 missing</span>
                      )}
                      {log.missing_skills && log.missing_skills.length > 3 && (
                         <span className="text-[10px] text-muted-foreground pl-1">+{log.missing_skills.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
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
          <p className="text-xs text-muted-foreground italic">Showing {logs.length} evaluations</p>
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
              <FileText className="h-5 w-5 text-primary" />
              Resume Analysis Output
              <span className="text-muted-foreground text-sm font-normal font-mono ml-2">#{viewLog?.id?.toString().slice(-8)}</span>
            </DialogTitle>
          </DialogHeader>
          {viewLog && (
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-6 pt-4">
                
                <div className="flex items-center justify-between bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 ${getScoreColor(viewLog.match_score).replace('text-', 'border-').replace('bg-', '')}`}>
                      <span className="font-bold">{viewLog.match_score}%</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-200">Overall Match Score</h4>
                      <p className="text-xs text-muted-foreground">Calculated based on detected vs required skills</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">User ID</p>
                    <p className="text-sm font-mono text-gray-300">{viewLog.user_id || "Anonymous"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-success">
                    <CheckCircle2 className="h-4 w-4" /> Detected Skills
                  </div>
                  <div className="bg-success/5 border border-success/10 rounded-xl p-4 shadow-inner min-h-[80px]">
                    <div className="flex flex-wrap gap-2">
                       {viewLog.detected_skills && Array.isArray(viewLog.detected_skills) && viewLog.detected_skills.length > 0 ? (
                         viewLog.detected_skills.map((skill: string, idx: number) => (
                           <Badge key={idx} variant="outline" className="bg-success/10 text-success border-success/20">
                             {skill}
                           </Badge>
                         ))
                       ) : (
                          <span className="text-sm text-muted-foreground italic">No skills detected.</span>
                       )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-destructive mt-2">
                    <XCircle className="h-4 w-4" /> Missing Skills
                  </div>
                  <div className="bg-destructive/5 border border-destructive/10 rounded-xl p-4 shadow-inner min-h-[80px]">
                    <div className="flex flex-wrap gap-2">
                       {viewLog.missing_skills && Array.isArray(viewLog.missing_skills) && viewLog.missing_skills.length > 0 ? (
                         viewLog.missing_skills.map((skill: string, idx: number) => (
                           <Badge key={idx} variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                             {skill}
                           </Badge>
                         ))
                       ) : (
                          <span className="text-sm text-success italic">No missing skills required! Excellent match.</span>
                       )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 text-xs text-muted-foreground text-center">
                  Analyzed on {new Date(viewLog.created_at).toLocaleString()}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
