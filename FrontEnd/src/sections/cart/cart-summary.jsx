import { useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Alert, Button, Typography } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

import { useCartContext } from 'src/contexts/use-cart-context';
import { useUserContext } from 'src/contexts/use-user-context';

import StickyComponent from 'src/components/sticky-grid';

// ----------------------------------------------------------------------

export default function CartSummary() {
  const { userData } = useUserContext();
  const { cartData } = useCartContext();

  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingPrice, setShippingPrice] = useState(0);
  const freeShippingThreshold = 500;

  useEffect(() => {
    setShippingPrice(!cartData.length || totalPrice >= freeShippingThreshold ? 0 : 100);
  }, [totalPrice, cartData]);

  useEffect(() => {
    setTotalPrice(cartData.reduce((acc, item) => acc + item.price * item.amount, 0));
  }, [cartData]);

  const handleCheckout = async () => {
    try {
      // console.log("Products in the cart:", cartData);
      // console.log("UserID: ", userData.userID);
      //   console.log("Order details:", cartData.map((item) => ({
      //       ProductID: item.id,
      //       Color: item.color,
      //       Size: item.size,
      //       Quantity: item.amount,
      //   })));
      //   console.log("Shipping Price: ", shippingPrice);
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
        console.info('Checkout successful'); // can be changed
      }
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

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
      <Grid item xs={12}>
        <Alert severity="info">{`Free shipping from $${freeShippingThreshold}`}</Alert>
      </Grid>
    </StickyComponent>
  );
}
