import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/dashboard/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// ── Lazy-loaded page chunks ──────────────────────────────────────────────────
// Each page becomes its own JS chunk, loaded only when the route is visited.
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const AIChatPanel       = lazy(() => import("./pages/AIChatPanel"));
const ChatLogs          = lazy(() => import("./pages/ChatLogs"));
const UsersManagement   = lazy(() => import("./pages/UsersManagement"));
const ResumeAnalytics   = lazy(() => import("./pages/ResumeAnalytics"));
const AdminProfile      = lazy(() => import("./pages/AdminProfile"));
const Login             = lazy(() => import("./pages/Login"));
const NotFound          = lazy(() => import("./pages/NotFound"));

// ── Inline skeleton shown while page chunks load ─────────────────────────────
function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 p-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-white/5" />
        <div className="h-4 w-72 rounded-md bg-white/5" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-white/5" />
    </div>
  );
}

// ── React Query client with sensible caching defaults ────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 min — reduces redundant network refetches
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Outer Suspense catches Login + layout shell loading */}
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    {/* Inner Suspense isolates individual page chunk loading */}
                    <Suspense fallback={<PageSkeleton />}>
                      <Routes>
                        <Route path="/"                  element={<DashboardOverview />} />
                        <Route path="/chat"              element={<AIChatPanel />} />
                        <Route path="/logs"              element={<ChatLogs />} />
                        <Route path="/users"             element={<UsersManagement />} />
                        <Route path="/resume-analytics"  element={<ResumeAnalytics />} />
                        <Route path="/profile"           element={<AdminProfile />} />
                        <Route path="*"                  element={<NotFound />} />
                      </Routes>
                    </Suspense>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
