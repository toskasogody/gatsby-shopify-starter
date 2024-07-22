import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/navbar';
import { TailSpin } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './cart.css';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, createCheckout } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cart !== undefined) {
      setLoading(false);
    }
  }, [cart]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * parseFloat(item.variant.price.amount), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!cart.length) {
      alert('Your cart is empty. Add products to proceed.');
      return;
    }
    setIsLoading(true);
    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        alert('Failed to create checkout. Please try again.');
      }
    } catch (error) {
      alert('Error during checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="spinner-container">
          <TailSpin height="50" width="50" color="blue" ariaLabel="loading" />
        </div>
      </>
    );
  }

  if (!cart.length) {
    return (
      <>
        <Navbar />
        <div className="spinner-container">
          <p className="loading-text">Your cart is empty</p>
          <Link to="/products">Back to Products</Link>
        </div>
      </>
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
            <button onClick={handleCheckout} className="checkout-button" disabled={isLoading}>
              {isLoading ? <TailSpin height="20" width="20" color="white" ariaLabel="loading" /> : 'Checkout'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
