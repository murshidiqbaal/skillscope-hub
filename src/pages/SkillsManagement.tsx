import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ModalForm } from "@/components/dashboard/ModalForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

interface Skill {
  id: number;
  name: string;
  category: string;
  demandScore: number;
  growthRate: string;
  status: "Active" | "Inactive" | "Trending";
}

const initialSkills: Skill[] = [
  { id: 1, name: "React.js", category: "Frontend", demandScore: 92, growthRate: "+15%", status: "Trending" },
  { id: 2, name: "Python", category: "Backend", demandScore: 88, growthRate: "+12%", status: "Active" },
  { id: 3, name: "Machine Learning", category: "AI/ML", demandScore: 85, growthRate: "+22%", status: "Trending" },
  { id: 4, name: "TypeScript", category: "Frontend", demandScore: 80, growthRate: "+18%", status: "Active" },
  { id: 5, name: "AWS", category: "Cloud", demandScore: 78, growthRate: "+8%", status: "Active" },
  { id: 6, name: "Docker", category: "DevOps", demandScore: 75, growthRate: "+10%", status: "Active" },
  { id: 7, name: "Rust", category: "Systems", demandScore: 65, growthRate: "+30%", status: "Trending" },
  { id: 8, name: "GraphQL", category: "Backend", demandScore: 60, growthRate: "-2%", status: "Inactive" },
];

const categories = ["Frontend", "Backend", "AI/ML", "Cloud", "DevOps", "Systems", "Mobile", "Data"];

export default function SkillsManagement() {
  const [skills, setSkills] = useState(initialSkills);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState({ name: "", category: "", demandScore: "", growthRate: "", status: "Active" as Skill["status"] });

  const filtered = skills.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCat === "all" || s.category === filterCat)
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", category: "", demandScore: "", growthRate: "", status: "Active" });
    setModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setForm({ name: skill.name, category: skill.category, demandScore: String(skill.demandScore), growthRate: skill.growthRate, status: skill.status });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    if (editing) {
      setSkills(prev => prev.map(s => s.id === editing.id ? { ...s, ...form, demandScore: Number(form.demandScore) } : s));
    } else {
      setSkills(prev => [...prev, { id: Date.now(), ...form, demandScore: Number(form.demandScore) }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const statusColor = (status: string) => {
    if (status === "Trending") return "bg-accent/10 text-accent border-accent/20";
    if (status === "Active") return "bg-success/10 text-success border-success/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Trending Skills" description="Manage skills displayed across the platform">
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Skill</Button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search skills..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Skill Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Demand Score</TableHead>
              <TableHead>Growth Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(skill => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">{skill.name}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{skill.category}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full gradient-primary" style={{ width: `${skill.demandScore}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{skill.demandScore}</span>
                  </div>
                </TableCell>
                <TableCell className={`text-sm ${skill.growthRate.startsWith("+") ? "text-success" : "text-destructive"}`}>{skill.growthRate}</TableCell>
                <TableCell><Badge variant="outline" className={`text-[11px] ${statusColor(skill.status)}`}>{skill.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(skill)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(skill.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <ModalForm open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Skill" : "Add Skill"} onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div><Label>Skill Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Demand Score</Label><Input type="number" value={form.demandScore} onChange={e => setForm(f => ({ ...f, demandScore: e.target.value }))} /></div>
            <div><Label>Growth Rate</Label><Input value={form.growthRate} onChange={e => setForm(f => ({ ...f, growthRate: e.target.value }))} placeholder="+10%" /></div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as Skill["status"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
