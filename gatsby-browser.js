import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { CartProvider } from './src/context/CartContext';

// Wrap the root element with CartProvider
export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);
