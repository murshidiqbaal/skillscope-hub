import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ModalForm } from "@/components/dashboard/ModalForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

interface Resource {
  id: number;
  skill: string;
  title: string;
  description: string;
  url: string;
  type: "Video" | "Course" | "Article" | "PDF";
}

const initialResources: Resource[] = [
  { id: 1, skill: "React.js", title: "React Complete Guide 2024", description: "Comprehensive React course", url: "https://example.com", type: "Course" },
  { id: 2, skill: "Python", title: "Python for Data Science", description: "Learn Python for ML", url: "https://example.com", type: "Video" },
  { id: 3, skill: "Machine Learning", title: "ML Crash Course by Google", description: "Free ML course", url: "https://example.com", type: "Course" },
  { id: 4, skill: "TypeScript", title: "TypeScript Deep Dive", description: "Advanced TS patterns", url: "https://example.com", type: "Article" },
  { id: 5, skill: "AWS", title: "AWS Solutions Architect Guide", description: "Certification prep", url: "https://example.com", type: "PDF" },
];

const typeColor: Record<string, string> = {
  Video: "bg-accent/10 text-accent border-accent/20",
  Course: "bg-primary/10 text-primary border-primary/20",
  Article: "bg-cyan/10 text-cyan border-cyan/20",
  PDF: "bg-warning/10 text-warning border-warning/20",
};

export default function ResourcesManagement() {
  const [resources, setResources] = useState(initialResources);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [form, setForm] = useState({ skill: "", title: "", description: "", url: "", type: "Course" as Resource["type"] });

  const openAdd = () => { setEditing(null); setForm({ skill: "", title: "", description: "", url: "", type: "Course" }); setModalOpen(true); };
  const openEdit = (r: Resource) => { setEditing(r); setForm({ skill: r.skill, title: r.title, description: r.description, url: r.url, type: r.type }); setModalOpen(true); };

  const handleSubmit = () => {
    if (editing) {
      setResources(prev => prev.map(r => r.id === editing.id ? { ...r, ...form } : r));
    } else {
      setResources(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Learning Resources" description="Manage educational content linked to skills">
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Resource</Button>
      </PageHeader>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead>Skill</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{r.skill}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={`text-[11px] ${typeColor[r.type]}`}>{r.type}</Badge></TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">{r.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild><a href={r.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setResources(prev => prev.filter(x => x.id !== r.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <ModalForm open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Resource" : "Add Resource"} onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div><Label>Skill</Label><Input value={form.skill} onChange={e => setForm(f => ({ ...f, skill: e.target.value }))} /></div>
          <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div><Label>URL</Label><Input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} /></div>
          <div>
            <Label>Type</Label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v as Resource["type"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Course">Course</SelectItem>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </ModalForm>
    </div>
  );
}
