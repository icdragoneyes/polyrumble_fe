import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/betting/HomePage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import LoginPage from '../pages/admin/LoginPage';

/**
 * Application router configuration
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400">Page not found</p>
        </div>
      </div>
    ),
  },
]);
