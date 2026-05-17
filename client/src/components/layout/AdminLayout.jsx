import { useEffect, useMemo, useRef, useState } from "react";
import {
  BarChart2,
  FileText,
  Globe,
  LogOut,
  Mail,
  Menu,
  Shield,
  UserPlus,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";

import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/context/AuthContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

const navLinkBase =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileViewport = useMediaQuery("(max-width: 1023px)");
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const navItems = useMemo(() => {
    const items = [{ to: "/admin/posts", label: "Posts", icon: FileText }];

    if (user?.role === "admin") {
      items.push(
        { to: "/admin/broadcasts", label: "Broadcasts", icon: Mail },
        { to: "/admin/users", label: "Users", icon: UserPlus },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart2 },
      );
    }

    return items;
  }, [user?.role]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setMobileHeaderHidden(false);
    lastScrollYRef.current = 0;
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isMobileViewport || mobileMenuOpen) {
      setMobileHeaderHidden(false);
      lastScrollYRef.current = typeof window === "undefined" ? 0 : window.scrollY;
      return undefined;
    }

    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    function updateHeaderVisibility(nextScrollY) {
      const previousScrollY = lastScrollYRef.current;
      const delta = nextScrollY - previousScrollY;

      if (nextScrollY <= 16) {
        setMobileHeaderHidden(false);
      } else if (delta > 8) {
        setMobileHeaderHidden(true);
      } else if (delta < -8) {
        setMobileHeaderHidden(false);
      }

      lastScrollYRef.current = nextScrollY;
      ticking = false;
    }

    function handleScroll() {
      const nextScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => updateHeaderVisibility(nextScrollY));
        ticking = true;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileViewport, mobileMenuOpen]);

  function handleSignOut() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  function renderNavLink(item, mobile = false) {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          cn(
            navLinkBase,
            mobile
              ? isActive
                ? "bg-white text-[#4F7B44] shadow-sm"
                : "text-white hover:bg-white/10"
              : isActive
                ? "bg-white/20 text-white shadow-sm lg:px-2.5 lg:py-1.5"
                : "text-white/70 hover:bg-white/10 hover:text-white lg:px-2.5 lg:py-1.5",
          )
        }
      >
        <Icon size={16} />
        {item.label}
      </NavLink>
    );
  }

  return (
    <>
      <ConfirmDialog
        open={showSignOutConfirm}
        title="Sign out?"
        description="Your current admin session will end on this device."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        tone="neutral"
        onCancel={() => setShowSignOutConfirm(false)}
        onConfirm={handleSignOut}
      />

      <div className="min-h-screen bg-[#F7F8F6]">
        <div className="h-[72px] sm:h-[80px] lg:hidden" aria-hidden="true" />

        <header
          className={cn(
            "fixed inset-x-0 top-0 z-30 border-b border-[#3D6235] bg-[#4F7B44] shadow-sm transition-transform duration-300 lg:hidden",
            mobileHeaderHidden ? "-translate-y-full" : "translate-y-0",
          )}
        >
          <div className="mx-auto w-full max-w-[1320px] px-4 py-4 sm:py-5 lg:px-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/icons/square-rugan-logo.jpg"
                    alt="RUGAN"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(event) => {
                      event.target.style.display = "none";
                    }}
                  />
                </div>

                <div className="flex h-9 min-w-0 flex-col justify-between">
                  <p className="text-xs font-semibold uppercase leading-none tracking-[0.18em] text-white/80">
                    RUGAN
                  </p>
                  <h1 className="text-base font-bold leading-none text-white sm:text-lg">
                    Content Management System
                  </h1>
                </div>
              </div>

              <div className="hidden flex-wrap items-center gap-3 lg:flex">
                <div className="rounded-lg border border-[#3D6235] bg-[#3D6235]/50 px-3 py-2">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/70">
                    {user?.role}
                  </p>
                </div>

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
                >
                  <Globe size={16} />
                  View site
                </a>

                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-[#4F7B44] shadow-sm transition-colors hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10 lg:hidden"
                aria-label="Open CMS menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </header>

        <header className="hidden border-b border-[#3D6235] bg-[#4F7B44] lg:block">
          <div className="mx-auto w-full max-w-[1320px] px-4 py-4 sm:py-5 lg:px-8">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "0.5rem",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src="/icons/square-rugan-logo.jpg"
                    alt="RUGAN"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(event) => {
                      event.target.style.display = "none";
                    }}
                  />
                </div>

                <div className="flex h-9 min-w-0 flex-col justify-between">
                  <p className="text-xs font-semibold uppercase leading-none tracking-[0.18em] text-white/80">
                    RUGAN
                  </p>
                  <h1 className="text-base font-bold leading-none text-white sm:text-lg">
                    Content Management System
                  </h1>
                </div>
              </div>

              <div className="hidden flex-wrap items-center gap-4 lg:flex">
                <div className="rounded-lg border border-[#3D6235] bg-[#3D6235]/50 px-2.5 py-1.5">
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/70">
                    {user?.role}
                  </p>
                </div>

                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-2.5 py-1.5 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
                >
                  <Globe size={16} />
                  View site
                </a>

                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-sm font-medium text-[#4F7B44] shadow-sm transition-colors hover:bg-gray-100"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>

            <div className="mt-3 hidden items-center justify-between gap-3 lg:flex">
              <nav className="flex flex-wrap items-center gap-2">
                {navItems.map((item) => renderNavLink(item))}
              </nav>

              <span className="inline-flex items-center gap-2 px-0.5 py-1.5 text-sm text-white/80">
                <Shield size={16} color="#FFFFFF" fill="#FFFFFF" />
                Admin and editors can author and publish
              </span>
            </div>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-[#101828]/45 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
        )}

        <aside
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-full max-w-[340px] flex-col bg-[#4F7B44] px-4 py-4 shadow-2xl transition-transform duration-200 lg:hidden",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          )}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                RUGAN
              </p>
              <h2 className="truncate text-base font-bold text-white">CMS navigation</h2>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Close CMS menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-white/15 bg-[#3D6235]/50 p-4">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/70">
              {user?.role}
            </p>
          </div>

          <nav className="mt-5 flex flex-1 flex-col gap-2 overflow-y-auto pb-4">
            {navItems.map((item) => renderNavLink(item, true))}
          </nav>

          <div className="border-t border-white/15 pt-4">
            <span className="mb-4 inline-flex items-start gap-2 text-sm text-white/80">
              <Shield size={16} color="#FFFFFF" fill="#FFFFFF" className="mt-0.5 shrink-0" />
              <span>Admin and editors can author and publish</span>
            </span>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <Globe size={16} />
                Site
              </a>

              <button
                type="button"
                onClick={() => setShowSignOutConfirm(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-sm font-medium text-[#4F7B44] shadow-sm transition-colors hover:bg-gray-100"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="mx-auto w-full max-w-[1320px] px-4 py-5 sm:py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </>
  );
}
