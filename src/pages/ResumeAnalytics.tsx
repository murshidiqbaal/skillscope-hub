import { ChartCard } from "@/components/dashboard/ChartCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const jobRoles = [
  { role: "Software Engineer", count: 2840 },
  { role: "Data Scientist", count: 2100 },
  { role: "Product Manager", count: 1650 },
  { role: "DevOps Engineer", count: 1200 },
  { role: "UI/UX Designer", count: 980 },
  { role: "ML Engineer", count: 870 },
];

const matchScores = [
  { range: "0-20%", count: 120 },
  { range: "21-40%", count: 340 },
  { range: "41-60%", count: 680 },
  { range: "61-80%", count: 520 },
  { range: "81-100%", count: 230 },
];

const missingSkills = [
  { skill: "System Design", value: 68 },
  { skill: "Cloud Computing", value: 62 },
  { skill: "Data Structures", value: 55 },
  { skill: "CI/CD", value: 48 },
  { skill: "Testing", value: 42 },
  { skill: "Agile/Scrum", value: 38 },
];

const topResources = [
  { name: "React Guide", recommendations: 1240 },
  { name: "Python ML", recommendations: 980 },
  { name: "System Design", recommendations: 870 },
  { name: "AWS Cert", recommendations: 720 },
  { name: "DSA Course", recommendations: 650 },
];

const COLORS = ["hsl(245,58%,58%)", "hsl(263,70%,58%)", "hsl(187,92%,50%)", "hsl(152,60%,50%)", "hsl(38,92%,55%)"];

export default function ResumeAnalytics() {
  return (
    <div className="space-y-6">
      <PageHeader title="Resume Validator Analytics" description="Insights from resume analysis data" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Most Analyzed Job Roles" description="Top roles by analysis count">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobRoles}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,14%,20%)" />
              <XAxis dataKey="role" tick={{ fontSize: 11 }} stroke="hsl(228,10%,40%)" angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(228,10%,40%)" />
              <Tooltip contentStyle={{ background: "hsl(228,18%,12%)", border: "1px solid hsl(228,14%,20%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="hsl(245,58%,58%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Average Resume Match Score" description="Distribution of match scores">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={matchScores} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="count" nameKey="range" label={({ range, percent }) => `${range} (${(percent * 100).toFixed(0)}%)`} labelLine={false} fontSize={11}>
                {matchScores.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(228,18%,12%)", border: "1px solid hsl(228,14%,20%)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Missing Skills" description="Most frequently missing from resumes">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={missingSkills}>
              <PolarGrid stroke="hsl(228,14%,20%)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "hsl(228,10%,50%)" }} />
              <Radar dataKey="value" stroke="hsl(263,70%,58%)" fill="hsl(263,70%,58%)" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ background: "hsl(228,18%,12%)", border: "1px solid hsl(228,14%,20%)", borderRadius: 8, fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Most Recommended Resources" description="Top learning resources from analysis">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topResources} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228,14%,20%)" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(228,10%,40%)" />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="hsl(228,10%,40%)" width={100} />
              <Tooltip contentStyle={{ background: "hsl(228,18%,12%)", border: "1px solid hsl(228,14%,20%)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="recommendations" fill="hsl(187,92%,50%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
