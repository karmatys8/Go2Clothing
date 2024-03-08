import { useState, useEffect } from 'react';

import { handleFetchError, handleFetchNetworkError } from '../util/handle-errors';

// ----------------------------------------------------------------------

export function useSizeData(productId) {
  const [sizesData, setSizesData] = useState([]);

  useEffect(() => {
    const fetchSizesData = async () => {
      const category = 'Size';

      try {
        const response = await fetch(`http://localhost:3000/products/size/${productId}`);
        const data = await response.json();

        if (response.ok) {
          setSizesData(data);
        } else handleFetchError(response, data, category);
      } catch (error) {
        handleFetchNetworkError(error, category);
      }
    };

    fetchSizesData();
  }, [productId]);

  return sizesData;
}
