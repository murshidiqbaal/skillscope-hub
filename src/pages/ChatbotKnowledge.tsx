import { useState } from "react";
import { Plus, Pencil, Trash2, Bot } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ModalForm } from "@/components/dashboard/ModalForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface Topic {
  id: number;
  title: string;
  description: string;
  relatedSkills: string[];
}

const initialTopics: Topic[] = [
  { id: 1, title: "Flutter Developer Career Path", description: "Complete guide to becoming a Flutter developer including skills, certifications, and career progression", relatedSkills: ["Flutter", "Dart", "Mobile Development"] },
  { id: 2, title: "How to Learn AI", description: "Step-by-step roadmap for learning artificial intelligence from scratch", relatedSkills: ["Python", "Machine Learning", "Deep Learning"] },
  { id: 3, title: "Backend Developer Roadmap", description: "Comprehensive guide covering backend technologies, databases, and deployment", relatedSkills: ["Node.js", "Python", "Databases", "DevOps"] },
  { id: 4, title: "Cloud Engineering Fundamentals", description: "Essential cloud computing concepts and certifications for engineers", relatedSkills: ["AWS", "Azure", "GCP", "Docker"] },
  { id: 5, title: "Data Science Interview Prep", description: "Common interview questions and preparation strategies for data science roles", relatedSkills: ["Statistics", "Python", "SQL", "ML"] },
];

export default function ChatbotKnowledge() {
  const [topics, setTopics] = useState(initialTopics);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [form, setForm] = useState({ title: "", description: "", skills: "" });

  const openAdd = () => { setEditing(null); setForm({ title: "", description: "", skills: "" }); setModalOpen(true); };
  const openEdit = (t: Topic) => { setEditing(t); setForm({ title: t.title, description: t.description, skills: t.relatedSkills.join(", ") }); setModalOpen(true); };

  const handleSubmit = () => {
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    if (editing) {
      setTopics(prev => prev.map(t => t.id === editing.id ? { ...t, title: form.title, description: form.description, relatedSkills: skills } : t));
    } else {
      setTopics(prev => [...prev, { id: Date.now(), title: form.title, description: form.description, relatedSkills: skills }]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Chatbot Knowledge Base" description="Manage AI chatbot training topics">
        <Button onClick={openAdd} size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Topic</Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {topics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="rounded-lg p-2 bg-accent/10">
                <Bot className="h-5 w-5 text-accent" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(topic)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => setTopics(prev => prev.filter(t => t.id !== topic.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <h3 className="font-semibold text-sm text-card-foreground mb-1.5">{topic.title}</h3>
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{topic.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {topic.relatedSkills.map(skill => (
                <Badge key={skill} variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">{skill}</Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <ModalForm open={modalOpen} onOpenChange={setModalOpen} title={editing ? "Edit Topic" : "Add Topic"} onSubmit={handleSubmit}>
        <div className="space-y-3">
          <div><Label>Topic Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div><Label>Related Skills (comma-separated)</Label><Input value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} placeholder="React, TypeScript, Node.js" /></div>
        </div>
      </ModalForm>
    </div>
  );
}
