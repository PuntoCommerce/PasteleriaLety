const server = require("server");
const PriceBookMgr = require("dw/catalog/PriceBookMgr");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const StoreMgr = require("dw/catalog/StoreMgr");
const Site = require("dw/system/Site");
const Session = require("dw/system/Session");

const { closestStore } = require("~/cartridge/scripts/helpers/distance");

server.get("Start", (req, res, next) => {
  let render = "storesession/session";
  let mobile = req.querystring.mobile;
  mobile = mobile == "true" ? true : false;
  if (mobile) {
    render = "storesession/sessionMobile";
  }

  const storeId = req.session.raw.privacy.storeId;
  let store;
  if (storeId) {
    store = StoreMgr.getStore(storeId);
    req.session.privacyCache.set("empresaId", store.custom.empresaId);
  }

  res.render(render, {
    store: store,
    mobile: mobile,
  });
  next();
});

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

  next();
});

module.exports = server.exports();

//1 enpieza
