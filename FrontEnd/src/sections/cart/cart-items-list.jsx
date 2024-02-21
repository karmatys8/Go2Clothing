import Stack from '@mui/material/Stack';
import { Alert, Typography } from '@mui/material';

import { useCartContext } from 'src/contexts/use-cart-context';

import CartItem from './cart-item';

// ----------------------------------------------------------------------

export default function CartItemsList() {
  const { cartData } = useCartContext();
  return (
    <Stack spacing={4} sx={{ mb: 8 }}>
      <Typography variant="h3" sx={{ mb: 5 }}>
        Cart
      </Typography>
      <Stack spacing={2.5}>
        {cartData && cartData.map((item) => <CartItem product={item} key={`${item.id}-${item.color}-${item.size}`} />)}
      </Stack>

      <Alert severity="info">
        Do not hesitate with the purchase; adding items to the cart does not mean their reservation.
      </Alert>
    </Stack>
  );
}
