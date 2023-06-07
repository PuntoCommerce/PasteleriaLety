const OrderMgr = require("dw/order/OrderMgr");
const Transaction = require("dw/system/Transaction");
const HOP = require("~/cartridge/scripts/helpers/handlePendingOrders.js");

const execute = (args) => {
  let daysBefore = parseInt(args.daysBefore);
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - daysBefore);

  let orders = OrderMgr.searchOrders(
    "custom.isError = {0} AND creationDate > {1} ",
    "creationDate desc",
    true,
    currentDate
  );

  let order;
  let status = {};

  while (orders.hasNext()) {
    order = orders.next();
    var payload = JSON.parse(order.custom.orderDetailJson)
    try {
      if (order.defaultShipment.shippingMethodID == "pickup") {
        status = HOP.sendPickupOrderToERP(payload);
      } else {
        status = HOP.sendShippingOrderToERP(payload);
      }
    } catch (error) {
      status.error = true;
      status.message = JSON.stringify(error);
    }

    Transaction.wrap(() => {
      if (status.error) {
        order.custom.errorDetail = status.message;
      } else {
        order.custom.isError = false;
      }
    });
  }
};

module.exports.execute = execute;
