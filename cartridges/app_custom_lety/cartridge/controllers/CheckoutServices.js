const server = require("server");
server.extend(module.superModule);
const HO = require("*/cartridge/scripts/helpers/handleOrders.js");

server.append("PlaceOrder", (req, res, next) => {
  const viewData = res.getViewData();
  if (!viewData.error) {
    HO.sendOrderToERP(viewData.orderID);
  }
  next();
});

module.exports = server.exports();
