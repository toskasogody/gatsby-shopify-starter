import React, { useState, useEffect, useRef } from 'react';
import ShopifyBuy from '@shopify/buy-button-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const buyButtonRef = useRef(null);

  useEffect(() => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const ui = ShopifyBuy.UI.init(client);

    // Create the cart component and store a reference to it
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

      // Poll for cart updates every 5 seconds
      const intervalId = setInterval(() => {
        fetchCart(client);
      }, 5000);

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    });

    // Create a hidden product component to initialize the slider cart
    ui.createComponent('product', {
      id: 'some-product-id', // Replace with an actual product ID
      node: document.createElement('div'), // Create a hidden node
      options: {
        product: {
          events: {
            addVariantToCart: () => fetchCart(client),
          },
        },
      },
    });
  }, []);

  const fetchCart = (client) => {
    const cartId = buyButtonRef.current.model.id;
    client.checkout.fetch(cartId).then((checkout) => {
      setCart(checkout);
      buyButtonRef.current.model.attrs.lineItems = checkout.lineItems;
      buyButtonRef.current.view.render();
    });
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

      // Trigger the removeItem event to synchronize the slider cart
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

      // Trigger the updateQuantity event to synchronize the slider cart
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container cart-container">
      <h1 className="cart-page-title">Your Shopping Cart</h1>
      {cart.lineItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
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
            <h3>Total: ${cart.subtotalPrice.amount}</h3> {/* Ensure this is a string or number */}
            <button onClick={handleCheckout} className="checkout-button">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
