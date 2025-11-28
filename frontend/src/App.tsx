import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import CompleteInvite from "./pages/auth/CompleteInvite";
import FinalizeSignup from "./pages/auth/FinalizeSignup";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Clientes from "./pages/Clientes";
import Processos from "./pages/Processos";
import Agenda from "./pages/Agenda";
import Documentos from "./pages/Documentos";
import Financeiro from "./pages/Financeiro";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";
import PublicClientForm from "./pages/PublicClientForm";

const queryClient = new QueryClient();

const authPaths = new Set([
  "/login",
  "/registro",
  "/esqueci-senha",
  "/invite/confirm",
  "/concluir-cadastro",
]);

const AppRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    const isAuthPage = authPaths.has(location.pathname);
    const isPublicIntake = location.pathname.startsWith("/firm/");
    root.classList.toggle("dark", !(isAuthPage || isPublicIntake));
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/invite/confirm" element={<CompleteInvite />} />
      <Route path="/concluir-cadastro" element={<FinalizeSignup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leads"
        element={
          <ProtectedRoute>
            <Leads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/processos"
        element={
          <ProtectedRoute>
            <Processos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/agenda"
        element={
          <ProtectedRoute>
            <Agenda />
          </ProtectedRoute>
        }
      />
      <Route
        path="/documentos"
        element={
          <ProtectedRoute>
            <Documentos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/financeiro"
        element={
          <ProtectedRoute>
            <Financeiro />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Usuarios />
          </ProtectedRoute>
        }
      />
      <Route path="/firm/:slug/novo-cliente" element={<PublicClientForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
