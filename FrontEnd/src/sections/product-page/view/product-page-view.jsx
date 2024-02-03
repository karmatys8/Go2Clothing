import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import ProductInfo from '../product-info';
import ProductImages from '../product-image-viewer';
import ProductPersonalization from '../product-personalization';
import ProductRecommendations from '../product-recommendations';

// ----------------------------------------------------------------------

export default function SingleProductView() {
  return (
    <Container>
      <Grid container sx={{ mb: 15 }}>
        <Grid item xs={12} md={8}>
          <ProductImages />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProductPersonalization />
        </Grid>
        <Grid item xs={12} md={8}>
          <ProductInfo />
        </Grid>
      </Grid>

      <ProductRecommendations />
    </Container>
  );
}
