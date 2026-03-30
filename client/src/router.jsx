import { createBrowserRouter } from 'react-router'

import RootLayout          from '@/components/layout/RootLayout'
import HomePage            from '@/pages/HomePage'
import AboutPage           from '@/pages/AboutPage'
import TeamPage            from '@/pages/TeamPage'
import ProgramsPage        from '@/pages/ProgramsPage'
import ProgramDetailPage   from '@/pages/programs/ProgramDetailPage'
import ImpactPage          from '@/pages/ImpactPage'
import VolunteerPage       from '@/pages/VolunteerPage'
import PartnershipPage     from '@/pages/PartnershipPage'
import BlogPage            from '@/pages/BlogPage'
import DonationPage        from '@/pages/DonationPage'

const router = createBrowserRouter([
  {
    path:      '/',
    element:   <RootLayout />,
    children:  [
      { index:  true,                      element: <HomePage /> },
      { path:   'about',                   element: <AboutPage /> },
      { path:   'team',                    element: <TeamPage /> },
      { path:   'programs',                element: <ProgramsPage /> },
      { path:   'programs/:slug',          element: <ProgramDetailPage /> },
      { path:   'impact',                  element: <ImpactPage /> },
      { path:   'volunteers',              element: <VolunteerPage /> },
      { path:   'partnership',             element: <PartnershipPage /> },
      { path:   'blog',                    element: <BlogPage /> },
      { path:   'donate',                  element: <DonationPage /> },
      { path:   '*',                       element: <div className="container-rugan section-padding text-center"><h1 className="text-display-md font-bold text-neutral-900">404 — Page Not Found</h1></div> },
    ],
  },
])

export default router
