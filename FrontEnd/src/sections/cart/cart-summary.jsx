import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Alert, Button, Typography } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-errors';

import { useCartContext } from 'src/contexts/use-cart-context';
import { useUserContext } from 'src/contexts/use-user-context';

import StickyComponent from 'src/components/sticky-grid';

// ----------------------------------------------------------------------

export default function CartSummary() {
  const { userData } = useUserContext();
  const { cartData } = useCartContext();

  const totalPrice = cartData.reduce(
    (acc, item) => acc + (item.salePrice || item.price) * item.amount,
    0
  );
  const [shippingPrice, setShippingPrice] = useState(0);
  const freeShippingThreshold = 500;

  useEffect(() => {
    setShippingPrice(!cartData.length || totalPrice >= freeShippingThreshold ? 0 : 100);
  }, [totalPrice, cartData]);

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:3000/customer/newOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          CustomerID: userData.userID,
          DeliveryDays: 2,
          Freight: shippingPrice,
          OrderDetails: cartData.map((item) => ({
            ProductID: item.id,
            Color: item.color,
            Size: item.size,
            Quantity: item.amount,
          })),
        }),
      });

      if (response.ok) {
        enqueueSnackbar('Order placed successfully', { variant: 'success' });
      } else if (response.status === 500) {
        enqueueSnackbar(`Failed to place the order due to a server error`, { variant: 'error' });
      } else {
        const data = await response.json();
        handleUnexpectedError(data.error, 'while placing order');
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  return (
    <StickyComponent top={9} spacing={1.5} wideScreenStyles={{ p: 5 }}>
      <Grid xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1">Products cost</Typography>
        <Typography variant="subtitle1">{`$${parseFloat(totalPrice).toFixed(2)}`}</Typography>
      </Grid>
      <Grid xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1">Shipping</Typography>
        <Typography variant="subtitle1">{`$${shippingPrice}`}</Typography>
      </Grid>
      <Grid xs={12} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h5">To pay</Typography>
        <Typography variant="h5">
          {`$${parseFloat(totalPrice + shippingPrice).toFixed(2)}`}
        </Typography>
      </Grid>

      <Grid xs={12}>
        <Button
          size="large"
          variant="contained"
          startIcon={<ShoppingCartCheckoutIcon />}
          sx={{ py: 1.5, width: '100%', mt: 4 }}
          onClick={handleCheckout}
        >
          Go to Checkout
        </Button>
      </Grid>
      <Grid xs={12}>
        <Alert severity="info">{`Free shipping from $${freeShippingThreshold}`}</Alert>
      </Grid>
    </StickyComponent>
  );
}
