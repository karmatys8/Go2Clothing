import { useState } from 'react';
import { useParams } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import ProductInfo from '../product-info';
import ProductImageViewer from '../product-image-viewer';
import ProductPersonalization from '../product-personalization';
import ProductRecommendations from '../product-recommendations';

// ----------------------------------------------------------------------

export default function SingleProductView() {
  const { productId } = useParams();
  const [productImages, setProductImages] = useState([]);

  return (
    <Container>
      <Grid container sx={{ mb: 15 }}>
        <Grid xs={12} md={8}>
          <ProductImageViewer
            productId={productId}
            productImages={productImages}
            setProductImages={setProductImages}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <ProductPersonalization productId={productId} labelImage={productImages[0]?.src} />
        </Grid>
        <Grid xs={12} md={8}>
          <ProductInfo productId={productId} />
        </Grid>
      </Grid>

      <ProductRecommendations productId={productId} />
    </Container>
  );
}
