import React, { useState, useContext, useRef } from "react"
import { graphql } from "gatsby"
import { CartContext } from "../context/CartContext"
import Slider from "react-slick"
import Navbar from "../components/navbar"
import CustomSliderCart from "../components/CustomSliderCart"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "./product.css"

export const query = graphql`
  query ($id: String!) {
    sanityProduct(id: { eq: $id }) {
      _id
      store {
        title
        id
        previewImageUrl
        variants {
          store {
            id
            price
            title
            previewImageUrl
          }
        }
      }
    }
  }
`

const ProductPage = ({ data }) => {
  const { sanityProduct: product } = data
  const { addToCart, toggleCart } = useContext(CartContext)
  const sliderRef = useRef(null)
  const [selectedImage, setSelectedImage] = useState(
    product.store.variants[0].store.previewImageUrl
  )
  const [quantity, setQuantity] = useState(1) // Quantity state

  const handleVariantClick = variant => {
    setSelectedImage(variant.store.previewImageUrl)
  }

  const handleSlideChange = index => {
    setSelectedImage(product.store.variants[index].store.previewImageUrl)
  }

  const handleAddToCart = async () => {
    const defaultVariant = product.store.variants[0] // default variant
    const variantId = `gid://shopify/ProductVariant/${defaultVariant.store.id}`
    const productId = product.store.id // Extract the actual product ID
    const productToAdd = {
      id: `gid://shopify/Product/${productId}`,
      title: product.store.title,
      variant: {
        ...defaultVariant,
        id: variantId,
      },
      quantity: quantity, // Add the quantity here
    }
    console.log("Adding to cart:", productToAdd)

    try {
      await addToCart(productToAdd)
      toggleCart() // Open the cart slider after adding item to cart
    } catch (error) {
      console.error("Error adding to cart:", error)
    }
  }

  const handleQuantityChange = change => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + change
      return newQuantity < 1 ? 1 : newQuantity // Ensure quantity doesn't go below 1
    })
  }

  const settings = {
    vertical: true,
    verticalSwiping: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: true,
    beforeChange: (current, next) => handleSlideChange(next),
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 5,
          vertical: false,
          slidesToScroll: 3,
        },
      },
    ],
  }

  return (
    <>
      <Navbar />
      <CustomSliderCart />
      <div className="container d-flex flex-column flex-md-row m-auto gap-4">
        <div className="d-flex flex-column-reverse flex-md-row gap-4 w-100 ">
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
          <div className="d-flex">
            <img
              src={selectedImage || product.store.previewImageUrl}
              className="product-preview m-auto"
              alt={product.store.title}
            />
          </div>
        </div>
        <div className="g-col-4 product-details pdp-details">
          <div className="product-info pdp-info">
            <h1 className="product-title pdp-title">{product.store.title}</h1>
            <p className="product-price">
              ${product.store.variants[0].store.price}
            </p>
            <div className="quantity-controls">
              <span className="quantity-label">Quantity:</span>
              <button
                className="btn-quantity"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="quantity-display">{quantity}</span>
              <button
                className="btn-quantity"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <div className="buy-button">
              <button
                className="button-add-to-cart btn btn-primary"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default ProductPage
