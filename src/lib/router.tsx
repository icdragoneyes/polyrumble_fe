import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import ArenasPage from '../pages/betting/ArenasPage';
import ArenaDetailPage from '../pages/ArenaDetailPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import LoginPage from '../pages/admin/LoginPage';
import X402JsonPage from '../pages/X402JsonPage';

/**
 * Application router configuration
 *
 * Routes:
 * / - Landing page with hero and CTAs
 * /arenas - List of active betting pools/arenas
 * /arena/:id - Detailed arena view (trader comparison + betting interface)
 * /x402 - x402 protocol API discovery for AI agents
 * /admin/* - Admin dashboard for creating and managing arenas
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/arenas',
    element: <ArenasPage />,
  },
  {
    path: '/arena/:id',
    element: <ArenaDetailPage />,
  },
  {
    path: '/x402',
    element: <X402JsonPage />,
  },
  {
    path: '/admin',
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        index: true,
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 comic-font">404</h1>
          <p className="text-gray-600 dark:text-gray-400 text-xl mb-6">Page not found</p>
          <a
            href="/"
            className="comic-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 inline-block"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);
