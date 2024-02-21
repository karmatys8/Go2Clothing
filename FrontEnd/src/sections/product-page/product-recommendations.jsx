import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';

import ProductCard from 'src/components/product-card';

// ----------------------------------------------------------------------

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default function ProductRecommendations({ productId }) {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/recommendations/${productId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        setProducts(data.recordset);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [productId]);

  useEffect(() => {
    setGroupedProducts(chunkArray(products, isDesktop ? 4 : 2));
  }, [isDesktop, products]);

  return (
    <Box>
      <Typography variant="h4" sx={{ pb: 2 }}>
        More from this category:
      </Typography>
      <Carousel
        autoPlay={false}
        animation="slide"
        indicators={false}
        navButtonsAlwaysVisible
        cycleNavigation={false}
      >
        {groupedProducts.map((productList, i) => (
          <Grid container spacing={2} key={i}>
            {productList.map((product) => (
              <Grid xs={6} md={3} key={product.id}>
                <Link to={`/product-page/${product.id}`} style={{ textDecoration: 'none' }}>
                  <ProductCard product={product} key={product.id} />
                </Link>
              </Grid>
            ))}
          </Grid>
        ))}
      </Carousel>
    </Box>
  );
}

ProductRecommendations.propTypes = {
  productId: PropTypes.string.isRequired,
};
