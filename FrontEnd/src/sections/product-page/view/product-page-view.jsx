import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import ProductInfo from '../product-info';
import ProductImages from '../product-image-viewer';

// ----------------------------------------------------------------------

export default function SingleProductView() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Product page
      </Typography>

      <Box>
        <ProductImages />
        <ProductInfo />
      </Box>
    </Container>
  );
}
