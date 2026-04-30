import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { login, isAuthenticated, ready } = useAuth();
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f7ee 0%, #e8f2e6 40%, #ffffff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Subtle grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: "radial-gradient(circle, #4F7B4412 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        width: "100%", maxWidth: 460,
      }}>
        {/* Logo card */}
        <div style={{
          background: "white",
          borderRadius: "1.25rem",
          boxShadow: "0 24px 64px rgba(16,24,40,0.12), 0 4px 16px rgba(79,123,68,0.08)",
          overflow: "hidden",
        }}>
          {/* Green header with logo */}
          <div style={{
            background: "linear-gradient(135deg, #3d6235 0%, #4F7B44 60%, #5a8a4e 100%)",
            padding: "2.5rem 2rem 2rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

            {/* Logo */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80, height: 80,
              borderRadius: "1.25rem",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.25)",
              marginBottom: "1.25rem",
              overflow: "hidden",
            }}>
              <img
                src="/icons/rugan-logo.jpg"
                alt="RUGAN"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML = `<span style="font-size:1.75rem;font-weight:800;color:white;letter-spacing:-1px">R</span>`;
                }}
              />
            </div>

            <h1 style={{ color: "white", fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.25rem", letterSpacing: "-0.02em" }}>
              RUGAN
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8125rem", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
              Content Management System
            </p>
          </div>

          {/* Form */}
          <div style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#101828", margin: "0 0 0.25rem" }}>
                Sign in to your account
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#667085", margin: 0 }}>
                Admins and editors can create, draft, and publish articles.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#344054", marginBottom: "0.375rem" }}>
                  Email address
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@rugan.org"
                  autoComplete="email"
                  required
                  style={{ fontSize: "0.9375rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "#344054", marginBottom: "0.375rem" }}>
                  Password
                </label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  style={{ fontSize: "0.9375rem" }}
                />
              </div>

              <Button
                type="submit"
                variant="green"
                size="lg"
                disabled={submitting}
                className="w-full"
                style={{ marginTop: "0.5rem" }}
              >
                {submitting ? "Signing in…" : "Sign in"}
              </Button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "#9CA3AF" }}>
              Authorized personnel only. Access is logged.
            </p>
          </div>
        </div>

        {/* Footer link */}
        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8125rem", color: "#9CA3AF" }}>
          <a href="/" style={{ color: "#4F7B44", textDecoration: "none", fontWeight: 500 }}>
            ← Back to rugan.org
          </a>
        </p>
      </div>
    </div>
  );
}
