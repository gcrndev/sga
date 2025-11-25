import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
