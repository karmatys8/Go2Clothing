import { useState, useEffect } from 'react';

import ImageList from '@mui/material/ImageList';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import useFade from 'src/hooks/use-fade';

export default function ProductImages() {
  const [itemImages] = useState(itemData);
  const [imageIndex, setImageIndex] = useState(0);
  const [isVisible, setIsVisible, fadeProps] = useFade();

  const handleImageChange = (id) => {
    setIsVisible(false);
    setImageIndex(id);
  };

  useEffect(() => {
    setIsVisible(true);
  }, [imageIndex, setIsVisible])

  return (
    <Grid container sx={{ mb: 5 }}>
      <Grid item xs={0} sm={2}>
        <ImageList sx={{ height: 450, m: 0 }} cols={1} gap={10} m={0}>
          {itemImages.map((item) => (
            <ImageListItem onClick={() => handleImageChange(item.id)} key={item.id}>
              <img
                srcSet={`${item.img}?w=80&h=100&fit=crop&auto=format&dpr=2 2x`}
                src={`${item.img}?w=80&h=100&fit=crop&auto=format`}
                alt={item.title}
                loading="lazy"
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Grid>
      <Grid item container alignContent="center" xs={12} sm={10} style={{ position: 'relative' }}>
        <IconButton
          onClick={() =>
            handleImageChange((imageIndex - 1 + itemImages.length) % itemImages.length)
          }
          style={{ position: 'absolute', top: '50%' }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        {isVisible && <img src={itemImages[imageIndex]?.img} alt="Product" height={450} {...fadeProps}/>}
        <IconButton
          onClick={() => handleImageChange((imageIndex + 1) % itemImages.length)}
          style={{ position: 'absolute', top: '50%', right: 0 }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

const itemData = [
  {
    id: 0,
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
];
