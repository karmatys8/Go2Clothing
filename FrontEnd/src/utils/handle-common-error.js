import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

export function handleNetworkError(error) {
  console.error(`Network error: ${error.message}`);
  enqueueSnackbar(`Network error: ${error.message}`, { variant: 'error' });
}

export function handleUnexpectedError(error, whenOccurredInfo) {
  enqueueSnackbar(`Unexpected error occurred ${whenOccurredInfo}: ${error}`, {
    variant: 'error',
  });
}
