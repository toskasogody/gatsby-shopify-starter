import React, { useState, useEffect } from 'react';
import ShopifyBuy from '@shopify/buy-button-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css'; // Ensure you have a CSS file for additional styling

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const cartId = localStorage.getItem('shopifyCartId');

    if (cartId) {
      client.checkout.fetch(cartId).then((checkout) => {
        setCart(checkout);
        setLoading(false);
      });
    } else {
      client.checkout.create().then((newCheckout) => {
        localStorage.setItem('shopifyCartId', newCheckout.id);
        setCart(newCheckout);
        setLoading(false);
      });
    }
  }, []);

  const updateQuantity = (lineItemId, quantity) => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const cartId = localStorage.getItem('shopifyCartId');
    client.checkout.updateLineItems(cartId, [{ id: lineItemId, quantity }]).then((checkout) => {
      setCart(checkout);
    });
  };

  const removeItem = (lineItemId) => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const cartId = localStorage.getItem('shopifyCartId');
    client.checkout.removeLineItems(cartId, [lineItemId]).then((checkout) => {
      setCart(checkout);
    });
  };

  if (loading) {
    return <p>Loading cart...</p>;
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>
      {cart.lineItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.lineItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                      min="1"
                    />
                  </td>
                  <td>${(item.variant.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeItem(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-total">
            <h3>Total: ${cart.totalPrice}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
