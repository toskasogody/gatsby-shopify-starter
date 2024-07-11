import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

export const query = graphql`
  {
    allSanityProduct {
      nodes {
        _id
        title
        slug {
          current
        }
        description
        price
        shopifyId
        images {
          asset {
            gatsbyImageData(layout: CONSTRAINED)
          }
        }
      }
    }
  }
`;

const ProductsPage = ({ data }) => {
  const products = data.allSanityProduct.nodes;

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product._id}>
          <h2>{product.title || 'No Title'}</h2>
          <p>{product.description || 'No Description'}</p>
          <p>{product.price ? `$${product.price}` : 'No Price'}</p>
          {product.images && product.images.length > 0 && (
            <GatsbyImage
              image={getImage(product.images[0].asset.gatsbyImageData)}
              alt={product.title}
            />
          )}
          <div id={`buy-button-${product.shopifyId}`}>Buy Button Placeholder</div>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
