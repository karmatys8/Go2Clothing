import { enqueueSnackbar } from 'notistack';

import { handleUnexpectedError } from 'src/utils/handle-common-errors';
// ----------------------------------------------------------------------

export function handleFetchError(response, data, category) {
  if (response.status === 404) {
    enqueueSnackbar(`${category} data does not exist for this product`, { variant: 'error' });
  } else if (response.status === 500) {
    enqueueSnackbar(`Failed to fetch ${category} data due to a server error`, {
      variant: 'error',
    });
  } else handleUnexpectedError(data.error, `while fetching ${category}`);
}

export function handleFetchNetworkError(error, category) {
  console.error(`Network error: ${error.message}`);
  enqueueSnackbar(`Failed to load resources for ${category}`, { variant: 'error' });
}
