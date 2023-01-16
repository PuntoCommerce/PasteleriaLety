const Transaction = require("dw/system/Transaction");
const AmountDiscount = require("dw/campaign/AmountDiscount");

const SHIPMENT_COST_PROMOTION = "dinamycShipmentCost";

function createDinamycCost(shippingCost, currentBasket) {
  let shipPriceAdjustment =
    currentBasket.getShippingPriceAdjustmentByPromotionID(
      SHIPMENT_COST_PROMOTION
    );

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
      shipPriceAdjustment.setManual(true);
    }
  });
}

function removeDinamycCost(currentBasket) {
  let shipPriceAdjustment =
    currentBasket.getShippingPriceAdjustmentByPromotionID(
      SHIPMENT_COST_PROMOTION
    );
  Transaction.wrap(function () {
    // to remove the shipping adjustment created when product is removed from cart
    if (shipPriceAdjustment !== null) {
      currentBasket.removeShippingPriceAdjustment(shipPriceAdjustment);
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
  removeDinamycCost: removeDinamycCost,
  saveRequestInfo: saveRequestInfo,
};
