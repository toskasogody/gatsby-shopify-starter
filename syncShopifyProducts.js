const { createClient } = require('@sanity/client');
const Shopify = require('shopify-buy');
const fetch = require('node-fetch');

// Initialize the Sanity client
const client = createClient({
  projectId: '9dcq25xb',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-07-01',
});

// Initialize the Shopify client
const shopifyClient = Shopify.buildClient({
  domain: '0e7773-93.myshopify.com',
  storefrontAccessToken: '42c66e91ff81ffb3e057e61d1fb0504d',
});

// Generate a valid Sanity document ID from a Shopify product ID
function generateSanityId(shopifyId) {
  return `customProduct-${shopifyId.replace(/[^a-zA-Z0-9-_]/g, '')}`;
}

// Upload an image to Sanity
async function uploadImage(imageUrl) {
  const response = await fetch(imageUrl);
  const buffer = await response.buffer();

  const asset = await client.assets.upload('image', buffer, {
    filename: imageUrl.split('/').pop(),
  });

  return asset._id;
}

// Fetch and sync products from Shopify to Sanity
async function fetchAndSyncProducts() {
  try {
    const products = await shopifyClient.product.fetchAll();

    for (const product of products) {
      const imageRefs = await Promise.all(product.images.map(async (image) => {
        const imageId = await uploadImage(image.src);
        return {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageId,
          },
        };
      }));

      const doc = {
        _id: generateSanityId(product.id), // Generate a unique ID
        _type: 'customProduct',
        title: product.title,
        slug: {
          _type: 'slug',
          current: product.handle,
        },
        shopifyId: product.id,
        description: product.description,
        price: parseFloat(product.variants[0].price),
        images: imageRefs,
      };

      await client.createOrReplace(doc);
    }
    console.log('Shopify products synced to Sanity');
  } catch (error) {
    console.error('Error syncing products:', error);
    if (error.response && error.response.errors) {
      console.error('Details:', error.response.errors);
    }
  }
}

// Execute the function
fetchAndSyncProducts();
