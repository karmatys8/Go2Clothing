import { useState, useEffect } from "react";

import { handleFetchError, handleFetchNetworkError } from "../util/handle-errors";

// ----------------------------------------------------------------------

export function useProductDetails(productId) {
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: 0,
    salePrice: 0,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      const category = 'Details';

      try {
        const response = await fetch(`http://localhost:3000/products/details/${productId}`);
        const data = await response.json();

        if (response.ok) {
          setProductDetails({
            name: data.ProductName,
            price: data.ProductPrice,
            salePrice: data.SalePrice,
          });
        } else handleFetchError(response, data, category);
      } catch (error) {
        handleFetchNetworkError(error, category);
      }
    };

    fetchDetails();
  }, [productId]);

  return productDetails;
}