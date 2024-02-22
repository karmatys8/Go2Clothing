import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, useTheme, TextField, FormControl, useMediaQuery } from '@mui/material';

import { useCartContext } from 'src/contexts/use-cart-context';
import PriceComponent from 'src/layouts/dashboard/common/price';

// ----------------------------------------------------------------------

export default function CartItem({ product }) {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));

  const { setCartData } = useCartContext();

  const handleUpdate = (event) => {
    setCartData((currData) =>
      currData.map((item) =>
        item.id === product.id && item.color === product.color && item.size === product.size
          ? { ...item, amount: event.target.value }
          : item
      )
    );
  };

  const handleDelete = () => {
    setCartData((currData) =>
      currData.filter(
        (item) =>
          !(item.id === product.id && item.color === product.color && item.size === product.size)
      )
    );
  };

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.img || 'https://storage.googleapis.com/wdai_images/Icons/noPhoto.jpg'}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderInput = (
    <FormControl sx={{ width: 75 }}>
      <TextField
        id={`amount-input-${product.id}-${product.color}-${product.size}`}
        label="Amount"
        type="number"
        size="small"
        value={product.amount}
        onChange={handleUpdate}
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: 0 }}
      />
    </FormControl>
  );

  return (
    <Card>
      <Stack direction={isTablet ? 'row' : 'column'} position="relative">
        <Stack direction="row" flexGrow={1}>
          <Box sx={{ pt: 20, position: 'relative', height: 1, aspectRatio: '1/1' }}>
            {renderImg}
          </Box>

          <Stack justifyContent="space-between" overflow="hidden" spacing={2} sx={{ p: 2 }}>
            <Box>
              <Link color="inherit" underline="hover" variant="subtitle1" noWrap>
                {product.name}
              </Link>
              <Typography variant="body2" noWrap>
                {`Color: ${product.color}`}
              </Typography>
              <Typography variant="body2" noWrap>
                {`Size: ${product.size}`}
              </Typography>
            </Box>

            {renderInput}
          </Stack>
        </Stack>

        <Stack
          direction={isTablet ? 'column' : 'row'}
          justifyContent="space-between"
          textAlign="right"
          sx={{ p: 2 }}
        >
          <Button startIcon={<DeleteIcon />} color="error" onClick={handleDelete} size="small">
            Delete
          </Button>
          <PriceComponent saleProductPrice={product.salePrice} productPrice={product.price} />
        </Stack>
      </Stack>
    </Card>
  );
}

CartItem.propTypes = {
  product: PropTypes.object,
};
