// src/pages/cart.js
import React, { useState, useEffect, useRef } from 'react';
import ShopifyBuy from '@shopify/buy-button-js';
import { RingLoader } from 'react-spinners';
import Navbar from '../components/navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const buyButtonRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const client = ShopifyBuy.buildClient({
        domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
        storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      });

      const ui = ShopifyBuy.UI.init(client);

      ui.createComponent('cart', {
        node: document.getElementById('buy-button-cart'),
        options: {
          cart: {
            startOpen: false,
            styles: {
              cart: {
                visibility: 'hidden',
              },
            },
            events: {
              updateQuantity: () => fetchCart(client),
              removeItem: () => fetchCart(client),
            },
          },
        },
      }).then((component) => {
        buyButtonRef.current = component;
        fetchCart(client);

        const intervalId = setInterval(() => {
          fetchCart(client);
        }, 5000);

        return () => clearInterval(intervalId);
      });

      ui.createComponent('product', {
        id: 'some-product-id',
        node: document.createElement('div'),
        options: {
          product: {
            events: {
              addVariantToCart: () => fetchCart(client),
            },
          },
        },
      });
    }
  }, []);

  const fetchCart = (client) => {
    if (buyButtonRef.current) {
      const cartId = buyButtonRef.current.model.id;
      client.checkout.fetch(cartId).then((checkout) => {
        setCart(checkout);
        buyButtonRef.current.model.attrs.lineItems = checkout.lineItems;
        buyButtonRef.current.view.render();
      });
    }
  };

  const handleRemove = (lineItemId) => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const cartId = buyButtonRef.current.model.id;
    client.checkout.removeLineItems(cartId, [lineItemId]).then((checkout) => {
      setCart(checkout);
      buyButtonRef.current.model.attrs.lineItems = checkout.lineItems;
      buyButtonRef.current.view.render();

      const event = new CustomEvent('removeItem', {
        detail: {
          cart: checkout,
        },
      });
      buyButtonRef.current.view.node.dispatchEvent(event);
    });
  };

  const handleQuantityChange = (lineItemId, quantity) => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const cartId = buyButtonRef.current.model.id;
    client.checkout.updateLineItems(cartId, [
      { id: lineItemId, quantity: parseInt(quantity, 10) },
    ]).then((checkout) => {
      setCart(checkout);
      buyButtonRef.current.model.attrs.lineItems = checkout.lineItems;
      buyButtonRef.current.view.render();

      const event = new CustomEvent('updateQuantity', {
        detail: {
          cart: checkout,
        },
      });
      buyButtonRef.current.view.node.dispatchEvent(event);
    });
  };

  const handleCheckout = () => {
    window.open(cart.webUrl);
  };

  if (!cart) {
    return (
      <div className="spinner-container">
        <RingLoader color="#000080" />
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container cart-container">
        <h1 className="cart-page-title">Your Shopping Cart</h1>
        <div>
          <ul className="cart-items">
            {cart.lineItems.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.variant.image.src} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2 className="cart-item-title">{item.title}</h2>
                  <div className="cart-item-controls">
                    <div className="cart-item-quantity">
                      <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="cart-item-remove">Remove</button>
                  </div>
                  <p className="cart-item-price">${item.variant.price.amount}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3 className="total">Total: ${cart.subtotalPrice.amount}</h3>
            {cart.lineItems.length > 0 && (
              <button onClick={handleCheckout} className="checkout-button">
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
