import React, { useState, useEffect, useContext, useRef } from 'react';
import { graphql } from 'gatsby';
import { CartContext } from '../context/CartContext'; 
import Slider from 'react-slick';
import Navbar from '../components/navbar';
import CustomSliderCart from '../components/CustomSliderCart'; 
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
  const { addToCart } = useContext(CartContext);
  const sliderRef = useRef(null);

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };

  const handleSlideChange = (index) => {
    setSelectedVariant(product.store.variants[index]);
  };

  const handleAddToCart = () => {
    addToCart({
      id: selectedVariant.id,
      title: product.store.title,
      variant: selectedVariant,
    });
  };

  const settings = {
    vertical: true,
    verticalSwiping: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (current, next) => handleSlideChange(next),
  };

  return (
    <>
      <Navbar />
      <CustomSliderCart />
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
              <button className="button-add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
