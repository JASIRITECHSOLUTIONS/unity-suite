import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Finance from "./pages/Finance";
import Procurement from "./pages/Procurement";
import HRM from "./pages/HRM";
import Stores from "./pages/Stores";
import DashboardLayout from "./components/layout/DashboardLayout";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/admin/Users";
import AdminOrganization from "./pages/admin/Organization";
import AdminSystem from "./pages/admin/System";
import AdminAudit from "./pages/admin/Audit";
import AdminSecurity from "./pages/admin/Security";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/finance" element={<DashboardLayout><Finance /></DashboardLayout>} />
            <Route path="/procurement" element={<DashboardLayout><Procurement /></DashboardLayout>} />
            <Route path="/hrm" element={<DashboardLayout><HRM /></DashboardLayout>} />
            <Route path="/stores" element={<DashboardLayout><Stores /></DashboardLayout>} />
            <Route path="/admin/users" element={<DashboardLayout><AdminUsers /></DashboardLayout>} />
            <Route path="/admin/organization" element={<DashboardLayout><AdminOrganization /></DashboardLayout>} />
            <Route path="/admin/system" element={<DashboardLayout><AdminSystem /></DashboardLayout>} />
            <Route path="/admin/audit" element={<DashboardLayout><AdminAudit /></DashboardLayout>} />
            <Route path="/admin/security" element={<DashboardLayout><AdminSecurity /></DashboardLayout>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
