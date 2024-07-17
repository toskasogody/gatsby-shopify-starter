import React, { useState, useEffect, useRef } from 'react';
import { graphql } from 'gatsby';
import ShopifyBuy from '@shopify/buy-button-js';
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
  const [selectedVariant, setSelectedVariant] = useState(product.store.variants[0]);
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
                'width': '100%', // Make the button full width
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
      }).then((component) => {
        buyButtonRef.current = component;
        console.log('Buy Button Component:', buyButtonRef.current);
      });
    }
  }, [product.store.id]);

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
    const priceElement = document.getElementById(`price-${product.store.id}`);
    if (priceElement) {
      priceElement.textContent = `$${variant.store.price}`;
    }

    // Update the Shopify Buy Button variant selection
    if (buyButtonRef.current) {
      const selectElement = buyButtonRef.current.node.querySelector('.shopify-buy__option-select__select');
      if (selectElement) {
        const option = Array.from(selectElement.options).find(opt => opt.value === variant.store.title);
        if (option) {
          selectElement.value = option.value;
          const event = new Event('change', { bubbles: true });
          selectElement.dispatchEvent(event);
        }
      }
    }
  };

  return (
    <div className="product-container">
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
      <div className="product-details pdp-details">
        <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder"></div>
      </div>
    </div>
  );
};

export default ProductPage;
