import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

export default function SystemSettings() {
  const [apiUrl, setApiUrl] = useState("https://api.skillscope.ai/v1");
  const [apiKey, setApiKey] = useState("sk-•••••••••••••••••");
  const [model, setModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState("0.7");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader title="System Settings" description="Configure platform settings and integrations" />

      <Tabs defaultValue="api" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="api">API Configuration</TabsTrigger>
          <TabsTrigger value="chatbot">Chatbot Model</TabsTrigger>
          <TabsTrigger value="access">Access & Roles</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-1"><h3 className="font-semibold text-sm">API Configuration</h3><p className="text-xs text-muted-foreground">Manage API endpoints and keys</p></div>
            <Separator />
            <div className="grid gap-4 max-w-md">
              <div><Label>API Base URL</Label><Input value={apiUrl} onChange={e => setApiUrl(e.target.value)} /></div>
              <div><Label>API Key</Label><Input value={apiKey} onChange={e => setApiKey(e.target.value)} type="password" /></div>
              <div className="flex items-center justify-between">
                <div><Label>Rate Limiting</Label><p className="text-xs text-muted-foreground">Enable request rate limiting</p></div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button size="sm"><Save className="h-4 w-4 mr-1.5" />Save Changes</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="chatbot">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-1"><h3 className="font-semibold text-sm">Chatbot Model Configuration</h3><p className="text-xs text-muted-foreground">Configure AI model parameters</p></div>
            <Separator />
            <div className="grid gap-4 max-w-md">
              <div>
                <Label>Model</Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                    <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Temperature</Label><Input type="number" step="0.1" min="0" max="2" value={temperature} onChange={e => setTemperature(e.target.value)} /></div>
              <div><Label>Max Tokens</Label><Input type="number" defaultValue="4096" /></div>
              <div className="flex items-center justify-between">
                <div><Label>Stream Responses</Label><p className="text-xs text-muted-foreground">Enable streaming for chat responses</p></div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button size="sm"><Save className="h-4 w-4 mr-1.5" />Save Changes</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="access">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-1"><h3 className="font-semibold text-sm">Access & Admin Roles</h3><p className="text-xs text-muted-foreground">Manage admin permissions</p></div>
            <Separator />
            <div className="grid gap-4 max-w-md">
              <div className="flex items-center justify-between">
                <div><Label>Maintenance Mode</Label><p className="text-xs text-muted-foreground">Restrict access to admins only</p></div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Email Notifications</Label><p className="text-xs text-muted-foreground">Receive admin alerts via email</p></div>
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Two-Factor Auth</Label><p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p></div>
                <Switch defaultChecked />
              </div>
            </div>
            <Button size="sm"><Save className="h-4 w-4 mr-1.5" />Save Changes</Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="theme">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div className="space-y-1"><h3 className="font-semibold text-sm">Theme Settings</h3><p className="text-xs text-muted-foreground">Customize dashboard appearance</p></div>
            <Separator />
            <div className="grid gap-4 max-w-md">
              <div>
                <Label>Default Theme</Label>
                <Select defaultValue="dark">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2 mt-2">
                  {["bg-primary", "bg-accent", "bg-cyan", "bg-success", "bg-warning"].map(c => (
                    <button key={c} className={`h-8 w-8 rounded-full ${c} ring-2 ring-offset-2 ring-offset-background ring-transparent hover:ring-foreground transition-all`} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div><Label>Compact Mode</Label><p className="text-xs text-muted-foreground">Reduce spacing and padding</p></div>
                <Switch />
              </div>
            </div>
            <Button size="sm"><Save className="h-4 w-4 mr-1.5" />Save Changes</Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
