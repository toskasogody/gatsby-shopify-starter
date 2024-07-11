import React, { useEffect } from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import ShopifyBuy from '@shopify/buy-button-js';

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

  useEffect(() => {
    const client = ShopifyBuy.buildClient({
      domain: process.env.GATSBY_SHOPIFY_DOMAIN,
      storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    });

    const ui = ShopifyBuy.UI.init(client);
    products.forEach((product) => {
      if (product.shopifyId) {
        ui.createComponent('product', {
          id: product.shopifyId,
          node: document.getElementById(`buy-button-${product.shopifyId}`),
          moneyFormat: '%24%7B%7Bamount%7D%7D',
        });
      }
    });
  }, [products]);

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product._id}>
          <pre>{JSON.stringify(product, null, 2)}</pre>
          <h2>{product.title || 'No Title'}</h2>
          <p>{product.description || 'No Description'}</p>
          <p>{product.price ? `$${product.price}` : 'No Price'}</p>
          {product.images && product.images.length > 0 && (
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
