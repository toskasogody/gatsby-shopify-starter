import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
import ShopifyBuy from '@shopify/buy-button-js';
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
                width: '100%', // Ensure the button spans the full width of the container
                variantId: firstVariantId, // Ensure the first variant is used
                contents: {
                  img: true,
                  title: true,
                  price: true,
                  options: false,
                },
                text: {
                  button: 'ADD TO CART',
                },
                styles: {
                  product: {
                    'text-align': 'center',
                    'font-family': 'Arial, sans-serif',
                  },
                  title: {
                    'font-size': '14px',
                    'color': '#333',
                    'font-weight': '300'
                  },
                  price: {
                    'font-size': '14px',
                    'color': '#666',
                  },
                  button: {
                    'background-color': '#000080', // Change to your desired background color
                    'font-family': 'Arial, sans-serif',
                    'font-size': '10px',
                    'padding-top': '10px',
                    'padding-bottom': '10px',
                    'width': '70%',
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
    <div className="container">
      <h1 className="h5 my-5 font-weight-light">Product List</h1>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-3 mb-4">
            <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder"></div>
            <Link to={`/product/${product.store.slug.current}`} className="text-decoration-none">
              <p className="text-center mt-2">View details</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
