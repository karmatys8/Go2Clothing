import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import ImageList from '@mui/material/ImageList';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

import useFade from 'src/hooks/use-fade';

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

export default function ProductImageViewer({ productId }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible, fadeProps] = useFade();
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    const fetchProductImages = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/images/${productId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setProductImages(data);
      } catch (error) {
        console.error('Error fetching product images:', error);
      }
    };

    fetchProductImages();
  }, [productId]);
  const handleClickImage = (id) => {
    setIsVisible(false);
    setImageIndex(id);
  };

  useEffect(() => {
    setIsVisible(true);
  }, [imageIndex, setIsVisible]);

  const renderImageList = (
    <ImageList sx={{ height: 450, m: 0 }} cols={1} gap={10} m={0}>
      {productImages.map((product) => (
        <ImageListItem
          onClick={() => handleClickImage(product.id)}
          key={product.id}
          sx={{ '&::before': product.id === imageIndex ? pickedImageStyles : {} }}
        >
          <img
            srcSet={`${product.img}?w=80&h=100&fit=crop&auto=format&dpr=2 2x`}
            src={`${product.img}?w=80&h=100&fit=crop&auto=format`}
            alt={product.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );

  return (
    <Grid container sx={{ mb: 5 }}>
      <Grid item xs={0} sm={2}>
        {renderImageList}
      </Grid>
      <Grid item container alignContent="center" xs={12} sm={10} sx={{ position: 'relative' }}>
        <IconButton
          aria-label="Previous image"
          onClick={() =>
            handleClickImage((imageIndex - 1 + productImages.length) % productImages.length)
          }
          sx={{ ...iconButtonStyles, left: 10 }}
        >
          <NavigateBeforeIcon sx={{ color: 'white' }} />
        </IconButton>
        {isVisible && (
          <img src={productImages[imageIndex]?.img} alt="Product" height={450} {...fadeProps} />
        )}
        <IconButton
          aria-label="Next image"
          onClick={() => handleClickImage((imageIndex + 1) % productImages.length)}
          sx={{ ...iconButtonStyles, right: 10 }}
        >
          <NavigateNextIcon sx={{ color: 'white' }} />
        </IconButton>
      </Grid>
    </Grid>
  );
}

ProductImageViewer.propTypes = {
  productId: PropTypes.number.isRequired,
};
