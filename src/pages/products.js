import React, { useState, useEffect, useContext } from 'react';
import { graphql, Link } from 'gatsby';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/navbar';
import CustomSliderCart from '../components/CustomSliderCart'; // Import the slider cart component
import 'bootstrap/dist/css/bootstrap.min.css';
import './products.css';

export const query = graphql`
  {
    allSanityProduct {
      nodes {
        _id
        store {
          title
          id
          slug {
            current
          }
          previewImageUrl
          variants {
            id
            store {
              price
              title
              previewImageUrl
            }
          }
        }
      }
    }
  }
`;

const ProductsPage = ({ data }) => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (data && data.allSanityProduct && data.allSanityProduct.nodes) {
      setProducts(data.allSanityProduct.nodes);
    }
  }, [data]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAddToCart = (product) => {
    const defaultVariant = product.store.variants[0]; // Assuming first variant is default
    addToCart({
      id: defaultVariant.id,
      title: product.store.title,
      variant: {
        price: defaultVariant.store.price, // Include price from default variant
        previewImageUrl: defaultVariant.store.previewImageUrl // Include preview image URL from default variant
      }
    });
    setNotification(`${product.store.title} has been added to the cart`);
  };
  

  if (products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <>
      <Navbar />
      <CustomSliderCart />
      <div className="container products-container">
        <h1>Product List</h1>
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-3 mb-4">
              <Link to={`/product/${product.store.slug.current}`} className="product-title-link">
                <div className="product-image">
                  <img src={product.store.previewImageUrl} className="img-fluid" alt={product.store.title} />
                </div>
                <div className="product-details mt-2">
                  <h2 className="product-title">{product.store.title || 'No Title'}</h2>
                  <p className="product-price">
                    {product.store.variants[0].store.price ? `$${product.store.variants[0].store.price}` : 'No Price'}
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
