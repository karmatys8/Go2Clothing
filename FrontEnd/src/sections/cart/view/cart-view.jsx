import { Container } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { products } from 'src/_mock/products';

import CartItemsList from '../cart-items-list';

// ----------------------------------------------------------------------

export default function CartView() {
  return (
    <Container sx={{mb: 5}}>
      <Grid container sx={{mt: 5}}>
        <Grid item xs={12} md={8}>
          <CartItemsList products={products} />
        </Grid>
        <Grid xs={12} md={4} item />
      </Grid>
    </Container>
  );
}
