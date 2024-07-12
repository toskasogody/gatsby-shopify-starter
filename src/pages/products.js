import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import ShopifyBuy from '@shopify/buy-button-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './products.css'; // Ensure you have a CSS file for additional styling

export const query = graphql`
  {
    allSanityProduct {
      nodes {
        _id
        store {
          title
          id
          priceRange {
            minVariantPrice
          }
          previewImageUrl
        }
      }
    }
  }
`;

const ProductsPage = ({ data }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (data && data.allSanityProduct && data.allSanityProduct.nodes) {
      setProducts(data.allSanityProduct.nodes);
    }
  }, [data]);

  useEffect(() => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const ui = ShopifyBuy.UI.init(client);
    products.forEach((product) => {
      ui.createComponent('product', {
        id: product.store.id,
        node: document.getElementById(`buy-button-${product.store.id}`),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          product: {
            buttonDestination: 'cart',
            layout: 'vertical',
            width: '240px',
            contents: {
              img: false,
              title: false,
              price: false,
            },
            text: {
              button: 'Add to Cart'
            },
          }
        },
      });
    });
  }, [products]);

  if (products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <div className="container products-container">
      <h1>Product List</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-3 mb-4">
            <div className="card product-card">
              <div className="card-body">
                <div className="product-image">
                  <img src={product.store.previewImageUrl} className="img-fluid" alt={product.store.title} />
                </div>
                <div className="product-details mt-2">
                  <h2 className="product-title">{product.store.title || 'No Title'}</h2>
                  <p className="product-price">{product.store.priceRange.minVariantPrice ? `$${product.store.priceRange.minVariantPrice}` : 'No Price'}</p>
                  <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
