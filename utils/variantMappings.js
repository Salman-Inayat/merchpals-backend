const { productsConfig } = require('../constants/productMappings');

module.exports = function (products) {
  return products.map(product => {
    const relatedConfig = productsConfig[product.productId.slug];

    const labelledMappings = product.productMappings.map(pm => {
      return {
        ...pm,
        variant: {id: pm.variant, label: relatedConfig.variant[pm.variant] || ''},
        color: {id: pm.color, label: relatedConfig.color[pm.color] || ''}
      }
    });

    const formattedproduct = { 
      ...product,
      vendorProductId: product._id,
      productId: product.productId._id,
      name: product.productId.name,
      image: product.productId.image,
      slug: product.productId.slug,
      productMappings: labelledMappings
    }

    delete formattedproduct._id;

    return formattedproduct;
  })

};