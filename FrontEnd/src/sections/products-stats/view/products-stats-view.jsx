import * as React from 'react';

import { Container } from '@mui/material';
import { Edit, Cancel, Delete } from '@mui/icons-material';
import {
  DataGrid,
  GridRowModes,
  GridSaveAltIcon,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import EditToolbar from '../edit-toolbar';

// ----------------------------------------------------------------------

export default function ProductsStatsPage() {
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      type: 'number',
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 200,
      editable: true,
      type: 'string',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
      type: 'string',
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 90,
      editable: true,
      type: 'number',
    },
    {
      field: 'discountedPrice',
      headerName: 'Discounted Price',
      width: 90,
      editable: true,
      type: 'number',
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 150,
      editable: true,
      sortable: false,
      type: 'string',
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 150,
      editable: true,
      sortable: false,
      type: 'string',
    },
    {
      field: 'inStock',
      headerName: 'In Stock',
      width: 90,
      editable: true,
      sortable: false,
      type: 'number',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<GridSaveAltIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Cancel />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/products');
        if (response.ok) {
          const data = await response.json();
          console.log(data[0]);
          setRows(data);
        }
      } catch (error) {
        console.log('e', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[10, 25, 100]}
      />
    </Container>
  );
}
