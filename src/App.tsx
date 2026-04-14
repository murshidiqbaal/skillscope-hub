import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/dashboard/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardOverview from "./pages/DashboardOverview";
import AIChatPanel from "./pages/AIChatPanel";
import ChatLogs from "./pages/ChatLogs";
import UsersManagement from "./pages/UsersManagement";
import ResumeAnalytics from "./pages/ResumeAnalytics";
import AdminProfile from "./pages/AdminProfile";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<DashboardOverview />} />
                    <Route path="/chat" element={<AIChatPanel />} />
                    <Route path="/logs" element={<ChatLogs />} />
                    <Route path="/users" element={<UsersManagement />} />
                    <Route path="/resume-analytics" element={<ResumeAnalytics />} />
                    <Route path="/profile" element={<AdminProfile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
