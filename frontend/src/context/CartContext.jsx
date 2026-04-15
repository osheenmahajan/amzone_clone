import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Re-fetches the cart to verify standard item counts directly from the backend
  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart');
      const items = response.data.items || [];
      const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalCount);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
