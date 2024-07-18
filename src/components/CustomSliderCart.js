import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import './CustomSliderCart.css';

const CustomSliderCart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCart = () => {
    setIsOpen(!isOpen);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * item.variant.price, 0);
  };

  // Dummy function for checkout
  const handleCheckout = () => {
    alert('Implement your checkout logic here!');
  };

  return (
    <div className={`slider-cart ${isOpen ? 'open' : ''}`}>
      <button className="cart-toggle-button" onClick={handleToggleCart}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faShoppingCart} />
      </button>
      {isOpen && (
        <div className="cart-content">
          <h2>Your Cart</h2>
          <ul className="cart-items">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.variant.previewImageUrl} alt={item.title} />
                <div className="item-details">
                  <h3 className="item-title">{item.title}</h3>
                  <div className="item-info">
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <p className="item-price">${item.variant.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="remove-button">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
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
