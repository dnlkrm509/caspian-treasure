import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import RootLayout from './pages/Root.jsx'
import HomePage from './pages/Home.jsx';
import AboutPage from './pages/About.jsx';
import ContactPage from './pages/Contact.jsx';
import DetailPage from './pages/Detail.jsx';
import ProductsPage from './pages/Products.jsx';
import ErrorPage from './pages/Error.jsx';
import CheckoutPage from './pages/Checkout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/' , element: <HomePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:id', element: <DetailPage /> }
    ]
  }
]);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;