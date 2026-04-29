import { Navigate, useLocation } from "react-router";

import { useAuth } from "@/context/AuthContext";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F7F8F6] px-4 py-16">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#4F7B44]">
          RUGAN CMS
        </p>
        <h1 className="mt-4 text-3xl font-bold text-[#101828]">
          Checking your session
        </h1>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { ready, user } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/admin/posts" replace />;
  }

  return children;
}
