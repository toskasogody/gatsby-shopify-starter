import React from 'react';
import { CartProvider } from './src/context/CartContext';

// Wrap the root element with CartProvider
export const wrapRootElement = ({ element }) => (
  <CartProvider>{element}</CartProvider>
);

export const onRenderBody = ({ setHtmlAttributes }) => {
  setHtmlAttributes({ lang: `en` });
};
