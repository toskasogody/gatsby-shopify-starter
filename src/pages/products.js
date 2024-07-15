import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
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

  useEffect(() => {
    if (data && data.allSanityProduct && data.allSanityProduct.nodes) {
      setProducts(data.allSanityProduct.nodes);
    }
  }, [data]);

  useEffect(() => {
    if (process.env.GATSBY_SHOPIFY_STORE_DOMAIN && process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      const client = ShopifyBuy.buildClient({
        domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
        storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      });

      const ui = ShopifyBuy.UI.init(client);

      products.forEach((product) => {
        if (product.store.id) {
          const firstVariantId = product.store.variants[0].id;
          console.log(`Creating buy button for product ID: ${product.store.id} with variant ID: ${firstVariantId}`);
          ui.createComponent('product', {
            id: product.store.id,
            node: document.getElementById(`buy-button-${product.store.id}`),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              product: {
                buttonDestination: 'cart',
                layout: 'vertical',
                width: '240px',
                variantId: firstVariantId, // Ensure the first variant is used
                contents: {
                  img: false,
                  title: false,
                  price: false,
                  options: false, // Hide options (variant selection)
                },
                text: {
                  button: 'ADD TO CART',
                },
                styles: {
                  button: {
                    'background-color': '#000080', // Change to your desired background color
                    'font-family': 'Arial, sans-serif',
                    'font-size': '12px',
                    'padding-top': '10px',
                    'padding-bottom': '10px',
                    ':hover': {
                      'background-color': '#4D4DDF', // Change to your desired hover background color
                    },
                    ':focus': {
                      'background-color': '#8E8EF4', // Change to your desired focus background color
                    },
                  },
                },
              },
            },
          });
        }
      });
    } else {
      console.error('Shopify domain or storefront access token is not set.');
    }
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
            <Link to={`/product/${product.store.slug.current}`} className="product-title-link">
              <div className="product-image">
                <img src={product.store.previewImageUrl} className="img-fluid" alt={product.store.title} />
              </div>
              <div className="product-details mt-2">
                <h2 className="product-title">{product.store.title || 'No Title'}</h2>
                <p id={`price-${product.store.id}`} className="product-price">
                  {product.store.variants[0].store.price ? `$${product.store.variants[0].store.price}` : 'No Price'}
                </p>
              </div>
            </Link>
            <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
