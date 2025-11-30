// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";           
import { useAuth } from "../context/AuthContext"; 

type Props = { children: ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const { isAuthed } = useAuth();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}