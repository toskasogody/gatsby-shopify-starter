import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export const query = graphql`
  {
    allSanityProduct {
      nodes {
        _id
        store{
        title
        descriptionHtml
        
        
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
          <p>{product.store.descriptionHtml || 'No Description'}</p>
          <p>{product.store.price ? `$${product.price}` : 'No Price'}</p>
          {product.store.images && product.images.length > 0 ? (
            <GatsbyImage
              image={getImage(product.images[0].asset.gatsbyImageData)}
              alt={product.title}
            />
          ) : (
            <p>No Images</p>
          )}
          <div id={`buy-button-${product.shopifyId}`}>Buy Button Placeholder</div>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
