import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";

export const ProtectedRoute = () => {
  const { user, loading } = useSupabaseAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

