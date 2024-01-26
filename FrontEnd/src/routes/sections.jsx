import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { PrivateComponent } from './components';

export const AdminStatsPage = lazy(() => import('src/pages/admin-stats'));
export const UserPage = lazy(() => import('src/pages/user'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const SingleProductPage = lazy(() => import('src/pages/product-page'))

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <ProductsPage />, index: true },
        { path: 'product-page', element: <SingleProductPage /> },
        { path: 'user', element: <PrivateComponent component={<UserPage />} allowedRoles={['customer', 'admin']} /> },
        { path: 'stats', element: <PrivateComponent component={<AdminStatsPage />} allowedRoles={['admin']} />},
      ],
    },
    {
      path: 'register',
      element: <RegisterPage />
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
