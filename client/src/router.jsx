import { Navigate, createBrowserRouter } from "react-router";

import RootLayout from "@/components/layout/RootLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import TeamPage from "@/pages/TeamPage";
import ProgramsPage from "@/pages/ProgramsPage";
import ProgramDetailPage from "@/pages/programs/ProgramDetailPage";
import ImpactPage from "@/pages/ImpactPage";
import VolunteerPage from "@/pages/VolunteerPage";
import PartnershipPage from "@/pages/PartnershipPage";
import BlogPage from "@/pages/BlogPage";
import ArticlePage from "@/pages/blog/ArticlePage";
import DonationPage from "@/pages/DonationPage";
import DonationSuccessPage from "@/pages/DonationSuccessPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminPostsPage from "@/pages/admin/AdminPostsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/posts" replace /> },
      { path: "posts", element: <AdminPostsPage /> },
      {
        path: "users",
        element: (
          <ProtectedRoute requireAdmin>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "team", element: <TeamPage /> },
      { path: "programmes", element: <ProgramsPage /> },
      { path: "programmes/:slug", element: <ProgramDetailPage /> },
      { path: "impact", element: <ImpactPage /> },
      { path: "volunteers", element: <VolunteerPage /> },
      { path: "partnership", element: <PartnershipPage /> },
      { path: "blog", element: <BlogPage /> },
      { path: "blog/:slug", element: <ArticlePage /> },
      { path: "donate", element: <DonationPage /> },
      { path: "donation/success", element: <DonationSuccessPage /> },
      { path: "privacy", element: <PrivacyPolicyPage /> },
      { path: "terms", element: <TermsPage /> },
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
]);

export default router;
