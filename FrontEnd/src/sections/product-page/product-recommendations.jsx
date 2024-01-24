import { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';

import { products } from 'src/_mock/products';

import ProductCard from 'src/components/product-card';

export default function ProductRecommendations() {
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const [groupedProducts, setGroupedProducts] = useState([]);

  useEffect(() => {
    setGroupedProducts(chunkArray(products, isDesktop ? 4 : 2));
  }, [isDesktop]);

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
