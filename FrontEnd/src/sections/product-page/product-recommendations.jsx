import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import { enqueueSnackbar } from 'notistack';
import 'react-multi-carousel/lib/styles.css';

import Box from '@mui/material/Box';
import { useTheme, Typography } from '@mui/material';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-errors';

import ProductCard from 'src/components/product-card';

// ----------------------------------------------------------------------

const getResponsiveObject = (theme) => ({
  desktop: {
    breakpoint: { max: Infinity, min: theme.breakpoints.values.md },
    items: 4,
    slidesToSlide: 4,
  },
  tablet: {
    breakpoint: { max: theme.breakpoints.values.md, min: theme.breakpoints.values.sm },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: theme.breakpoints.values.sm, min: 0 },
    items: 1,
  },
});

export default function ProductRecommendations({ productId }) {
  const theme = useTheme();
  const responsive = getResponsiveObject(theme);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/recommendations/${productId}`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data.recordset);
        } else if (response.status === 500) {
          enqueueSnackbar(`Failed to fetch product recommendations due to a server error`, {
            variant: 'error',
          });
        } else handleUnexpectedError(data.error, 'while fetching product recommendations');
      } catch (error) {
        handleNetworkError(error);
      }
    };

    fetchProducts();
  }, [productId]);

  return (
    <Box>
      <Typography variant="h4" sx={{ pb: 2 }}>
        More from this category:
      </Typography>
      <Carousel responsive={responsive}>
        {products.map((product) => (
          <div style={{ marginInline: 12 }} key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </Carousel>
    </Box>
  );
}

ProductRecommendations.propTypes = {
  productId: PropTypes.string.isRequired,
};
