import React, { useState, useEffect, useRef } from 'react';
import { graphql } from 'gatsby';
import ShopifyBuy from '@shopify/buy-button-js';
import Slider from 'react-slick';
import Navbar from '../components/navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
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
  const sliderRef = useRef(null);

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
  };

  const settings = {
    vertical: true,
    verticalSwiping: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <>
      <Navbar />
      <div className="container product-container">
        <div className="row">
          <div className="col-md-2">
            <div className="slider-wrapper">
              <FontAwesomeIcon
                icon={faChevronUp}
                className="slider-arrow slider-arrow-up"
                onClick={() => sliderRef.current.slickPrev()}
              />
              <Slider {...settings} ref={sliderRef}>
                {product.store.variants.map((variant, index) => (
                  <div key={index} className="variant-image-slide">
                    <button
                      className="variant-image-button"
                      onClick={() => handleVariantClick(variant)}
                      style={{
                        backgroundImage: `url(${variant.store.previewImageUrl})`,
                      }}
                    >
                      <span className="sr-only">{variant.store.title}</span>
                    </button>
                  </div>
                ))}
              </Slider>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="slider-arrow slider-arrow-down"
                onClick={() => sliderRef.current.slickNext()}
              />
            </div>
          </div>
          <div className="col-md-10 product-details pdp-details">
            <img
              src={selectedVariant.store.previewImageUrl || product.store.previewImageUrl}
              className="product-preview"
              alt={product.store.title}
            />
            <div className="product-info pdp-info">
              <h1 className="product-title pdp-title">{product.store.title}</h1>
              <div id={`buy-button-${product.store.id}`} className="buy-button-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
