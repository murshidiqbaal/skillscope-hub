import { Users, TrendingUp, BookOpen, FileCheck, UserPlus, Zap, FileText } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const userGrowth = [
  { month: "Jan", users: 1200 }, { month: "Feb", users: 1800 },
  { month: "Mar", users: 2400 }, { month: "Apr", users: 3100 },
  { month: "May", users: 3800 }, { month: "Jun", users: 4600 },
  { month: "Jul", users: 5200 }, { month: "Aug", users: 6100 },
];

const skillsDemand = [
  { skill: "React", demand: 92 }, { skill: "Python", demand: 88 },
  { skill: "AI/ML", demand: 85 }, { skill: "TypeScript", demand: 80 },
  { skill: "Cloud", demand: 75 }, { skill: "DevOps", demand: 70 },
];

const resumeUsage = [
  { week: "W1", analyses: 120 }, { week: "W2", analyses: 180 },
  { week: "W3", analyses: 220 }, { week: "W4", analyses: 195 },
  { week: "W5", analyses: 310 }, { week: "W6", analyses: 280 },
  { week: "W7", analyses: 350 }, { week: "W8", analyses: 420 },
];

const activities = [
  { icon: UserPlus, text: "Sarah Johnson created a profile", time: "2 min ago", color: "text-primary" },
  { icon: Zap, text: "New skill 'Rust Programming' added", time: "15 min ago", color: "text-accent" },
  { icon: FileText, text: "Resume analyzed for John Doe", time: "32 min ago", color: "text-cyan" },
  { icon: UserPlus, text: "Michael Chen signed up", time: "1 hr ago", color: "text-primary" },
  { icon: Zap, text: "Skill 'Kubernetes' trending up 12%", time: "2 hrs ago", color: "text-success" },
  { icon: FileText, text: "Batch resume analysis completed (24 resumes)", time: "3 hrs ago", color: "text-cyan" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard Overview" description="Platform performance at a glance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="6,142" change="+12.5% from last month" changeType="positive" icon={Users} />
        <StatCard title="Total Skills" value="384" change="+8 new this week" changeType="positive" icon={TrendingUp} iconColor="text-accent" />
        <StatCard title="Learning Resources" value="1,247" change="+23 added this month" changeType="positive" icon={BookOpen} iconColor="text-cyan" />
        <StatCard title="Resume Analyses" value="12,891" change="+18.2% from last month" changeType="positive" icon={FileCheck} iconColor="text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="User Growth" description="Monthly active users over time">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(245, 58%, 51%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 14%, 20%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(228, 10%, 40%)" />
              <Tooltip contentStyle={{ background: "hsl(228, 18%, 12%)", border: "1px solid hsl(228, 14%, 20%)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="hsl(245, 58%, 58%)" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trending Skills Demand" description="Top skills by demand score">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={skillsDemand} layout="vertical">
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
              <LineChart data={resumeUsage}>
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
