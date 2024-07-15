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
              options: false,
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
          },
        },
      });
    }
  }, [product.store.id]);

  const handleAddToCart = () => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_STORE_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const ui = ShopifyBuy.UI.init(client);

    ui.createComponent('product', {
      id: product.store.id,
      node: document.getElementById(`buy-button-${product.store.id}`),
      moneyFormat: '%24%7B%7Bamount%7D%7D',
      options: {
        product: {
          buttonDestination: 'cart',
          layout: 'vertical',
          width: '240px',
          variantId: selectedVariant.id,
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
        },
      },
    });
  };

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    const priceElement = document.getElementById(`price-${product.store.id}`);
    if (priceElement) {
      priceElement.textContent = `$${variant.store.price}`;
    }
    const mainImageElement = document.getElementById(`main-image-${product.store.id}`);
    if (mainImageElement) {
      mainImageElement.src = variant.store.previewImageUrl || product.store.previewImageUrl;
    }
  };

  return (
    <div className="container product-page">
      <div className="row">
        <div className="col-md-6">
          <img
            id={`main-image-${product.store.id}`}
            src={selectedVariant.store.previewImageUrl || product.store.previewImageUrl}
            className="img-fluid"
            alt={product.store.title}
          />
        </div>
        <div className="col-md-6">
          <h1>{product.store.title}</h1>
          <p id={`price-${product.store.id}`} className="product-price">
            ${selectedVariant.store.price}
          </p>
          <div className="variant-options">
            {product.store.variants.map((variant, index) => (
              <button
                key={index}
                className="variant-image-button"
                onClick={() => handleVariantClick(variant)}
                style={{
                  backgroundImage: `url(${variant.store.previewImageUrl})`,
                }}
              >
                <span className="sr-only">{variant.store.title}</span>
              </button>
            ))}
          </div>
          <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder" onClick={handleAddToCart}></div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
