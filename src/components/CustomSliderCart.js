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
                  <h3>{item.title}</h3>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  <p>${item.variant.price}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSliderCart;
