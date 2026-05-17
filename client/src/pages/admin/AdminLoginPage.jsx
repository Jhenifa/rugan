import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

import SEO from "@/components/SEO";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f7ee 0%, #e8f2e6 40%, #ffffff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <SEO
        title="Admin Login"
        description="Secure administrator sign-in for RUGAN content and operations."
        path="/admin/login"
        noindex
        nofollow
        pageType="WebPage"
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          backgroundImage: "radial-gradient(circle, #4F7B4412 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "1.25rem",
            boxShadow: "0 24px 64px rgba(16,24,40,0.12), 0 4px 16px rgba(79,123,68,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #3d6235 0%, #4F7B44 60%, #5a8a4e 100%)",
              padding: "clamp(1.75rem, 5vw, 2.5rem) clamp(1.25rem, 5vw, 2rem) clamp(1.5rem, 4vw, 2rem)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
              }}
            />

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "clamp(68px, 18vw, 80px)",
                height: "clamp(68px, 18vw, 80px)",
                borderRadius: "1.25rem",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                marginBottom: "1.25rem",
                overflow: "hidden",
              }}
            >
              <img
                src="/icons/square-rugan-logo.jpg"
                alt="RUGAN"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(event) => {
                  event.target.style.display = "none";
                  event.target.parentNode.innerHTML =
                    '<span style="font-size:1.75rem;font-weight:800;color:white;letter-spacing:-1px">R</span>';
                }}
              />
            </div>

            <h1
              style={{
                color: "white",
                fontSize: "clamp(1.35rem, 4vw, 1.5rem)",
                fontWeight: 800,
                margin: "0 0 0.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              RUGAN
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "0.8125rem",
                margin: 0,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              Content Management System
            </p>
          </div>

          <div style={{ padding: "clamp(1.25rem, 5vw, 2rem)" }}>
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
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#344054",
                    marginBottom: "0.375rem",
                  }}
                >
                  Email address
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@rugan.org"
                  autoComplete="email"
                  required
                  style={{ fontSize: "0.9375rem" }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    color: "#344054",
                    marginBottom: "0.375rem",
                  }}
                >
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="********"
                    autoComplete="current-password"
                    required
                    style={{ fontSize: "0.9375rem", paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#9CA3AF",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="green"
                size="lg"
                disabled={submitting}
                className="w-full"
                style={{ marginTop: "0.5rem" }}
              >
                {submitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.8rem", color: "#9CA3AF" }}>
              Authorized personnel only. Access is logged.
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8125rem", color: "#9CA3AF" }}>
          <a href="/" style={{ color: "#4F7B44", textDecoration: "none", fontWeight: 500 }}>
            {"<- Back to rugan.org"}
          </a>
        </p>
      </div>
    </div>
  );
}
