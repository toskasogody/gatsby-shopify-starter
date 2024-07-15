import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import ShopifyBuy from '@shopify/buy-button-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './product.css'; // Ensure you have a CSS file for styling

export const query = graphql`
  query($id: String!) {
    sanityProduct(id: { eq: $id }) {
      store {
        title
        id
        priceRange {
          minVariantPrice
        }
        previewImageUrl
        options {
          name
          values
        }
      
      }
    }
  }
`;

const ProductTemplate = ({ data }) => {
  const product = data.sanityProduct.store;

  useEffect(() => {
    if (process.env.GATSBY_SHOPIFY_STORE_DOMAIN && process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
      const client = ShopifyBuy.buildClient({
        domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
        storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      });

      const ui = ShopifyBuy.UI.init(client);

      ui.createComponent('product', {
        id: product.id,
        node: document.getElementById(`buy-button-${product.id}`),
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
    } else {
      console.error('Shopify domain or storefront access token is not set.');
    }
  }, [product]);

  return (
    <div className="container product-container">
      <h1>{product.title}</h1>
      <div className="product-image">
        <img src={product.previewImageUrl} className="img-fluid" alt={product.title} />
      </div>
      <div className="product-details mt-2">
        <p className="product-price">{product.priceRange.minVariantPrice ? `$${product.priceRange.minVariantPrice}` : 'No Price'}</p>
        <div id={`buy-button-${product.id}`} className="buy-button-placeholder"></div>
      </div>
    </div>
  );
};

export default ProductTemplate;
