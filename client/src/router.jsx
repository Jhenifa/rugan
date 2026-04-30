import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";

import RootLayout from "@/components/layout/RootLayout";

// ── Eagerly loaded (critical path) ───────────────────────
import HomePage from "@/pages/HomePage";

// ── Lazily loaded (only when the user navigates there) ───
const AboutPage           = lazy(() => import("@/pages/AboutPage"));
const TeamPage            = lazy(() => import("@/pages/TeamPage"));
const ProgramsPage        = lazy(() => import("@/pages/ProgramsPage"));
const ProgramDetailPage   = lazy(() => import("@/pages/programs/ProgramDetailPage"));
const ImpactPage          = lazy(() => import("@/pages/ImpactPage"));
const VolunteerPage       = lazy(() => import("@/pages/VolunteerPage"));
const PartnershipPage     = lazy(() => import("@/pages/PartnershipPage"));
const BlogPage            = lazy(() => import("@/pages/BlogPage"));
const ArticlePage         = lazy(() => import("@/pages/blog/ArticlePage"));
const DonationPage        = lazy(() => import("@/pages/DonationPage"));
const DonationSuccessPage = lazy(() => import("@/pages/DonationSuccessPage"));
const PrivacyPolicyPage   = lazy(() => import("@/pages/PrivacyPolicyPage"));
const TermsPage           = lazy(() => import("@/pages/TermsPage"));

// Admin CMS
const AdminLoginPage  = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminLayout     = lazy(() => import("@/components/layout/AdminLayout"));
const AdminPostsPage  = lazy(() => import("@/pages/admin/AdminPostsPage"));
const AdminUsersPage  = lazy(() => import("@/pages/admin/AdminUsersPage"));

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true,                   element: <HomePage /> },
      { path: "about",                 element: <Lazy><AboutPage /></Lazy> },
      { path: "team",                  element: <Lazy><TeamPage /></Lazy> },
      { path: "programmes",            element: <Lazy><ProgramsPage /></Lazy> },
      { path: "programmes/:slug",      element: <Lazy><ProgramDetailPage /></Lazy> },
      { path: "impact",                element: <Lazy><ImpactPage /></Lazy> },
      { path: "volunteers",            element: <Lazy><VolunteerPage /></Lazy> },
      { path: "partnership",           element: <Lazy><PartnershipPage /></Lazy> },
      { path: "blog",                  element: <Lazy><BlogPage /></Lazy> },
      { path: "blog/:slug",            element: <Lazy><ArticlePage /></Lazy> },
      { path: "donate",                element: <Lazy><DonationPage /></Lazy> },
      { path: "donation/success",      element: <Lazy><DonationSuccessPage /></Lazy> },
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

  // Admin CMS (outside public layout)
  {
    path: "/admin/login",
    element: <Lazy><AdminLoginPage /></Lazy>,
  },
  {
    path: "/admin",
    element: <Lazy><AdminLayout /></Lazy>,
    children: [
      { index: true,        element: <Lazy><AdminPostsPage /></Lazy> },
      { path: "posts",      element: <Lazy><AdminPostsPage /></Lazy> },
      { path: "users",      element: <Lazy><AdminUsersPage /></Lazy> },
    ],
  },
]);

export default router;
