const { productsConfig } = require('../constants/productMappings');

module.exports = function (product) {
  // console.log("proso dp", product);
    const relatedConfig = productsConfig[product.slug];
    const labelledMappings = product.productMappings.map(pm => {
      return {
        ...pm,
        variant: {id: pm.variant, label: relatedConfig.variant[pm.variant] || ''},
        color: {id: pm.color, label: relatedConfig.color[pm.color] || ''}
      }
    });

    return { ...product, productMappings: labelledMappings}
};