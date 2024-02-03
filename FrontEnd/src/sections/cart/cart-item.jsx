import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { Select, Button, MenuItem, InputLabel, FormControl } from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function CartItem({ product }) {
  const [itemAmount] = useState(16);

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1" sx={{ pb: 2 }}>
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product.priceSale && fCurrency(product.priceSale)}
      </Typography>
      &nbsp;
      {fCurrency(product.price)}
    </Typography>
  );

  return (
    <Card>
      <Stack direction="row">
        <Box sx={{ pt: 25, position: 'relative', height: 1, aspectRatio: '1/1' }}>{renderImg}</Box>

        <Stack
          justifyContent="space-between"
          direction="row"
          overflow="hidden"
          spacing={2}
          sx={{ p: 3, width: 1 }}
        >
          <Stack justifyContent="space-between" overflow="hidden">
            <Box>
              <Link color="inherit" underline="hover" variant="subtitle1" noWrap>
                {product.name}
              </Link>
              <Typography>Color: picked color</Typography>
              <Typography>Size: picked size</Typography>
            </Box>

            <FormControl sx={{ width: 120 }}>
              <InputLabel id="amount-select-label">Amount</InputLabel>
              <Select labelId="amount-select-label" id="amount-select" label="Amount">
                {Array.from({ length: itemAmount }, (_, idx) => idx + 1).map((index) => (
                  <MenuItem value={index} key={index}>
                    {index}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack justifyContent="space-between" textAlign="right">
            <Button startIcon={<DeleteIcon />} color="error">
              Delete
            </Button>
            {renderPrice}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

CartItem.propTypes = {
  product: PropTypes.object,
};
