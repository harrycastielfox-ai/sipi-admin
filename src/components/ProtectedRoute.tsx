import { Navigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  if (!auth.isAuthed()) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}
