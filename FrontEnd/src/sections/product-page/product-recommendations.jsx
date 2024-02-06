import { useState, useEffect } from 'react';
import {Link, useParams} from "react-router-dom";
import Carousel from 'react-material-ui-carousel';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';

import ProductCard from 'src/components/product-card';

// ----------------------------------------------------------------------

export default function ProductRecommendations() {
    const { productId } = useParams();
    const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'));
    const [groupedProducts, setGroupedProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const offset = 0;
    const rowCount = 4;

    console.log(products);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/${offset}/${rowCount}/${productId}`);
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
    }, [productId, products]);

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
                {productList.map((product, idx) => (
                  <Grid item xs={6} md={3} key={idx}>
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

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
