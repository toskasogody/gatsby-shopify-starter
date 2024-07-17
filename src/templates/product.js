// src/templates/product.js
import React, { useEffect, useRef } from 'react';
import { graphql } from 'gatsby';
import ShopifyBuy from '@shopify/buy-button-js';
import Navbar from '../components/navbar'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './product.css';

export const query = graphql`
  query($id: String!) {
    sanityProduct(id: { eq: $id }) {
      _id
      store {
        title
        id
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
`;

const ProductPage = ({ data }) => {
  const { sanityProduct: product } = data;
  const buyButtonRef = useRef(null);

  useEffect(() => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const ui = ShopifyBuy.UI.init(client);

    if (product.store.id) {
      ui.createComponent('product', {
        id: product.store.id,
        node: document.getElementById(`buy-button-${product.store.id}`),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          product: {
            buttonDestination: 'cart',
            layout: 'horizontal',
            width: '240px',
            contents: {
              img: true,
              title: true,
              price: true,
              quantity: true,
              quantityIncrement: true,
              quantityDecrement: true,
              quantityInput: true
            },
            text: {
              button: 'ADD TO CART',
            },
            styles: {
              button: {
                'background-color': '#000080',
                'font-family': 'Arial, sans-serif',
                'font-size': '12px',
                'padding-top': '10px',
                'padding-bottom': '10px',
                'width': '100%', 
                ':hover': {
                  'background-color': '#4D4DDF',
                },
                ':focus': {
                  'background-color': '#8E8EF4',
                },
              },
            },
          },
        },
      }).then((component) => {
        buyButtonRef.current = component;
        console.log('Buy Button Component:', buyButtonRef.current);
      });
    }
  }, [product.store.id]);

  return (
    <>
      <Navbar /> {}
      <div className="product-container">
        <div className="product-details pdp-details">
          <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder"></div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
