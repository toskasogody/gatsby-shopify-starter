import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export const query = graphql`
  {
    allSanityProduct {
      nodes {
        _id
        store {
          title
          descriptionHtml
          previewImageUrl
          priceRange {
            minVariantPrice
          }
          slug {
            current
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

  if (products.length === 0) {
    return <p>No products available</p>;
  }

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product._id}>
          <h2>{product.store.title || 'No Title'}</h2>
          <p dangerouslySetInnerHTML={{ __html: product.store.descriptionHtml || 'No Description' }}></p>
          <p>{product.store.priceRange.minVariantPrice ? `$${product.store.priceRange.minVariantPrice}` : 'No Price'}</p>
          {product.store.previewImageUrl ? (
            <img src={product.store.previewImageUrl} alt={product.store.title} />
          ) : (
            <p>No Images</p>
          )}
          <div id={`buy-button-${product.store.id}`}>Buy Button Placeholder</div>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
