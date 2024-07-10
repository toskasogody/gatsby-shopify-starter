import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import ShopifyBuy from '@shopify/buy-button-js';

export const query = graphql`
  query {
    allSanityProduct {
      nodes {
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

  useEffect(() => {
    const client = ShopifyBuy.buildClient({
      domain: 'your-shopify-store-domain', // Replace with your Shopify store domain
      storefrontAccessToken: 'your-shopify-access-token', // Replace with your Shopify access token
    });

    const ui = ShopifyBuy.UI.init(client);
    products.forEach((product) => {
      ui.createComponent('product', {
        id: product.shopifyId,
        node: document.getElementById(`buy-button-${product.shopifyId}`),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
      });
    });
  }, [products]);

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.slug.current}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <p>{`$${product.price}`}</p>
          {product.images.length > 0 && (
            <GatsbyImage
              image={getImage(product.images[0].asset.gatsbyImageData)}
              alt={product.title}
            />
          )}
          <div id={`buy-button-${product.shopifyId}`} />
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
