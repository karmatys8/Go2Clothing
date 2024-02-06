import * as React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import { GridAddIcon, GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';

// ----------------------------------------------------------------------

export default function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;
  const [nextIndex, setNextIndex] = React.useState(6); // it should be passed from backend

  const handleClick = () => {
    const id = nextIndex;
    setNextIndex((idx) => idx + 1);

    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<GridAddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  setRows: PropTypes.func,
  setRowModesModel: PropTypes.func,
};
