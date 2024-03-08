import { useState, useEffect } from "react";

import { handleFetchError, handleFetchNetworkError } from "../util/handle-errors";

// ----------------------------------------------------------------------

export function useColorData(productId) {
  const [colorData, setColorData] = useState([]);

  useEffect(() => {
    const fetchColorData = async () => {
      const category = 'Color';

      try {
        const response = await fetch(`http://localhost:3000/products/colors/${productId}`);
        const data = await response.json();
        
        if (response.ok) {
          setColorData(data);
        } else handleFetchError(response, data, category);
      } catch (error) {
        handleFetchNetworkError(error, category);
      }
    };

    fetchColorData();
  }, [productId]);

  return colorData;
}