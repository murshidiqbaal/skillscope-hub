import { Eye, UserX, Trash2, Search } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Input } from "@/components/ui/input";
import { searchProfiles } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  signupDate: string;
  profileCompleted: boolean;
  active: boolean;
}

const initialUsers: User[] = [
  { id: 1, name: "Sarah Johnson", email: "sarah@example.com", signupDate: "2024-01-15", profileCompleted: true, active: true },
  { id: 2, name: "Michael Chen", email: "michael@example.com", signupDate: "2024-02-20", profileCompleted: true, active: true },
  { id: 3, name: "Emily Davis", email: "emily@example.com", signupDate: "2024-03-10", profileCompleted: false, active: true },
  { id: 4, name: "James Wilson", email: "james@example.com", signupDate: "2024-04-05", profileCompleted: true, active: false },
  { id: 5, name: "Priya Patel", email: "priya@example.com", signupDate: "2024-04-18", profileCompleted: true, active: true },
  { id: 6, name: "Alex Kim", email: "alex@example.com", signupDate: "2024-05-02", profileCompleted: false, active: true },
  { id: 7, name: "Maria Garcia", email: "maria@example.com", signupDate: "2024-05-22", profileCompleted: true, active: true },
];

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewUser, setViewUser] = useState<User | null>(null);

  const { data: users = initialUsers, isLoading } = useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => searchQuery ? searchProfiles(searchQuery) : Promise.resolve(initialUsers),
    enabled: true,
  });

  const toggleActive = (id: number) => {
    // In a real app, this would be a Supabase mutation
    console.log("Toggle active for", id);
  };

  const deleteUser = (id: number) => {
    // In a real app, this would be a Supabase mutation
    console.log("Delete user", id);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users Management" description={`${users.length} registered users`} />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or email..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Signup Date</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(user.signupDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[11px] ${user.profileCompleted ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                    {user.profileCompleted ? "Complete" : "Incomplete"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[11px] ${user.active ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}`}>
                    {user.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewUser(user)}><Eye className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleActive(user.id)}><UserX className="h-3.5 w-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteUser(user.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>User Profile</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary/10 text-primary">{viewUser.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                <div><p className="font-semibold">{viewUser.name}</p><p className="text-sm text-muted-foreground">{viewUser.email}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Signup Date</p><p className="font-medium">{new Date(viewUser.signupDate).toLocaleDateString()}</p></div>
                <div><p className="text-muted-foreground">Profile</p><p className="font-medium">{viewUser.profileCompleted ? "Complete" : "Incomplete"}</p></div>
                <div><p className="text-muted-foreground">Status</p><p className="font-medium">{viewUser.active ? "Active" : "Inactive"}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
