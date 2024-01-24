import { useState } from 'react';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

export default function ProductPersonalization() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [selectedColor, setSelectedColor] = useState('Light Red');
  const [selectedSizes, setSelectedSizes] = useState('');

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
    <Grid
      container
      columnSpacing={4}
      sx={{
        position: 'sticky',
        top: 140,
        mt: isDesktop ? 17.5 : 0,
        pl: isDesktop ? 10 : 0,
        pb: 5,
      }}
    >
      <Grid item xs={12}>
        <Typography variant="h6" component="h2" sx={{ mb: 0.5 }}>
          Product Name
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="subtitle1" sx={{ mb: 3 }}>
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
        >
          Add to Cart
        </Button>
      </Grid>
    </Grid>
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
