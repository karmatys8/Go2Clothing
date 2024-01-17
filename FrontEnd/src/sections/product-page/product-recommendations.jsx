import { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';

import { products } from 'src/_mock/products';

import ProductCard from 'src/sections/products/product-card';

export default function ProductRecommendations() {
  const matches = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [slicedProducts, setSlicedProducts] = useState([]);

  useEffect(() => {
    setSlicedProducts(chunkArray(products, matches ? 4 : 2));
  }, [matches]);

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
        {slicedProducts.map((productList, i) => (
          <Grid container spacing={2} key={i}>
            {productList.map((product, idx) => (
              <Grid item xs={6} md={3} key={idx}>
                <ProductCard product={product} key={product.id} />
              </Grid>
            ))}
          </Grid>
        ))}
      </Carousel>
    </Box>
  );
}

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
