const server = require("server");
server.extend(module.superModule);
const inventory = require("*/cartridge/scripts/middlewares/inventory");
const BasketMgr = require("dw/order/BasketMgr");
const URLUtils = require("dw/web/URLUtils");

server.append("SetStore", (req, res, next) => {
  const currentBasket = BasketMgr.getCurrentBasket();
  if (currentBasket) {
    let storeId = req.session.raw.privacy.storeId;
    let existencia = inventory.checkOnlineInventoryMulti(
      currentBasket.productLineItems,
      storeId
    );
    if (existencia.error) {
      let message = existencia.errors.join("");
      let viewData = res.getViewData();
      viewData.redirectUrl = URLUtils.url(
        "Cart-Show",
        "error",
        message
      ).toString();
      res.setViewData(viewData);
    }
  }
  next();
});

module.exports = server.exports();
