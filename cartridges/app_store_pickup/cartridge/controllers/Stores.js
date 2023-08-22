const server = require("server");
server.extend(module.superModule);
const PUHelpers = require("*/cartridge/scripts/helpers/pickupHelpers");
const BasketMgr = require("dw/order/BasketMgr");

const renderTemplateHelper = require("*/cartridge/scripts/renderTemplateHelper");

function removeDup(stores) {
  const seenIds = {};
  const uniqueData = [];

  for (let i = 0; i < stores.length; i++) {
    var item = stores[i];
    var id = item.ID;

    if (!seenIds[id]) {
      seenIds[id] = true;
      uniqueData.push(item);
    }
  }

  return uniqueData;
}

server.post("CustomFindStores", (req, res, next) => {
  let lat = req.form.lat;
  let long = req.form.long;

  let stores = PUHelpers.getNearestStroes(parseFloat(lat), parseFloat(long));
  if (stores.isEmpty()) {
    res.json({
      error: true,
      message: "NO STORES",
    });

    return next();
  }

  let currentB = BasketMgr.getCurrentBasket();
  let products = PUHelpers.formatProducts(currentB.productLineItems);
  stores = PUHelpers.filterStores(products, stores.keySet(), {
    lat: lat,
    long: long,
  });
  stores = PUHelpers.sortStores(stores);

  const storeId = req.session.raw.privacy.storeId;

  const storesDup = removeDup(stores)

  let renderedStores = renderTemplateHelper.getRenderedHtml(
    { stores: { stores: storesDup }, defaultStoreId: storeId },
    "storeLocator/storeLocatorResults"
  );

  res.json({
    stores: stores,
    renderedStores: renderedStores,
  });

  next();
});

module.exports = server.exports();
