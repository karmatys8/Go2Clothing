import * as React from 'react';

import { Container } from '@mui/material';
import { Edit, Cancel, Delete } from '@mui/icons-material';
import { DataGrid, GridRowModes, GridSaveAltIcon, GridActionsCellItem, GridRowEditStopReasons } from '@mui/x-data-grid';

import EditToolbar from '../edit-toolbar';

// ----------------------------------------------------------------------

const initialRows = [
  { id: 1, category: 'Clothing', name: 'T-Shirt', price: 20, discountedPrice: 15, colors: ["#f0fff0", "#af246a", "#bbbbbb"], sizes: ["12", "45", "67"], inStock: 45 },
  { id: 2, category: 'Electronics', name: 'Smartphone', price: 500, discountedPrice: 450, colors: ["#f0fff0", "#af246a", "#bbbbbb"], sizes: null, inStock: 30 },
  { id: 3, category: 'Footwear', name: 'Running Shoes', price: 80, discountedPrice: 70, colors: ["#f0fff0", "#af246a", "#bbbbbb"], sizes: ["12", "45", "67"], inStock: 30 },
  { id: 4, category: 'Home Decor', name: 'Cushion Cover', price: 15, discountedPrice: 12, colors: ["#f0fff0", "#af246a", "#bbbbbb"], sizes: ["12", "45", "67"], inStock: 40 },
  { id: 5, category: 'Books', name: 'Fantasy Novel', price: 25, discountedPrice: 20, colors: null, sizes: ["12", "45", "67"], inStock: 50 },
];

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
      width: 150,
      editable: true,
      type: 'string',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      editable: true,
      type: 'string',
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100,
      editable: true,
      type: 'number',
    },
    {
      field: 'discountedPrice',
      headerName: 'Discounted Price',
      width: 100,
      editable: true,
      type: 'number',
    },
    {
      field: 'colors',
      headerName: 'Colors',
      width: 290,
      editable: true,
      sortable: false,
      type: 'string',
    },
    {
      field: 'sizes',
      headerName: 'Sizes',
      width: 200,
      editable: true,
      sortable: false,
      type: 'string'
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
          toolbar: EditToolbar
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Container>
  );
}
