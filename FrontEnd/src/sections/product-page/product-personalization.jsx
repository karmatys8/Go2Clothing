import { useState } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { useCartContext } from 'src/contexts/use-cart-context';

import StickyComponent from 'src/components/sticky-grid';

// ----------------------------------------------------------------------

export default function ProductPersonalization() {
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSizes, setSelectedSizes] = useState('');
  const product = { id: 0, color: '#000000', size: '0o0', amount: 1 }; // fetch from backend

  const { cartData, setCartData } = useCartContext();

  const handleAddToCart = () => {
    const areProductsEqual = (item, product_) =>
      item.id === product_.id && item.color === product_.color && item.size === product_.size;

    if (cartData.some((item) => areProductsEqual(item, product))) {
      setCartData((currData) =>
        currData.map((item) =>
          areProductsEqual(item, product) ? { ...item, amount: item.amount + product.amount } : item
        )
      );
    } else {
      setCartData((currData) => [...currData, product]);
    }
  };

  const handleChangeColor = (event) => {
    setSelectedColor(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedColor === item,
    onChange: handleChangeColor,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const handleSeizeChange = (event) => {
    setSelectedSizes(event.target.value);
  };

  const renderColorPicker = (
    <>
      <Typography variant="subtitle2" component="h5">{`Color - ${selectedColor}`}</Typography>
      <Box sx={{ ml: -1 }}>
        {colorData.map((colorItem) => (
          <Radio
            {...controlProps(`${colorItem.colorName}`)}
            sx={{
              color: colorItem.colorHex,
              '&.Mui-checked': {
                color: colorItem.colorHex,
              },
            }}
            key={colorItem.id}
            title={colorItem.colorName}
          />
        ))}
      </Box>
    </>
  );

  const renderSizePicker = (
    <>
      <Typography variant="subtitle2" component="h5" sx={{ mb: 1 }}>
        View size guide
      </Typography>
      <FormControl sx={{ minWidth: 130, mb: 2 }}>
        <InputLabel id="seize-select-label">Select size</InputLabel>
        <Select
          labelId="seize-select-label"
          id="seize-select"
          value={selectedSizes}
          label="Select size"
          onChange={handleSeizeChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 300,
              },
            },
          }}
        >
          {seizesData.map((seize) => (
            <MenuItem value={seize} key={seize}>
              {seize}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <StickyComponent top={17.5} generalStyles={{ pb: 5 }} wideScreenStyles={{ pl: 10 }}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" sx={{ mb: 0.5 }}>
          Product Name
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="span" sx={{ mb: 3 }}>
          Price
        </Typography>
      </Grid>
      <Grid item xs={6} md={12} sx={{ mb: 2.5 }} flex justifyContent="center">
        {renderColorPicker}
      </Grid>
      <Grid item xs={6} md={12}>
        {renderSizePicker}
      </Grid>
      <Grid item xs={12}>
        <Button
          component="label"
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          sx={{ py: 1.5, width: '100%' }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </Grid>
    </StickyComponent>
  );
}

const colorData = [
  {
    id: 1,
    colorHex: '#FF6666',
    colorName: 'Light Red',
  },
  {
    id: 2,
    colorHex: '#66FF66',
    colorName: 'Light Green',
  },
  {
    id: 3,
    colorHex: '#6666FF',
    colorName: 'Light Blue',
  },
  {
    id: 4,
    colorHex: '#FFFF66',
    colorName: 'Light Yellow',
  },
  {
    id: 5,
    colorHex: '#FF66FF',
    colorName: 'Light Magenta',
  },
];

const seizesData = [
  'EU 36',
  'EU 37',
  'EU 38',
  'EU 39',
  'EU 40',
  'EU 41',
  'EU 42',
  'EU 37',
  'EU 38',
  'EU 39',
  'EU 40',
  'EU 41',
  'EU 42',
  'EU 37',
  'EU 38',
  'EU 39',
  'EU 40',
  'EU 41',
  'EU 42',
];
