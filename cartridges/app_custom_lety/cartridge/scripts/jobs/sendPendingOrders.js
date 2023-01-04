const OrderMgr = require("dw/order/OrderMgr");
const Transaction = require("dw/system/Transaction");
const HO = require("~/cartridge/scripts/helpers/handleOrders.js");

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
    try {
      if (order.defaultShipment.shippingMethodID == "pickup") {
        status = HO.sendPickupOrderToERP(order.orderNo);
      } else {
        status = HO.sendShippingOrderToERP(order.orderNo);
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
