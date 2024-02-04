import { Alert, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import StickyComponent from 'src/components/sticky-grid';

import { useCartContext } from './use-cart-context';

// ----------------------------------------------------------------------

export default function CartSummary() {
  const { totalPrice } = useCartContext();
  const freeShippingThreshold = 500;
  const shippingPrice = totalPrice >= freeShippingThreshold ? 0 : 100;

  return (
    <StickyComponent top={9} spacing={1.5} wideScreenStyles={{ p: 5 }}>
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Typography variant="subtitle1">Products cost</Typography>
        <Typography variant="subtitle1">{`$${totalPrice}`}</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Typography variant="subtitle1">Shipping</Typography>
        <Typography variant="subtitle1">{`$${shippingPrice}`}</Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
      >
        <Typography variant="h5">To pay</Typography>
        <Typography variant="h5">{`$${totalPrice + shippingPrice}`}</Typography>
      </Grid>

      <Grid item xs={12}>
        <Alert severity="info" sx={{ mt: 4 }}>
          {`Free shipping from $${freeShippingThreshold}`}
        </Alert>
      </Grid>
    </StickyComponent>
  );
}
