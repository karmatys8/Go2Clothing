/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { SnackbarProvider } from 'notistack';

import ThemeProvider from 'src/theme';
import Router from 'src/routes/sections';
import { UserContextProvider } from './contexts/use-user-context';
import { CartContextProvider } from './contexts/use-cart-context';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <SnackbarProvider>
        <UserContextProvider>
          <CartContextProvider>
            <Router />
          </CartContextProvider>
        </UserContextProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
