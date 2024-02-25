import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useContext, createContext } from 'react';

// ----------------------------------------------------------------------

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartData, setCartData] = useState(() => JSON.parse(localStorage.getItem('cartData')) || []);

  useEffect(() => {
    localStorage.setItem('cartData', JSON.stringify(cartData));
  }, [cartData]);

  const contextValue = useMemo(
    () => ({
      cartData,
      setCartData,
    }),
    [cartData, setCartData]
  );
  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCartContext = () => useContext(CartContext);

CartContextProvider.propTypes = {
  children: PropTypes.node,
  cartData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cover: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    inStock: PropTypes.number.isRequired,
  }),
};
