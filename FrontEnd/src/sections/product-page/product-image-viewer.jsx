import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import ImageList from '@mui/material/ImageList';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import { useResponsive } from 'src/hooks/use-responsive';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-errors';

// ----------------------------------------------------------------------

const iconButtonStyles = {
  position: 'absolute',
  top: '50%',
  backgroundColor: '#494949',
};

const pickedImageStyles = {
  content: '""',
  position: 'absolute',
  inset: 0,
  boxShadow: 'rgb(35, 31, 32) 0px -2px inset, white 0px -6px inset',
  background: 'rgba(0, 0, 0, 0.2)',
  zIndex: 20,
};

export default function ProductImageViewer({ productId, productImages, setProductImages }) {
  const [imageIndex, setImageIndex] = useState(0);

  const isSm = useResponsive('up', 'sm');
  const isMd = useResponsive('up', 'md');
  const [componentHeight, setComponentHeight] = useState(500);

  useEffect(() => {
    setComponentHeight(500 + (isSm + isMd) * 100); // different seizes on mobile, tablet and desktop
  }, [isSm, isMd]);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/images/${productId}`);
        const data = await response.json();

        if (response.ok) {
          setProductImages(data);
        } else if (response.status === 404) {
          enqueueSnackbar(`Images for this product could not be found`, { variant: 'error' });
        } else if (response.status === 500) {
          enqueueSnackbar(`Failed to fetch product images due to a server error`, {
            variant: 'error',
          });
        } else handleUnexpectedError(data.error, 'while fetching product images');
      } catch (error) {
        handleNetworkError(error);
      }
    };

    fetchProductImages();
  }, [productId, setProductImages]);

  const handlePrevImage = () => {
    setImageIndex((imageIndex - 1 + productImages.length) % productImages.length);
  };

  const handleNextImage = () => {
    setImageIndex((imageIndex + 1) % productImages.length);
  };

  const renderImageList = (
    <ImageList sx={{ height: componentHeight, m: 0, mr: 2 }} cols={1} gap={10}>
      {productImages.map((product) => (
        <ImageListItem
          onClick={() => setImageIndex(product.id)}
          key={product.id}
          sx={{ '&::before': product.id === imageIndex ? pickedImageStyles : {} }}
        >
          <img
            srcSet={`${product.src}?w=80&h=100&fit=crop&auto=format&dpr=2 2x`}
            src={`${product.src}?w=80&h=100&fit=crop&auto=format`}
            alt={product.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );

  return (
    <Grid container sx={{ mb: 5, justifyContent: 'center' }}>
      <Grid xs={0} md={3}>
        {renderImageList}
      </Grid>
      <Grid
        alignContent="center"
        xs={12}
        md={9}
        sx={{ position: 'relative', maxWidth: componentHeight }}
      >
        <IconButton
          aria-label="Previous image"
          onClick={handlePrevImage}
          sx={{ ...iconButtonStyles, left: 10 }}
        >
          <NavigateBeforeIcon sx={{ color: 'white' }} />
        </IconButton>

        <img
          src={productImages.find((img) => img.id === imageIndex)?.src}
          alt="Product"
          height={componentHeight}
          style={{ objectFit: 'cover' }}
        />

        <IconButton
          aria-label="Next image"
          onClick={handleNextImage}
          sx={{ ...iconButtonStyles, right: 10 }}
        >
          <NavigateNextIcon sx={{ color: 'white' }} />
        </IconButton>
      </Grid>
    </Grid>
  );
}

ProductImageViewer.propTypes = {
  productId: PropTypes.string.isRequired,
  productImages: PropTypes.arrayOf(PropTypes.object).isRequired,
  setProductImages: PropTypes.func.isRequired,
};
