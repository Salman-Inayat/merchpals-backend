const { productsConfig } = require('../constants/productMappings');

const mapColor = function (order) {
  const updatedProducts = order.products.map(product => {
    console.log({mappings: product.productMapping});
    const relatedConfig = productsConfig[product.vendorProduct.productId.slug];

    const labelledMapping = {
        ...product.productMapping,
        variant: {id: product.productMapping.variant, label: relatedConfig.variant[product.productMapping.variant] || ''},
        color: {id: product.productMapping.color, label: relatedConfig.color[product.productMapping.color] || ''}
      }
    
    return { 
      ...product,
      productMapping: labelledMapping
    }
  })

  return {
    ...order,
    products: updatedProducts
  }
}
module.exports = {
  mapColor
};