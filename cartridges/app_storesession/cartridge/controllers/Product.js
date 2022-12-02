const server = require("server");
server.extend(module.superModule);
const storeInventory = require("*/cartridge/scripts/middlewares/storeInventory");

server.get(
  "HasInventoryOn",
  storeInventory.checkInventory,
  (req, res, next) => {
    const viewData = res.getViewData();
    viewData.addToCartUrl = req.querystring.addToCartUrl;
    viewData.pid = req.querystring.pid;

    viewData.available = req.querystring.available == "true" ? true : false;
    viewData.readyToOrder =
      req.querystring.readyToOrder == "true" ? true : false;

    res.setViewData(viewData);
    res.render(req.querystring.rurl);
    next();
  }
);

module.exports = server.exports();
