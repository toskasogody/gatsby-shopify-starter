import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, createCheckout } = useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * parseFloat(item.variant.price.amount), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    const checkoutUrl = await createCheckout();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      alert('Failed to create checkout. Please try again.');
    }
  };

  if (!cart.length) {
    return (
      <div className="spinner-container">
        <p className="loading-text">Your cart is empty</p>
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
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.variant.image.src} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2 className="cart-item-title">{item.title}</h2>
                  <div className="cart-item-controls">
                    <div className="cart-item-quantity">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="cart-item-remove">Remove</button>
                  </div>
                  <p className="cart-item-price">${item.variant.price.amount}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3 className="total">Total: ${calculateTotal()}</h3>
            {cart.length > 0 && (
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
