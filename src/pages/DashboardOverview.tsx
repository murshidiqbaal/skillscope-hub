import { Users, TrendingUp, BookOpen, FileCheck, UserPlus, Zap, FileText } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

import { useQuery } from "@tanstack/react-query";
import { fetchAdminStats, fetchSkillDemandChart, fetchResumeUsageChart, fetchAdminActivity } from "@/lib/api";

// Fallback data for demonstration if backend is not yet available
const defaultStats = [
  { title: "Total Users", value: "6,142", change: "+12.5%", changeType: "positive" as const, icon: Users },
  { title: "Total Skills", value: "384", change: "+8 new", changeType: "positive" as const, icon: TrendingUp, iconColor: "text-accent" },
  { title: "Learning Resources", value: "1,247", change: "+23 added", changeType: "positive" as const, icon: BookOpen, iconColor: "text-cyan" },
  { title: "Resume Analyses", value: "12,891", change: "+18.2%", changeType: "positive" as const, icon: FileCheck, iconColor: "text-success" },
];

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
  const { data: stats = defaultStats } = useQuery({ queryKey: ["adminStats"], queryFn: fetchAdminStats, retry: 1 });
  const { data: skills = defaultSkills } = useQuery({ queryKey: ["skillDemand"], queryFn: fetchSkillDemandChart, retry: 1 });
  const { data: usage = defaultUsage } = useQuery({ queryKey: ["resumeUsage"], queryFn: fetchResumeUsageChart, retry: 1 });
  const { data: activities = defaultActivity } = useQuery({ queryKey: ["adminActivity"], queryFn: fetchAdminActivity, retry: 1 });

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Overview" description="Platform performance at a glance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat: any, i: number) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="User Growth" description="Monthly active users over time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={usage}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 14%, 20%)" />
              <XAxis dataKey={usage[0]?.month ? "month" : "week"} tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" />
              <Tooltip contentStyle={{ background: "hsl(228, 18%, 12%)", border: "1px solid hsl(228, 14%, 20%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey={usage[0]?.users ? "users" : "analyses"} stroke="hsl(245, 58%, 58%)" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trending Skills Demand" description="Top skills by demand score">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={skills} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 14%, 20%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" width={80} />
              <Tooltip contentStyle={{ background: "hsl(228, 18%, 12%)", border: "1px solid hsl(228, 14%, 20%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="demand" fill="hsl(263, 70%, 58%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartCard title="Resume Validator Usage" description="Weekly analysis volume">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={usage}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 14%, 20%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" />
                <Tooltip contentStyle={{ background: "hsl(228, 18%, 12%)", border: "1px solid hsl(228, 14%, 20%)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="analyses" stroke="hsl(187, 92%, 50%)" strokeWidth={2} dot={{ fill: "hsl(187, 92%, 50%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity, i) => (
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
