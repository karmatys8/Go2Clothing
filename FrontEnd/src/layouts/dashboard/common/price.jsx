import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function PriceComponent({ saleProductPrice, productPrice }) {
  return (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {saleProductPrice && fCurrency(productPrice)}
      </Typography>
      &nbsp;
      {fCurrency(saleProductPrice || productPrice)}
    </Typography>
  );
}

PriceComponent.propTypes = {
  saleProductPrice: PropTypes.number,
  productPrice: PropTypes.number.isRequired,
};
