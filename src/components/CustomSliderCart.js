import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import './CustomSliderCart.css';

const CustomSliderCart = () => {
  const { cart, removeFromCart, updateQuantity, createCheckout, isCartOpen, toggleCart } = useContext(CartContext);

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

  return (
    <div className={`slider-cart ${isCartOpen ? 'open' : ''}`}>
      <button className="cart-toggle-button" onClick={toggleCart}>
        <FontAwesomeIcon icon={isCartOpen ? faTimes : faShoppingCart} />
      </button>
      {isCartOpen && (
        <div className="cart-content">
          <h2>Your Cart</h2>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.variant.image.src} alt={item.title} />
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-info">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <p className="item-price">${item.variant.price.amount}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-button">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3>Total: ${calculateTotal()}</h3>
            <button className="checkout-button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSliderCart;
