const ProductMgr = require("dw/catalog/ProductMgr");
const PromotionMgr = require("dw/campaign/PromotionMgr");

const findPromotions = (productId) => {
  const apiProduct = ProductMgr.getProduct(productId);
  const promotions =
    PromotionMgr.activeCustomerPromotions.getProductPromotions(apiProduct);
  return promotions;
};

const findAttribiutes = (productId) => {
  const attributes = ["numerodepersonas"];
  const apiProduct = ProductMgr.getProduct(productId);
  return { numerodepersonas: apiProduct.custom.numerodepersonas};
};

module.exports = {
  findPromotions: findPromotions,
  findAttribiutes: findAttribiutes,
};