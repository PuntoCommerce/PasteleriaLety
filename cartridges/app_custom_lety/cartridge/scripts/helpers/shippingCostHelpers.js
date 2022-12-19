const Transaction = require("dw/system/Transaction");
const AmountDiscount = require("dw/campaign/AmountDiscount");

const SHIPMENT_COST_PROMOTION = "dinamycShipmentCost";

function createDinamycCost(shippingCost, currentBasket) {
  var shipPriceAdjustment =
    currentBasket.getShippingPriceAdjustmentByPromotionID(
      SHIPMENT_COST_PROMOTION
    );
  var selectedShippingMethod = currentBasket.defaultShipment.shippingMethodID;

  Transaction.wrap(function () {
    // to remove the shipping adjustment created when product is removed from cart
    if (shipPriceAdjustment !== null) {
      currentBasket.removeShippingPriceAdjustment(shipPriceAdjustment);
    }
    if (shippingCost !== 0) {
      shipPriceAdjustment =
        currentBasket.defaultShipment.shippingLineItems[0].createShippingPriceAdjustment(
          SHIPMENT_COST_PROMOTION,
          AmountDiscount(shippingCost)
        );
      // shipPriceAdjustment.setPriceValue(shippingCost);
      shipPriceAdjustment.setManual(true);
    }
  });
}

function saveRequestInfo(folioDireccion, shippingCostId, currentBasket) {
  Transaction.wrap(() => {
    currentBasket.custom.folioDireccion = parseInt(folioDireccion);
    currentBasket.custom.shippingCostId = shippingCostId;
  });
}

module.exports = {
  createDinamycCost: createDinamycCost,
  saveRequestInfo: saveRequestInfo,
};
