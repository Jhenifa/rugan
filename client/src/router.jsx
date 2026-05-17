import { createBrowserRouter, Navigate, useLocation, useParams } from "react-router";
import { lazy, Suspense } from "react";

import RootLayout from "@/components/layout/RootLayout";
import RouteErrorFallback from "@/components/RouteErrorFallback";
import { useAuth } from "@/context/AuthContext";

// ── Retry wrapper for lazy imports ──────────────────────────
// When a chunk fails to load (e.g. offline, deploy changed hashes),
// this retries the import up to `retries` times before giving up.
function lazyRetry(importFn, retries = 3, interval = 1500) {
  return lazy(() => {
    return new Promise((resolve, reject) => {
      let attempt = 0;

      function tryImport() {
        importFn()
          .then(resolve)
          .catch((error) => {
            attempt += 1;
            if (attempt < retries) {
              setTimeout(tryImport, interval);
            } else {
              reject(error);
            }
          });
      }

      tryImport();
    });
  });
}

// ── Eagerly loaded (critical path) ───────────────────────
import HomePage from "@/pages/HomePage";

// ── Lazily loaded with retry (only when the user navigates there) ───
const AboutPage           = lazyRetry(() => import("@/pages/AboutPage"));
const TeamPage            = lazyRetry(() => import("@/pages/TeamPage"));
const ProgramsPage        = lazyRetry(() => import("@/pages/ProgramsPage"));
const ProgramDetailPage   = lazyRetry(() => import("@/pages/programs/ProgramDetailPage"));
const ImpactPage          = lazyRetry(() => import("@/pages/ImpactPage"));
const VolunteerPage       = lazyRetry(() => import("@/pages/VolunteerPage"));
const PartnershipPage     = lazyRetry(() => import("@/pages/PartnershipPage"));
const BlogPage            = lazyRetry(() => import("@/pages/BlogPage"));
const ArticlePage         = lazyRetry(() => import("@/pages/blog/ArticlePage"));
const DonationPage        = lazyRetry(() => import("@/pages/DonationPage"));
const DonationSuccessPage = lazyRetry(() => import("@/pages/DonationSuccessPage"));
const PrivacyPolicyPage   = lazyRetry(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage           = lazyRetry(() => import("@/pages/TermsPage"));

// Admin CMS
const AdminLoginPage  = lazyRetry(() => import("@/pages/admin/AdminLoginPage"));
const AdminLayout     = lazyRetry(() => import("@/components/layout/AdminLayout"));
const AdminPostsPage  = lazyRetry(() => import("@/pages/admin/AdminPostsPage"));
const AdminUsersPage  = lazyRetry(() => import("@/pages/admin/AdminUsersPage"));
const AdminAnalyticsPage = lazyRetry(() => import("@/pages/admin/AdminAnalyticsPage"));
const BroadcastPage   = lazyRetry(() => import("@/pages/admin/BroadcastPage"));

// Minimal fallback shown during lazy chunk load (fast — just a white screen)
function PageLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: "3px solid #e5e7eb", borderTopColor: "#4F7B44", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function Lazy({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

function ProgrammesAliasRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/programmes/${slug}` : "/programmes"} replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true,                   element: <HomePage /> },
      { path: "about",                 element: <Lazy><AboutPage /></Lazy> },
      { path: "team",                  element: <Lazy><TeamPage /></Lazy> },
      { path: "programmes",            element: <Lazy><ProgramsPage /></Lazy> },
      { path: "programmes/:slug",      element: <Lazy><ProgramDetailPage /></Lazy> },
      { path: "programs",              element: <ProgrammesAliasRedirect /> },
      { path: "programs/:slug",        element: <ProgrammesAliasRedirect /> },
      { path: "impact",               element: <Lazy><ImpactPage /></Lazy> },
      { path: "volunteers",            element: <Lazy><VolunteerPage /></Lazy> },
      { path: "partnership",           element: <Lazy><PartnershipPage /></Lazy> },
      { path: "blog",                  element: <Lazy><BlogPage /></Lazy> },
      { path: "blog/:slug",            element: <Lazy><ArticlePage /></Lazy> },
      { path: "donate",                element: <Lazy><DonationPage /></Lazy> },
      { path: "donation/success",      element: <Lazy><DonationSuccessPage /></Lazy> },
      { path: "donate/success",        element: <Navigate to="/donation/success" replace /> },
      { path: "privacy",               element: <Lazy><PrivacyPolicyPage /></Lazy> },
      { path: "terms",                 element: <Lazy><TermsPage /></Lazy> },
      {
        path: "*",
        element: (
          <div className="container-rugan section-padding text-center">
            <h1 className="text-display-md font-bold text-neutral-900">
              404 — Page Not Found
            </h1>
          </div>
        ),
      },
    ],
  },

  // /login — top-level alias for the admin login page
  {
    path: "/login",
    element: <Lazy><AdminLoginPage /></Lazy>,
    errorElement: <RouteErrorFallback />,
  },

  // Admin CMS (outside public layout)
  {
    path: "/admin/login",
    element: <Lazy><AdminLoginPage /></Lazy>,
    errorElement: <RouteErrorFallback />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Lazy><AdminLayout /></Lazy>
      </ProtectedRoute>
    ),
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true,        element: <Navigate to="/admin/posts" replace /> },
      { path: "posts",      element: <Lazy><AdminPostsPage /></Lazy> },
      { path: "users",      element: <Lazy><AdminUsersPage /></Lazy> },
      { path: "analytics",  element: <Lazy><AdminAnalyticsPage /></Lazy> },
      { path: "broadcasts", element: <Lazy><BroadcastPage /></Lazy> },
    ],
  },
]);

export default router;
