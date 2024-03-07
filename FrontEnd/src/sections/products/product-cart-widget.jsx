import { useState, useEffect } from 'react';

import { Link } from '@mui/material';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { useCartContext } from 'src/contexts/use-cart-context';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 999,
  right: 0,
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  alignItems: 'center',
  top: theme.spacing(16),
  height: theme.spacing(5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1.25),
  boxShadow: theme.customShadows.z20,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderTopLeftRadius: Number(theme.shape.borderRadius) * 2,
  borderBottomLeftRadius: Number(theme.shape.borderRadius) * 2,
  transition: theme.transitions.create('opacity'),
  '&:hover': { opacity: 0.72 },
}));

// ----------------------------------------------------------------------

export default function CartWidget() {
  const { cartData } = useCartContext();
  const [itemsAmount, setItemsAmount] = useState(0);

  useEffect(() => {
    setItemsAmount(cartData.reduce((acc, item) => acc + parseInt(item.amount, 10), 0));
  }, [cartData]);

  return (
    <StyledRoot>
      <Link component={RouterLink} href="/cart" sx={{ color: 'inherit' }}>
        <Badge showZero badgeContent={itemsAmount} color="error" max={99}>
          <Iconify icon="eva:shopping-cart-fill" width={24} height={24} />
        </Badge>
      </Link>
    </StyledRoot>
  );
}
