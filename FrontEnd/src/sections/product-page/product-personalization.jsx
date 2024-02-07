import {useState, useEffect} from 'react';
import {useParams} from "react-router-dom";

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

import StickyComponent from 'src/components/sticky-grid';

// ----------------------------------------------------------------------

export default function ProductPersonalization() {
  const { productId } = useParams();
  const [selectedColor, setSelectedColor] = useState('Light Red');
  const [selectedSizes, setSelectedSizes] = useState('');
  const [seizesData, setSeizesData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0.0); // double


      useEffect(() => {
    const fetchSizesData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/size/${productId}`);
        const data = await response.json();
        setSeizesData(data);
      } catch (error) {
        console.error('Error while fetching sizes:', error);
      }
    };

    fetchSizesData();
  }, [productId]);

    useEffect(() => {
        const fetchColorData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/colors/${productId}`);
                const data = await response.json();
                setColorData(data);
            } catch (error) {
                console.error('Error while fetching colors:', error);
            }
        };

        fetchColorData();
    }, [productId]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/details/${productId}`);
                const data = await response.json();
                setProductName(data.ProductName);
                setProductPrice(data.ProductPrice);
            } catch (error) {
                console.error('Error while fetching details:', error);
            }
        };
        fetchDetails();
    }, [productId, productName, productPrice]);


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
        <Typography variant="h4" component="h2" sx={{ mb: 0.5 }}>
            {productName}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" component="span" sx={{ mb: 3 }}>
            {productPrice}$
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
    </StickyComponent>
  );
}

