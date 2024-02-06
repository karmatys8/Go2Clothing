/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { UserContextProvider } from './contexts/use-user-context';
import { CartContextProvider } from './contexts/use-cart-context';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <UserContextProvider>
        <CartContextProvider>
          <Router />
        </CartContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  );
}
