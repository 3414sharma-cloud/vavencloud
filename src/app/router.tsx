import { createBrowserRouter } from 'react-router'
import { SiteLayout } from '@/components/layout/SiteLayout.tsx'
import { legalPages } from '@/features/legal/legal.pages.ts'
import { ComparisonPage } from '@/pages/ComparisonPage.tsx'
import { HomePage } from '@/pages/HomePage.tsx'
import { LegalPage } from '@/pages/LegalPage.tsx'
import { NotFoundPage } from '@/pages/NotFoundPage.tsx'
import { TeamPage } from '@/pages/TeamPage.tsx'

/**
 * Every page of the site, at the same addresses as before (the trailing slashes are kept in links; a page
 * opens with or without one). All share the layout: top bar, header, footer.
 */
export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/team', element: <TeamPage /> },
      { path: '/comparison', element: <ComparisonPage /> },
      ...legalPages.map(({ path, page }) => ({ path, element: <LegalPage page={page} path={path} /> })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
