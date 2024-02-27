import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export default function handleNetworkError(error) {
  console.error(`Network error: ${error.message}`);
  enqueueSnackbar(`Network error: ${error.message}`, { variant: 'error' });
}
