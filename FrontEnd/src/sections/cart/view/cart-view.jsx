import { Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import CartSummary from '../cart-summary';
import CartItemsList from '../cart-items-list';

// ----------------------------------------------------------------------

export default function CartView() {
  return (
    <Container sx={{ mb: 5 }}>
      <Grid container>
        <Grid xs={12} md={8}>
          <CartItemsList />
        </Grid>
        <Grid xs={12} md={4}>
          <CartSummary />
        </Grid>
      </Grid>
    </Container>
  );
}
