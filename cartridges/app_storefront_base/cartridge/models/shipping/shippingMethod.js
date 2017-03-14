'use strict';

var ShippingMgr = require('dw/order/ShippingMgr');

var Assertions = require('~/cartridge/scripts/util/assertions');
var formatCurrency = require('~/cartridge/scripts/util/formatting').formatCurrency;

/**
 * Returns shippingCost property for a specific Shipment / ShippingMethod pair
 * @param {dw.order.ShippingMethod} shippingMethod - the default shipment of the current basket
 * @param {dw.order.Shipment} shipment - a shipment of the current basket
 * @returns {string} String representation of Shipping Cost
 */
function getShippingCost(shippingMethod, shipment) {
    Assertions.assertRequiredParameter(shipment, 'shipment');
    Assertions.assertRequiredParameter(shippingMethod, 'shippingMethod');

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);
    var shippingCost = shipmentShippingModel.getShippingCost(shippingMethod);

    return formatCurrency(shippingCost.amount.value, shippingCost.amount.currencyCode);
}

/**
 * Returns isSelected property for a specific Shipment / ShippingMethod pair
 * @param {dw.order.ShippingMethod} shippingMethod - the default shipment of the current basket
 * @param {dw.order.Shipment} shipment - a shipment of the current basket
 * @returns {boolean} true is shippingMethod is selected in Shipment
 */
function getIsSelected(shippingMethod, shipment) {
    Assertions.assertRequiredParameter(shipment, 'shipment');
    Assertions.assertRequiredParameter(shipment, 'shippingMethod');

    var selectedShippingMethod = shipment.shippingMethod || ShippingMgr.getDefaultShippingMethod();
    var selectedShippingMethodID = selectedShippingMethod ? selectedShippingMethod.ID : null;

    return (selectedShippingMethodID && shippingMethod.ID === selectedShippingMethodID);
}


/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.ShippingMethod} shippingMethod - the default shipment of the current basket
 * @param {dw.order.Shipment} [shipment] - a Shipment
 */
function ShippingMethodModel(shippingMethod, shipment) {
    Assertions.assertRequiredParameter(shippingMethod, 'shippingMethod');

    this.ID = shippingMethod.ID;
    this.displayName = shippingMethod.displayName;
    this.description = shippingMethod.description;
    this.estimatedArrivalTime = shippingMethod.custom.estimatedArrivalTime;
    this.isDefault = shippingMethod.defaultMethod;

	// Mix in dynamically transformed properties
    if (shipment) {
		// Optional model information available with 'shipment' parameter
        this.shippingCost = getShippingCost(shippingMethod, shipment);
        this.isSelected = getIsSelected(shippingMethod, shipment);
    }
}

module.exports = ShippingMethodModel;