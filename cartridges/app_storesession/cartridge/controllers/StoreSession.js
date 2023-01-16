const server = require("server");
const PriceBookMgr = require("dw/catalog/PriceBookMgr");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const StoreMgr = require("dw/catalog/StoreMgr");
const Site = require("dw/system/Site");
const Session = require("dw/system/Session");

const { closestStore } = require("~/cartridge/scripts/helpers/distance");

//Administraction side develoment sistem object types : crear la variable
//

server.get("Start", (req, res, next) => {
  let render = "storesession/session";
  let mobile = req.querystring.mobile;
  mobile = mobile == "true" ? true : false;
  if (mobile) {
    render = "storesession/sessionMobile";
  }
  let empresaId;
  const storeId = req.session.raw.privacy.storeId;
  let store;
  if (storeId) {
    store = StoreMgr.getStore(storeId);
    empresaId = store.custom.empresaId;
    req.session.privacyCache.set("empresaId", empresaId);
    req.session.privacyCache.set("storeId", storeId);
      
    const customPricebookToggle = Site.getCurrent().getCustomPreferenceValue(
      "customPricebookToggle"
    );
    handleToggglePriceBook(empresaId, customPricebookToggle);
  }

  res.render(render, {
    store: store,
    mobile: mobile,
  });
  next();
});

const handleToggglePriceBook = (empresaId, customPriceBookToggle) => {
  let jsonCPT;
  let error;
  try {
    jsonCPT = JSON.parse(customPriceBookToggle);
    let priceBook = jsonCPT.values.find((v) => v.value == empresaId);
    let list = PriceBookMgr.getPriceBook(priceBook.pricebookList);
    let sales = PriceBookMgr.getPriceBook(priceBook.pricebookSales);
    PriceBookMgr.setApplicablePriceBooks(list, sales);
    error = "working...";
  } catch (error) {
    error = error;
  }
};

server.get("MapsScript", (req, res, next) => {
  const apikey = Site.getCurrent().getCustomPreferenceValue("mapAPI");
  res.render("storesession/mapsScript", {
    apikey: apikey,
  });
  next();
});

server.post("CleanStore", (req, res, next) => {
  req.session.privacyCache.set("storeId", null);
  next();
});

server.post("SetStore", (req, res, next) => {
  const stores = SystemObjectMgr.querySystemObjects(
    "Store",
    "latitude != {0} AND longitude != {0}",
    "creationDate desc",
    null
  );

  const clientLocation = {
    lat: req.form.lat,
    lng: req.form.lng,
  };

  const storeId = closestStore(stores, clientLocation);
  const store = StoreMgr.getStore(storeId);

  req.session.privacyCache.set("storeId", storeId);
  req.session.privacyCache.set("empresaId", store.custom.empresaId);

  res.json({});

  next();
});

module.exports = server.exports();

//1 enpieza
