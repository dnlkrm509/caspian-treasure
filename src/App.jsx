import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import RootLayout from './pages/Root.jsx';
import LoadingSpinner from './components/UI/LoadingSpinner/LoadingSpinner.jsx';

const HomePage = lazy(() => import('./pages/Home.jsx'));
const AboutPage = lazy(() => import('./pages/About.jsx'));
const ContactPage = lazy(() => import('./pages/Contact.jsx'));
const DetailPage = lazy(() => import('./pages/Detail.jsx'));
const ProductsPage = lazy(() => import('./pages/Products.jsx'));
const CheckoutPage = lazy(() => import('./pages/Checkout.jsx'));
const ErrorPage = lazy(() => import('./pages/Error.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: (
      <Suspense fallback={<LoadingSpinner />}>
        <ErrorPage />
      </Suspense>
    ),
    children: [
      { index: true , element: (
        <Suspense fallback={<LoadingSpinner />}>
          <HomePage />
        </Suspense>
      ) },
      { path: '/about', element: (
        <Suspense fallback={<LoadingSpinner />}>
          <AboutPage />
        </Suspense>
      ) },
      { path: '/contact', element: (
        <Suspense fallback={<LoadingSpinner />}>
          <ContactPage />
        </Suspense>
      ) },
      { path: '/checkout', element: (
        <Suspense fallback={<LoadingSpinner />}>
          <CheckoutPage />
        </Suspense>
      ) },
      { path: '/products',
        id: 'products',
        loader: () => import('./pages/Products.jsx').then(module => module.loader()),
        children: [
          { index: true,
            element: (
            <Suspense fallback={<LoadingSpinner />}>
              <ProductsPage />
            </Suspense>
          ),
          },
          { path: ':productId',
            element: (
            <Suspense fallback={<LoadingSpinner />}>
              <DetailPage />
            </Suspense>
            ),
            loader: () => import('./components/Detail/Detail.jsx').then(module => module.loader())
          }
        ]
      }
    ]
  }
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;