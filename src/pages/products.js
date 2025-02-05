import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'gatsby';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/navbar';
import CustomSliderCart from '../components/CustomSliderCart';
import { TailSpin } from 'react-loader-spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './products.css';

const ProductsPage = () => {
  const { products, addToCart, toggleCart } = useContext(CartContext);
  const [notification, setNotification] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToCart = (product) => {
    const productToAdd = {
      id: product.id,
      title: product.title,
      variant: product.variants[0],
      quantity: 1,
    };
    console.log('Adding to cart:', productToAdd); // Log product being added
    addToCart(productToAdd);
    toggleCart();
    setNotification(`${product.title} has been added to the cart`);
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

  return (
    <>
      <Navbar />
      <CustomSliderCart />
      <div className="container products-container">
        <h1>Product List</h1>
        <div className="row">
          {products.map((product) => (
            <div key={product.id} className="col-md-3 mb-4">
              <Link to={`/product/${product.handle}`} className="product-title-link">
                <div className="product-image">
                  <img src={product.images[0].src} className="img-fluid" alt={product.title} />
                </div>
                <div className="product-details mt-2">
                  <h2 className="product-title">{product.title || 'No Title'}</h2>
                  <p className="product-price">
                    {product.variants[0].price.amount ? `$${product.variants[0].price.amount}` : 'No Price'}
                  </p>
                </div>
              </Link>
              <button className="button-add-to-cart" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
      <div className={`notification ${notification ? 'show' : ''}`}>
        {notification}
      </div>
    </>
  );
};

export default ProductsPage;
