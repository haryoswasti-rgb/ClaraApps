import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import NewRequestPage from "@/pages/NewRequestPage";
import MyRequestsPage from "@/pages/MyRequestsPage";
import AdminRequestsPage from "@/pages/AdminRequestsPage";
import VehiclesPage from "@/pages/VehiclesPage";
import AvailabilityPage from "@/pages/AvailabilityPage";
import ReportsPage from "@/pages/ReportsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {user.role === 'peminjam' && <Route path="/new-request" element={<NewRequestPage />} />}
        {user.role === 'peminjam' && <Route path="/my-requests" element={<MyRequestsPage />} />}
        {user.role === 'admin' && <Route path="/requests" element={<AdminRequestsPage />} />}
        {user.role === 'admin' && <Route path="/vehicles" element={<VehiclesPage />} />}
        {user.role === 'admin' && <Route path="/reports" element={<ReportsPage />} />}
        <Route path="/availability" element={<AvailabilityPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
