import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Button } from '@mui/material';
import { GridAddIcon, GridRowModes, GridToolbarContainer } from '@mui/x-data-grid';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-errors';

// ----------------------------------------------------------------------

export default function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;
  const [nextIndex, setNextIndex] = useState(null);

  useEffect(() => {
    const fetchNextIndex = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin/nextProductId`);
        const data = await response.json();

        if (response.ok) {
          setNextIndex(data.nextId);
        } else handleUnexpectedError(data.error, 'while fetching next product id');
      } catch (error) {
        handleNetworkError(error);
      }
    };

    fetchNextIndex();
  }, []);

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
