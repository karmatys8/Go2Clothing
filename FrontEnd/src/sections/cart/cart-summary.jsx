import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Alert, useTheme, Typography, useMediaQuery } from '@mui/material';

import { useCartContext } from './use-cart-context';

// ----------------------------------------------------------------------

export default function CartSummary() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const { totalPrice } = useCartContext();
  const freeShippingThreshold = 500;
  const shippingPrice = totalPrice >= freeShippingThreshold ? 0 : 100;

  return (
    <Grid
      direction="row"
      container
      spacing={1.5}
      sx={{
        position: 'sticky',
        top: 140,
        mt: isDesktop ? 17.5 : 0,
        p: isDesktop ? 5 : 0,
      }}
    >
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
    </Grid>
  );
}
