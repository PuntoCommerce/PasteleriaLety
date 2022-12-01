const server = require("server");
const PriceBookMgr = require("dw/catalog/PriceBookMgr");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const StoreMgr = require("dw/catalog/StoreMgr");
const Site = require("dw/system/Site");
const Session = require("dw/system/Session");

const { closestStore } = require("~/cartridge/scripts/helpers/distance");

server.get("Start", (req, res, next) => {
  const currentSite = Site.getCurrent();
  const apikey = currentSite.getCustomPreferenceValue("mapAPI");

  const storeId = req.session.raw.privacy.storeId;
  let store;
  if (storeId) {
    store = StoreMgr.getStore(storeId);
    req.session.privacyCache.set("empresaId", store.custom.empresaId);
  }

  res.render("storesession/session", {
    apikey: apikey,
    store: store,
  });
  next();
});

server.post("CleanStore", (req, res, next) => {
  req.session.privacyCache.set("storeId", null);
  next();
});

server.post("SetStore", (req, res, next) => {
  // let CustomerMgr = require('dw/customer/CustomerMgr');
  // let AddressModel = require('*/cartridge/models/address');
  // let collections = require('*/cartridge/scripts/util/collections');

  // let customer = CustomerMgr.getCustomerByCustomerNumber(req.currentCustomer.profile.customerNo);
  // // Lista de Direcciones
  // let rawAddressBook = customer.addressBook.getAddresses();

  // // Sesion en cache del usuario
  // let userSession = req.session.privacyCache.set("storeId", storeId);

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
