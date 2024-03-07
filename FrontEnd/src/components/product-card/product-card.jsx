import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import PriceComponent from 'src/layouts/dashboard/common/price';

import Label from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const renderStatus = (
    <Label
      variant="filled"
      color={(product.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.status}
    </Label>
  );

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

  return (
    <Link to={`/product-page/${product.id}`} style={{ textDecoration: 'none' }}>
      <Card>
        <Box sx={{ pt: '100%', position: 'relative' }}>
          {product.status && renderStatus}

          {renderImg}
        </Box>

        <Stack spacing={2} sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <ColorPreview colors={product.colors} />
            <PriceComponent saleProductPrice={product.priceSale} productPrice={product.price} />
          </Stack>
        </Stack>
      </Card>
    </Link>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    cover: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    priceSale: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.string,
  }),
};
