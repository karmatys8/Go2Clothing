import { Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import CartSummary from '../cart-summary';
import CartItemsList from '../cart-items-list';
import { CartContextProvider } from '../use-cart-context';

// ----------------------------------------------------------------------

export default function CartView() {
  return (
    <CartContextProvider>
      <Container sx={{ mb: 5 }}>
        <Grid container sx={{ mt: 5 }}>
          <Grid item xs={12} md={8}>
            <CartItemsList />
          </Grid>
          <Grid xs={12} md={4} item>
            <CartSummary />
          </Grid>
        </Grid>
      </Container>
    </CartContextProvider>
  );
}
