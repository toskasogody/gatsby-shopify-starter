const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  // Create default DSG page
  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  });

  // Query for products
  const result = await graphql(`
    {
      allSanityProduct {
        nodes {
          id
          store {
            slug {
              current
            }
          }
        }
      }
    }
  `);

  const productTemplate = path.resolve('src/templates/product.js');

  result.data.allSanityProduct.nodes.forEach((node) => {
    createPage({
      path: `/product/${node.store.slug.current}`,
      component: productTemplate,
      context: {
        id: node.id,
      },
    });
  });
  exports.createPages = async ({ actions }) => {
    const { createPage } = actions;
    createPage({
      path: '/cart',
      component: require.resolve('./src/pages/cart.js'),
    });
  };
  
};
