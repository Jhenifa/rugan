import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (ready && isAuthenticated) {
    return <Navigate to="/admin/posts" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await login({ email, password });
      toast.success("Signed in.");
      navigate(location.state?.from?.pathname || "/admin/posts", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F7FBF6_0%,#FFFFFF_100%)] px-4 py-10">
      <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <section className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4F7B44]">
            RUGAN CMS
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-[#101828]">
            Manage blog publishing and newsletter delivery.
          </h1>
          <p className="mt-4 max-w-lg text-base text-[#667085]">
            Admins and editors can create drafts, publish articles, and keep subscribers updated from one place.
          </p>
        </section>

        <section className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_24px_60px_rgba(16,24,40,0.08)] sm:p-8">
          <h2 className="text-2xl font-bold text-[#101828]">Sign in</h2>
          <p className="mt-2 text-sm text-[#667085]">
            Use an admin or editor account.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <Button
              type="submit"
              variant="green"
              size="lg"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}
