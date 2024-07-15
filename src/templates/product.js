import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import ShopifyBuy from '@shopify/buy-button-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './product.css'; // Ensure you have a CSS file for additional styling

export const query = graphql`
  query($id: String!) {
    sanityProduct(id: { eq: $id }) {
      _id
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
        variants {
          id
          
        }
      }
    }
  }
`;

const ProductPage = ({ data }) => {
  const { sanityProduct: product } = data;
  const [selectedVariant, setSelectedVariant] = useState(product.store.variants[0]);

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
                'background-color': '#000080',
                'font-family': 'Arial, sans-serif',
                'font-size': '12px',
                'padding-top': '10px',
                'padding-bottom': '10px',
                ':hover': {
                  'background-color': '#4D4DDF',
                },
                ':focus': {
                  'background-color': '#8E8EF4',
                },
              },
            },
            events: {
              variantSelected: (component) => {
                const selectedVariant = component.selectedVariant;
                const priceElement = document.getElementById(`price-${product.store.id}`);
                if (priceElement) {
                  priceElement.textContent = `$${selectedVariant.price}`;
                }
              },
            },
          },
        },
      });
    }
  }, [product.store.id]);

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    const priceElement = document.getElementById(`price-${product.store.id}`);
    if (priceElement) {
      priceElement.textContent = `$${variant.price}`;
    }
  };

  return (
    <div className="container product-page">
      <div className="row">
        <div className="col-md-6">
          <img src={selectedVariant.previewImageUrl || product.store.previewImageUrl} className="img-fluid" alt={product.store.title} />
        </div>
        <div className="col-md-6">
          <h1>{product.store.title}</h1>
          <p id={`price-${product.store.id}`} className="product-price">
            ${selectedVariant.price}
          </p>
          <div className="variant-options">
            {product.store.options.map((option, index) => (
              <div key={index} className="variant-option-group">
                <p>{option.name}</p>
                <div className="variant-values">
                  {option.values.map((value, valueIndex) => (
                    <button
                      key={valueIndex}
                      className="variant-value"
                      onClick={() => handleVariantClick(product.store.variants[valueIndex])}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;