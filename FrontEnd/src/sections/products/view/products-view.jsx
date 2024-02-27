import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import handleNetworkError from 'src/utils/handle-network-error';

import ProductCard from 'src/components/product-card';

import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';

// ----------------------------------------------------------------------

export default function ProductsView() {
  const [openFilter, setOpenFilter] = useState(false);
  const [products, setProducts] = useState([]);
  const from = 0;
  const offset = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${from}/${offset}`);

        const data = await response.json();
        if (response.ok) {
          setProducts(data.recordset);
        } else if (response.status === 500) {
          enqueueSnackbar(`Failed to fetch products due to a server error`, { variant: 'error' });
        } else {
          enqueueSnackbar(`Unknown error: ${data.error}`, { variant: 'error' });
        }
      } catch (error) {
        handleNetworkError(error);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={3}>
            <Link to={`/product-page/${product.id}`} style={{ textDecoration: 'none' }}>
              <ProductCard product={product} />
            </Link>
          </Grid>
        ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}
