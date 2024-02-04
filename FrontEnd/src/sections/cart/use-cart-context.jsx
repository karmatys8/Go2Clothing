import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, useContext, createContext } from 'react';

import { products } from 'src/_mock/products';

// ----------------------------------------------------------------------

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartData, setCartData] = useState([{}]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setCartData(
      products.map((product) => ({
        ...product,
        amount: 1 + Math.floor(Math.random() * 10),
        inStock: 12 + Math.floor(Math.random() * 8),
      }))
    );
  }, []);

  useEffect(() => {
    setTotalPrice(cartData.reduce((acc, item) => acc + item.price * item.amount, 0));
  }, [cartData]);

  const updateItem = useMemo(
    () => (id, newAmount) => {
      setCartData((currData) =>
        currData.map((item) => (item.id === id ? { ...item, amount: newAmount } : item))
      );
    },
    [setCartData]
  );

  const contextValue = useMemo(
    () => ({
      cartData,
      setCartData,
      totalPrice,
      updateItem,
    }),
    [cartData, setCartData, totalPrice, updateItem]
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
