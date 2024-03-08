import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import { PrivateComponent } from './components';

export const OrdersStatsPage = lazy(() => import('src/pages/orders-stats'));
export const RegisterPage = lazy(() => import('src/pages/register'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const SingleProductPage = lazy(() => import('src/pages/product-page'));
export const CartPage = lazy(() => import('src/pages/cart'));

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
        { path: 'product-page/:productId', element: <SingleProductPage /> },

        {
          path: 'cart',
          element: <PrivateComponent component={<CartPage />} allowedRoles={['customer', 'admin']} />,
        },
        {
          path: 'orders-stats',
          element: <PrivateComponent component={<OrdersStatsPage />} allowedRoles={['admin']} />,
        },
      ],
    },
    {
      path: 'register',
      element: <RegisterPage />,
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
