import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Shield, Calendar, User as UserIcon, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminProfile() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader title="Admin Profile" description="Manage your account and platform settings" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 space-y-6"
        >
          <Card className="glass-card border-white/5 bg-[#0F1320]/50 backdrop-blur-xl text-center">
            <CardContent className="pt-6">
              <div className="relative inline-block mb-4">
                <Avatar className="h-24 w-24 border-2 border-primary/20 p-1">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-success border-2 border-[#0F1320] shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
              <h2 className="text-xl font-bold text-white">{user.email?.split('@')[0]}</h2>
              <Badge variant="secondary" className="mt-2 bg-primary/20 text-primary border-primary/10 px-3">
                System Administrator
              </Badge>
              
              <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-2">
                <Button variant="outline" className="w-full bg-black/20 border-white/5 hover:bg-white/5 gap-2 h-10">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full gap-2 h-10 shadow-lg shadow-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-6"
        >
          <Card className="glass-card border-white/5 bg-[#0F1320]/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
              <CardDescription>Details about your administrative account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-medium tracking-wider">
                    <UserIcon className="h-3 w-3" /> Full Name
                  </p>
                  <p className="text-sm font-semibold text-gray-200">System Admin</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-medium tracking-wider">
                    <Mail className="h-3 w-3" /> Email Address
                  </p>
                  <p className="text-sm font-semibold text-gray-200">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-medium tracking-wider">
                    <Shield className="h-3 w-3" /> Security Access
                  </p>
                  <p className="text-sm font-semibold text-gray-200">Full Privileges (Master)</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase flex items-center gap-1.5 font-medium tracking-wider">
                    <Calendar className="h-3 w-3" /> Joined Date
                  </p>
                  <p className="text-sm font-semibold text-gray-200">
                    {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/5">
                <h3 className="text-sm font-semibold mb-4 text-white">Platform Preferences</h3>
                <div className="flex gap-3">
                  <Badge variant="outline" className="bg-black/20 border-white/5 py-1.5">Dark Mode: Enabled</Badge>
                  <Badge variant="outline" className="bg-black/20 border-white/5 py-1.5">2FA: Active</Badge>
                  <Badge variant="outline" className="bg-black/20 border-white/5 py-1.5">API Access: Root</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/5 bg-[#0F1320]/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg">Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {[
                  { event: "Login Successful", device: "Chrome / Windows 11", time: "2 hours ago" },
                  { event: "Profile Updated", device: "Admin Dashboard", time: "Yesterday" },
                  { event: "Password Changed", device: "Recovery Flow", time: "14 days ago" }
                ].map((item, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.device}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground italic">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
