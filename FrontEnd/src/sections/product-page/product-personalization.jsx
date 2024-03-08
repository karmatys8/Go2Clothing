import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';

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
import PriceComponent from 'src/layouts/dashboard/common/price';

import StickyComponent from 'src/components/sticky-grid';

import { useSizeData } from './hooks/use-size-data';
import { useColorData } from './hooks/use-color-data';
import { useProductDetails } from './hooks/use-product-details';

// ----------------------------------------------------------------------

export default function ProductPersonalization({ productId, labelImage }) {
  const { cartData, setCartData } = useCartContext();
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSizes, setSelectedSizes] = useState('');
  const sizesData = useSizeData(productId);
  const colorData = useColorData(productId);
  const productDetails = useProductDetails(productId);

  const handleAddToCart = () => {
    const product = {
      id: productId,
      name: productDetails.name,
      color: selectedColor,
      size: selectedSizes,
      price: productDetails.price,
      salePrice: productDetails.salePrice,
      amount: 1,
      img: labelImage,
    };

    const areProductsEqual = (item, product_) =>
      item.id === product_.id && item.color === product_.color && item.size === product_.size;

    try {
      if (cartData.some((item) => areProductsEqual(item, product))) {
        setCartData((prev) =>
          prev.map((item) =>
            areProductsEqual(item, product)
              ? { ...item, amount: item.amount + product.amount }
              : item
          )
        );
      } else {
        setCartData((prev) => [...prev, product]);
      }

      enqueueSnackbar('Added to cart', { variant: 'success' });
    } catch (error) {
      console.error(`Network error: ${error.message}`);
      enqueueSnackbar(`Network error: ${error.message}`, { variant: 'error' });
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
          {sizesData.map((seize) => (
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
      <Grid xs={12}>
        <Typography variant="h4" component="h2" sx={{ mb: 0.5 }}>
          {productDetails.name}
        </Typography>
      </Grid>
      <Grid xs={12}>
        <Typography variant="h6" component="span" sx={{ mb: 3 }}>
          <PriceComponent saleProductPrice={productDetails.salePrice} productPrice={productDetails.price} />
        </Typography>
      </Grid>
      <Grid xs={12} sx={{ mb: 2.5 }} flex justifyContent="center">
        {renderColorPicker}
      </Grid>
      <Grid xs={12}>{renderSizePicker}</Grid>
      <Grid xs={12}>
        <Button
          component="label"
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          sx={{ py: 1.5, width: '100%' }}
          onClick={handleAddToCart}
          disabled={!(selectedColor && selectedSizes)}
        >
          Add to Cart
        </Button>
      </Grid>
    </StickyComponent>
  );
}

ProductPersonalization.propTypes = {
  productId: PropTypes.string.isRequired,
  labelImage: PropTypes.string,
};
