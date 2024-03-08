import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-errors';

// ----------------------------------------------------------------------

export default function ProductInfo({ productId }) {
  const [expanded, setExpanded] = useState(false);
  const [productDescription, setProductDescription] = useState();

  useEffect(() => {
    const fetchSizesData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/description/${productId}`);
        const data = await response.json();

        if (response.ok) {
          setProductDescription(data.ProductDescription);
        } else if (response.status === 404) {
          enqueueSnackbar(`Description for this product could not be found`, { variant: 'error' });
        } else if (response.status === 500) {
          enqueueSnackbar(`Failed to fetch product description due to a server error`, {
            variant: 'error',
          });
        } else handleUnexpectedError(data.error, 'while fetching product description');
      } catch (error) {
        handleNetworkError(error);
      }
    };

    fetchSizesData();
  }, [productId]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{productDescription}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography>Shipping and payment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our shipping and payment options ensure convenience and speed, with delivery typically
            ranging from 2 to 7 business days.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography>Product return</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our return policy offers a generous window of 30 days, allowing you to shop with
            confidence and return items if they do not meet your expectations.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

ProductInfo.propTypes = {
  productId: PropTypes.string.isRequired,
};
