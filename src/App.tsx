import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import LeadsView from "./pages/dashboard/LeadsView";
import PipelineView from "./pages/dashboard/PipelineView";
import AnalyticsView from "./pages/dashboard/AnalyticsView";
import TeamView from "./pages/dashboard/TeamView";
import SettingsView from "./pages/dashboard/SettingsView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="leads" element={<LeadsView />} />
            <Route path="pipeline" element={<PipelineView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="team" element={<TeamView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
