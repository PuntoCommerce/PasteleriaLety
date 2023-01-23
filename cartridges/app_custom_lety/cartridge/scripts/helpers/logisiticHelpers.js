const Site = require("dw/system/Site");

const isAbleToSD = (products) => {
  const maxCapacitySD =
    Site.getCurrent().getCustomPreferenceValue("maxCapacitySD");

  const iterator = products.iterator();
  let item;
  let product;
  let currentCapacity = 0;

  while (iterator.hasNext()) {
    item = iterator.next();
    product = item.product;
    currentCapacity += product.custom["cantidad-SD"] * item.quantityValue;
  }
  return currentCapacity <= maxCapacitySD;
};

module.exports = {
  isAbleToSD: isAbleToSD,
};
