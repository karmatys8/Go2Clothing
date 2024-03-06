import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Container } from '@mui/material';
import { Edit, Cancel, Delete } from '@mui/icons-material';
import {
  DataGrid,
  GridRowModes,
  GridSaveAltIcon,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';

import { handleNetworkError, handleUnexpectedError } from 'src/utils/handle-common-error';

import EditToolbar from '../edit-toolbar';

// ----------------------------------------------------------------------

export default function ProductsStatsPage() {
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = async (id) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    const product = rows.find((item) => item.id === id);
    try {
      const response = await fetch(`http://localhost:3000/admin/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          ProductName: product.name,
          CategoryName: product.category,
          UnitPrice: product.price,
          Discount: product.discount,
          UnitsInStock: product.inStock,
          Color: product.color,
          Size: product.size,
        },
      });

      if (response.ok) {
        enqueueSnackbar(`Successfully added product with id:${id}`, { variant: 'success' });
      } else if (response.status === 500) {
        enqueueSnackbar(`Failed to add product with id:${id} due to a server error`, {
          variant: 'error',
        });
      } else {
        const data = await response.json();
        handleUnexpectedError(data.error, 'while adding product');
      }
    } catch (error) {
      handleNetworkError(error);
    }
  };

  const handleDeleteClick = async (id) => async () => {
    setRows(rows.filter((row) => row.id !== id));

    try {
      const response = await fetch(`http://localhost:3000/admin/deleteProduct/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        enqueueSnackbar(`Delete of product with id:${id} successful`, { variant: 'success' });
      } else if (response.status === 500) {
        enqueueSnackbar(`Failed to delete product with id:${id} due to a server error`, {
          variant: 'error',
        });
      } else {
        const data = await response.json();
        handleUnexpectedError(data.error, 'while deleting product');
      }
    } catch (error) {
      handleNetworkError(error);
    }
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

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    try {
      const response = await fetch('http://localhost:3000/admin/updateProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRow),
      });

      if (response.ok) {
        enqueueSnackbar('Edited Successfully');
      } else if (response.status === 500) {
        enqueueSnackbar(`Failed to update product due to a server error`, { variant: 'error' });
      } else {
        const data = await response.json();
        handleUnexpectedError(data.error, 'while updating product');
      }
    } catch (error) {
      handleNetworkError(error);
    }

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
      field: 'discount',
      headerName: 'Discount',
      width: 90,
      editable: true,
      type: 'number',
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 150,
      sortable: false,
      type: 'string',
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 150,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/products');
        const data = await response.json();

        if (response.ok) {
          setRows(data);
        } else if (response.status === 500) {
          enqueueSnackbar(`Failed to fetch data`, { variant: 'error' });
        } else handleUnexpectedError(data.error, 'while fetching products');
      } catch (error) {
        handleNetworkError(error);
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
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 25, 100]}
      />
    </Container>
  );
}
