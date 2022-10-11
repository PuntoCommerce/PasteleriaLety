'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');

/**
 * To create shipping adjustment at shipping lineitem level with MP items shipping cost if the cart has Marketplacer items.
 * BM Shipping method cost will not be applicable for MP products.
 * A Product Level Free Shipping promotion will be created for MP category.
 * @param  {number} shippingCost - the shipping cost
 * @param  {Object} currentBasket - the basket object
 */
function createShippingAdjustmentForProducts(shippingCost, currentBasket) {
    var shipPriceAdjustment = currentBasket.getShippingPriceAdjustmentByPromotionID('marketplacer-shipping-price');
    var selectedShippingMethod = currentBasket.defaultShipment.shippingMethodID;

    Transaction.wrap(function () {
        // to remove the shipping adjustment created when product is removed from cart
        if (shipPriceAdjustment !== null) {
            currentBasket.removeShippingPriceAdjustment(shipPriceAdjustment);
        }
        if (shippingCost !== 0 && selectedShippingMethod !== 'pickup') {
            shipPriceAdjustment = currentBasket.defaultShipment.shippingLineItems[0]
                .createShippingPriceAdjustment('marketplacer-shipping-price');
            shipPriceAdjustment.setPriceValue(shippingCost);
            shipPriceAdjustment.setManual(true);
        }
    });
}
/**
 * Remove shipping adjustment for Marketplacer products
 * @param  {Object} currentBasket - the basket object
 */
function removeShippingAdjustmentForProducts(currentBasket) {
    var shipPriceAdjustment = currentBasket.getShippingPriceAdjustmentByPromotionID('marketplacer-shipping-price');
    if (shipPriceAdjustment !== null) {
        Transaction.wrap(function () {
            currentBasket.removeShippingPriceAdjustment(shipPriceAdjustment);
        });
    }
}
/**
 * @param  {Object} currentBasket - the basket object
 * @param  {Object} quoteeResponse - the basket object custom response from sales integration
 */
var currentBasket = BasketMgr.getCurrentBasket();
var quoteeResponse = JSON.parse(currentBasket.custom.response);
/**
 * Calculate difference beetwen base shipping cost and estafeta api result and returns it
 * @returns  {number} currentBaseShippingCost - the current base shipping cost
 * @param  {number} shippingMethod - the current base shipping cost
 */
function calcShippingCostAdjustment(shippingMethod) {
    var currentBaseShippingCost = currentBasket.shippingTotalPrice.value;
    var calculatedAjustment;
    if (currentBaseShippingCost < shippingMethod) {
        calculatedAjustment = shippingMethod - currentBaseShippingCost;
        return calculatedAjustment;
    }
    return 0;
}
/**
 * To get the products shipping cost and set adjustments
 */
function getOrderShippingDetails() {
    var usingShippingMethod = currentBasket.defaultShipment.shippingMethodID;
    if (quoteeResponse) {
        var standardShippingCost = Number(quoteeResponse.precioEstandar);
        var expressShippingCost = Number(quoteeResponse.precioExpress);
        if (usingShippingMethod === 'standardDynamic') {
            createShippingAdjustmentForProducts(calcShippingCostAdjustment(standardShippingCost), currentBasket);
        }
        if (usingShippingMethod === 'expressDynamic') {
            createShippingAdjustmentForProducts(calcShippingCostAdjustment(expressShippingCost), currentBasket);
        }
    }
}

exports.createShippingAdjustmentForProducts = createShippingAdjustmentForProducts;
exports.removeShippingAdjustmentForProducts = removeShippingAdjustmentForProducts;
exports.getOrderShippingDetails = getOrderShippingDetails;