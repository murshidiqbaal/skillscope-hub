import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/dashboard/AdminLayout";
import DashboardOverview from "./pages/DashboardOverview";
import SkillsManagement from "./pages/SkillsManagement";
import ResourcesManagement from "./pages/ResourcesManagement";
import ResumeAnalytics from "./pages/ResumeAnalytics";
import UsersManagement from "./pages/UsersManagement";
import ChatbotKnowledge from "./pages/ChatbotKnowledge";
import SystemSettings from "./pages/SystemSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/skills" element={<SkillsManagement />} />
            <Route path="/resources" element={<ResourcesManagement />} />
            <Route path="/resume-analytics" element={<ResumeAnalytics />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/chatbot" element={<ChatbotKnowledge />} />
            <Route path="/settings" element={<SystemSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
