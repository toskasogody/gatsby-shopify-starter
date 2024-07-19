import React, { createContext, useState, useEffect } from 'react';
import Client from 'shopify-buy';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState(null);
  const [products, setProducts] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const client = Client.buildClient({
    domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
    storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
 
  });

  useEffect(() => {
    const initializeCheckout = async () => {
      const storedCheckoutId = localStorage.getItem('checkoutId');
      if (storedCheckoutId) {
        try {
          const existingCheckout = await client.checkout.fetch(storedCheckoutId);
          if (!existingCheckout.completedAt) {
            setCheckout(existingCheckout);
            setCart(existingCheckout.lineItems);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch existing checkout:', error);
        }
      }

      try {
        const newCheckout = await client.checkout.create();
        setCheckout(newCheckout);
        localStorage.setItem('checkoutId', newCheckout.id);
      } catch (error) {
        console.error('Failed to create initial checkout:', error);
      }
    };

    const fetchAllProducts = async () => {
      try {
        const fetchedProducts = await client.product.fetchAll();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    initializeCheckout();
    fetchAllProducts();
  }, []);

  const addToCart = async (product) => {
    if (!checkout) {
      console.error('Checkout is not initialized');
      return;
    }

    if (!product.variant || !product.variant.id) {
      console.error('No variant available for this product');
      return;
    }

    const lineItemsToAdd = [
      {
        variantId: product.variant.id,
        quantity: product.quantity || 1,
      },
    ];

    try {
      const newCheckout = await client.checkout.addLineItems(checkout.id, lineItemsToAdd);
      setCheckout(newCheckout);
      setCart(newCheckout.lineItems); // Update cart state with line items
      setIsCartOpen(true); // Open the cart slider
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (lineItemId) => {
    if (!checkout) {
      console.error('Checkout is not initialized');
      return;
    }

    try {
      const newCheckout = await client.checkout.removeLineItems(checkout.id, [lineItemId]);
      setCheckout(newCheckout);
      setCart(newCheckout.lineItems); // Update cart state with line items
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (lineItemId, quantity) => {
    if (!checkout) {
      console.error('Checkout is not initialized');
      return;
    }

    const lineItemsToUpdate = [
      {
        id: lineItemId,
        quantity,
      },
    ];

    try {
      const newCheckout = await client.checkout.updateLineItems(checkout.id, lineItemsToUpdate);
      setCheckout(newCheckout);
      setCart(newCheckout.lineItems); // Update cart state with line items
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const createCheckout = async () => {
    if (!checkout) {
      console.error('Checkout is not initialized');
      return null;
    }
    return checkout.webUrl;
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <CartContext.Provider value={{ cart, products, addToCart, removeFromCart, updateQuantity, createCheckout, isCartOpen, toggleCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
