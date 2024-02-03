import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { Alert, Typography } from '@mui/material';

import CartItem from './cart-item';

// ----------------------------------------------------------------------

export default function CartItemsList({ products }) {
  return (
    <Stack spacing={2.5}>
      <Typography variant="h3">Cart</Typography>
      {products && products.map((item) => <CartItem product={item} key={item.id} />)}

      <Alert severity="info">
        Do not hesitate with the purchase; adding items to the cart does not mean their reservation.
      </Alert>
    </Stack>
  );
}

CartItemsList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};
