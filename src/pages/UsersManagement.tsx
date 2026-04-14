import { Eye, UserX, Trash2, Search, Mail, MapPin, Briefcase, Calendar, Link as LinkIcon, GraduationCap, Award, Globe, Github, Linkedin, Twitter } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Input } from "@/components/ui/input";
import { fetchProfiles } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewUser, setViewUser] = useState<any | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => fetchProfiles(searchQuery),
  });

  const parseJSON = (str: string | undefined | null) => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users Management" description={`${users.length} registered user profiles`} />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9 bg-black/20 border-white/5"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="rounded-xl border border-white/5 bg-[#0F1320]/50 backdrop-blur-xl overflow-hidden"
      >
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead>User Profile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Target Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="border-white/5 animate-pulse">
                  <TableCell><div className="h-10 w-40 bg-white/5 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-white/5 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-white/5 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-white/5 rounded" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-white/5 rounded" /></TableCell>
                  <TableCell><div className="h-8 w-24 bg-white/5 rounded ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No user profiles found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white-[0.02] transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-white/10">
                        <AvatarImage src={user.avatar_url || user.profile_picture} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {user.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-200">{user.name || "Anonymous User"}</span>
                        <span className="text-[11px] text-muted-foreground">{user.job_title || "Professional"}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{user.email}</TableCell>
                  <TableCell className="text-sm text-gray-400">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {user.target_role || "Not specified"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{user.location || "Remote"}</TableCell>
                  <TableCell className="text-sm text-gray-400">{user.years_of_experience || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 text-primary" onClick={() => setViewUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 text-muted-foreground">
                      <UserX className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-4xl bg-[#0F1320] border-white/5 text-white max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold">Comprehensive User Profile</DialogTitle>
          </DialogHeader>
          {viewUser && (
            <ScrollArea className="flex-1 pr-4 -mr-4">
              <div className="space-y-8 pt-2 pb-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <Avatar className="h-24 w-24 border-2 border-primary/30 shadow-lg shadow-primary/10 shrink-0">
                    <AvatarImage src={viewUser.avatar_url || viewUser.profile_picture} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {viewUser.name?.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white">{viewUser.name}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground mt-2 text-sm">
                      <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-primary/70" />{viewUser.job_title || "Professional"}</div>
                      <span className="text-white/20">•</span>
                      <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary/70" />{viewUser.location || "Remote"}</div>
                      <span className="text-white/20">•</span>
                      <div className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-primary/70" />{viewUser.email}</div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {viewUser.availability && <Badge variant="secondary" className="bg-success/10 text-success border-success/20">{viewUser.availability}</Badge>}
                      {viewUser.work_preference && <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">{viewUser.work_preference}</Badge>}
                      {viewUser.target_role && <Badge variant="outline" className="border-white/10 text-gray-300">Target Role: {viewUser.target_role}</Badge>}
                      {viewUser.salary_expectation && <Badge variant="outline" className="border-white/10 text-gray-300">Expected: {viewUser.salary_expectation}</Badge>}
                      {viewUser.years_of_experience && <Badge variant="outline" className="border-white/10 text-gray-300">{viewUser.years_of_experience}</Badge>}
                    </div>
                  </div>
                </div>

                {/* About & Bio */}
                {viewUser.bio && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground border-b border-white/5 pb-2">About</h3>
                    <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                      {viewUser.bio}
                    </p>
                  </div>
                )}

                {/* Stats & Links */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left Column: Skills, Languages, Socials */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground border-b border-white/5 pb-2">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {parseJSON(viewUser.skills).length > 0 ? 
                          parseJSON(viewUser.skills).map((skill: any, i: number) => (
                            <Badge key={i} variant="secondary" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                              {typeof skill === 'string' ? skill : skill.name || JSON.stringify(skill)}
                            </Badge>
                          )) : (
                            <span className="text-sm text-muted-foreground italic">No skills listed</span>
                          )
                        }
                      </div>
                    </div>

                    {(viewUser.spoken_languages || viewUser.certifications || viewUser.achievements) && (
                      <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/5">
                        {viewUser.spoken_languages && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Languages</span>
                            <span className="text-sm text-gray-300">{viewUser.spoken_languages}</span>
                          </div>
                        )}
                        {viewUser.certifications && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Certifications</span>
                            <span className="text-sm text-gray-300">{viewUser.certifications}</span>
                          </div>
                        )}
                        {viewUser.achievements && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Achievements</span>
                            <span className="text-sm text-gray-300">{viewUser.achievements}</span>
                          </div>
                        )}
                         {viewUser.open_source_contributions && (
                          <div>
                            <span className="text-xs text-muted-foreground block mb-1">Open Source Contributions</span>
                            <span className="text-sm text-gray-300">{viewUser.open_source_contributions}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground border-b border-white/5 pb-2">Links & Profiles</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        {viewUser.github_url && <a href={viewUser.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors border border-white/5"><Github className="h-4 w-4" /> GitHub</a>}
                        {viewUser.linkedin_url && <a href={viewUser.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#0A66C2]/20 rounded-lg text-gray-300 hover:text-[#0A66C2] transition-colors border border-white/5"><Linkedin className="h-4 w-4" /> LinkedIn</a>}
                        {viewUser.twitter_url && <a href={viewUser.twitter_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-[#1D9BF0]/20 rounded-lg text-gray-300 hover:text-[#1D9BF0] transition-colors border border-white/5"><Twitter className="h-4 w-4" /> Twitter</a>}
                        {viewUser.portfolio_url && <a href={viewUser.portfolio_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-primary/20 rounded-lg text-gray-300 hover:text-primary transition-colors border border-white/5"><Globe className="h-4 w-4" /> Portfolio</a>}
                        {viewUser.blog_url && <a href={viewUser.blog_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors border border-white/5"><LinkIcon className="h-4 w-4" /> Blog</a>}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Experience, Education, Projects */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground border-b border-white/5 pb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Experience
                      </h3>
                      <div className="space-y-4">
                        {parseJSON(viewUser.experience).length > 0 ? (
                          parseJSON(viewUser.experience).map((exp: any, i: number) => (
                            <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 relative pl-6">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-l-xl"></div>
                              <h4 className="font-semibold text-gray-200">{exp.title || exp.role || "Role"}</h4>
                              <p className="text-sm text-primary mb-2">{exp.company || "Company"}</p>
                              {exp.duration && <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Calendar className="h-3 w-3" /> {exp.duration}</p>}
                              {exp.description && <p className="text-sm text-gray-400 mt-2">{exp.description}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No experience listed</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground border-b border-white/5 pb-2 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" /> Education
                      </h3>
                      <div className="space-y-4">
                        {parseJSON(viewUser.education).length > 0 ? (
                          parseJSON(viewUser.education).map((edu: any, i: number) => (
                            <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5">
                              <h4 className="font-semibold text-gray-200">{edu.degree || edu.field || "Degree"}</h4>
                              <p className="text-sm text-primary">{edu.institution || edu.school || "Institution"}</p>
                              {edu.year && <p className="text-xs text-muted-foreground mt-1">{edu.year}</p>}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No education listed</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground border-b border-white/5 pb-2 flex items-center gap-2">
                        <Award className="h-4 w-4" /> Projects
                      </h3>
                      <div className="space-y-4">
                        {parseJSON(viewUser.projects).length > 0 ? (
                          parseJSON(viewUser.projects).map((proj: any, i: number) => (
                            <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5">
                              <h4 className="font-semibold text-gray-200 mb-1">{proj.name || proj.title || "Project Name"}</h4>
                              {proj.description && <p className="text-sm text-gray-400 mb-3">{proj.description}</p>}
                              {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1"><LinkIcon className="h-3 w-3" /> View Project</a>}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No projects listed</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 text-xs text-center text-muted-foreground">
                  Profile ID: {viewUser.id} • Joined: {new Date(viewUser.created_at).toLocaleDateString()}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
