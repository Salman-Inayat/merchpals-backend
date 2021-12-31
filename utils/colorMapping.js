const { productsConfig } = require('../constants/productMappings');

module.exports = function (products) {
  return products.map(product => {
    const relatedConfig = productsConfig[product.slug];
    const labelledColors = product.colors.map(pm => ({ id: pm, label: relatedConfig.color[pm] || ''}));
    return { ...product, colors: labelledColors }
  })
};