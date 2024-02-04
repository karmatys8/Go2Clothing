import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useTheme, useMediaQuery } from '@mui/material';

// ----------------------------------------------------------------------

export default function StickyGrid({ top, spacing, generalStyles, wideScreenStyles, children }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const mergedStyles = {
    ...generalStyles,
    ...(isDesktop && wideScreenStyles),
  };

  return (
    <Grid
      direction="row"
      container
      spacing={spacing}
      sx={{
        position: 'sticky',
        top: top * 8,
        mt: isDesktop ? top : 0,
        ...mergedStyles,
      }}
    >
      {children}
    </Grid>
  );
}

StickyGrid.propTypes = {
  top: PropTypes.number.isRequired,
  spacing: PropTypes.number,
  generalStyles: PropTypes.object,
  wideScreenStyles: PropTypes.object,
  children: PropTypes.node,
};
