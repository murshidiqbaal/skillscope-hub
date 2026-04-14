import { useQuery } from "@tanstack/react-query";
import { getHealthStatus } from "@/api/index";
import { supabase } from "@/services/supabase";
import { useEffect, useState } from "react";
import { 
  Users, MessageSquare, Zap, FileCheck, Activity, 
  UserPlus, FileText, TrendingUp, BookOpen 
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Fallback data for charts
const defaultSkills = [
  { skill: "React", demand: 92 }, { skill: "Python", demand: 88 },
  { skill: "AI/ML", demand: 85 }, { skill: "TypeScript", demand: 80 },
  { skill: "Cloud", demand: 75 }, { skill: "DevOps", demand: 70 },
];

const defaultUsage = [
  { week: "W1", analyses: 120 }, { week: "W2", analyses: 180 },
  { week: "W3", analyses: 220 }, { week: "W4", analyses: 195 },
  { week: "W5", analyses: 310 }, { week: "W6", analyses: 280 },
  { week: "W7", analyses: 350 }, { week: "W8", analyses: 420 },
];

const defaultActivity = [
  { icon: UserPlus, text: "Sarah Johnson created a profile", time: "2 min ago", color: "text-primary" },
  { icon: Zap, text: "New skill 'Rust Programming' added", time: "15 min ago", color: "text-accent" },
  { icon: FileText, text: "Resume analyzed for John Doe", time: "32 min ago", color: "text-cyan" },
];

export default function DashboardOverview() {
  const [totalChats, setTotalChats] = useState(0);

  const { data: healthData } = useQuery({
    queryKey: ["healthCheck"],
    queryFn: getHealthStatus,
    refetchInterval: 10000,
  });

  useEffect(() => {
    async function getStats() {
      try {
        const { count } = await supabase.from("chat_logs").select("*", { count: "exact", head: true });
        setTotalChats(count || 0);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    getStats();
  }, []);

  const stats = [
    { title: "Total AI Chats", value: totalChats.toLocaleString(), change: "+5.2% from last week", changeType: "positive" as const, icon: MessageSquare },
    { title: "Active Admins", value: "4", change: "Stable", changeType: "positive" as const, icon: Users, iconColor: "text-accent" },
    { title: "Backend Status", value: healthData?.status === "ok" ? "Healthy" : "Unknown", change: healthData?.version || "v1.0.0", changeType: healthData?.status === "ok" ? "positive" as const : "neutral" as const, icon: Activity, iconColor: healthData?.status === "ok" ? "text-success" : "text-destructive" },
    { title: "System Uptime", value: "99.9%", change: "+0.01% increase", changeType: "positive" as const, icon: Zap, iconColor: "text-cyan" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Dashboard Overview" description="SkillScope AI platform metrics" />
        <div className="flex items-center gap-2 rounded-full border border-white/5 bg-black/20 px-3 py-1 text-[11px] font-medium backdrop-blur-md">
          <div className={`h-2 w-2 rounded-full animate-pulse ${healthData?.status === "ok" ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`} />
          <span className={healthData?.status === "ok" ? "text-success" : "text-destructive"}>
            Backend: {healthData?.status === "ok" ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Chat Application Growth" description="Weekly usage trends">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={defaultUsage}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="analyses" stroke="hsl(var(--primary))" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trending Skills Requested" description="Most common chat topics">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={defaultSkills} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={80} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="demand" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Response Latency" description="AI response performance (ms)">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={defaultUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="analyses" stroke="hsl(var(--cyan))" strokeWidth={2} dot={{ fill: "hsl(var(--cyan))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {defaultActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-md p-1.5 bg-secondary ${activity.color}`}>
                  <activity.icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-card-foreground truncate">{activity.text}</p>
                  <p className="text-[11px] text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
