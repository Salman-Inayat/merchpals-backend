const { productsConfig } = require('../constants/productMappings');

module.exports = function (products) {
  console.log(products[0]);
  return products.map(product => {
    const relatedConfig = productsConfig[product.slug];
    let labelledColors = []
    const relatedProductVariants = product.productMappings.filter(p => p.productId.equals(product._id))

     labelledColors = product.colors.map(pm => ({ 
       id: pm, 
       label: relatedConfig.color[pm] || '',
       relatedProductVariantsId: relatedProductVariants.filter(p => p.color === pm)
      }));
    
    return { ...product, colors: labelledColors }
  })
};