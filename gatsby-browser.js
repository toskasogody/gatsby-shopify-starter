// gatsby-browser.js

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
// gatsby-browser.js
import { CartProvider } from './src/context/CartContext';  // Correct casing


// Wrap the root element with CartProvider
export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);
