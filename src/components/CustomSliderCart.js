import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CustomSliderCart.css';

const CustomSliderCart = () => {
  const { cart, updateQuantity, createCheckout, isCartOpen, toggleCart } = useContext(CartContext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * parseFloat(item.variant.price.amount), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (!cart.length) {
      alert('Your cart is empty. Add products to proceed.');
      return;
    }
    const checkoutUrl = await createCheckout();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      alert('Failed to create checkout. Please try again.');
    }
  };

  return (
    <div>
      <button className={`cart-toggle-button ${isCartOpen ? 'cart-open' : ''}`} onClick={toggleCart}>
        <FontAwesomeIcon icon={isCartOpen ? faTimes : faShoppingCart} />
      </button>
      <div className={`slider-cart ${isCartOpen ? 'open' : ''}`}>
        {isCartOpen && (
          <div className="cart-content">
            <div className="cart-header">
              <h2>Cart</h2>
            </div>
            {cart.length === 0 ? (
              <p className="empty-cart-message">Your cart is empty</p>
            ) : (
              <>
                <ul className="cart-items list-group list-group-flush">
                  {cart.map((item) => (
                    <li key={item.id} className="cart-item list-group-item d-flex align-items-center">
                      <img src={item.variant.image.src} alt={item.title} className="img-thumbnail" />
                      <div className="item-details ms-3">
                        <h3 className="item-title text-truncate">{item.title}</h3>
                        <div className="item-info d-flex align-items-center justify-content-between">
                          <div className="quantity-controls input-group">
                            <button className="btn btn-outline-secondary btn-quantity" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                            <span className="quantity-display input-group-text">{item.quantity}</span>
                            <button className="btn btn-outline-secondary btn-quantity" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <p className="item-price ms-3 mb-0">${item.variant.price.amount}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="cart-total mt-3 d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>
                  Checkout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSliderCart;
