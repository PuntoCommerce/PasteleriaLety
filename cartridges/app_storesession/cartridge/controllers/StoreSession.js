const server = require("server");
const PriceBookMgr = require("dw/catalog/PriceBookMgr");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const StoreMgr = require("dw/catalog/StoreMgr");
const Site = require("dw/system/Site");
const Session = require("dw/system/Session");

const { closestStore } = require("~/cartridge/scripts/helpers/distance");

server.get("Start", (req, res, next) => {
  //let variable = req;
  const currentSite = Site.getCurrent();
  const apikey = currentSite.getCustomPreferenceValue("mapAPI");
  const isSessionStoreMandatory = currentSite.getCustomPreferenceValue(
    "isSessionStoreMandatory"
  );

  const storeId = req.session.raw.privacy.storeId;
  let storeName = undefined;
  let storeAddress1 = undefined;
  let storeAddress2 = undefined;
  let storeAddress1f = undefined;
  let storeAddress2f = undefined;
  if (storeId) {
    const store = StoreMgr.getStore(storeId);
    storeName = store.name;
    if(store.address1 === null){
        storeAddress1 = "No hay Dirección";
    }else{
      storeAddress1 = store.address1;
    }
    if(store.address2 === null){
      storeAddress2 = "No hay Dirección";
    }else{
      storeAddress2 = store.address2;
    }
    let arr1 = storeAddress1.split(',');
    let arr2 = storeAddress2.split(',');
    storeAddress1f = arr1[0];
    storeAddress2f = arr2[0];
  }

  res.render("storesession/session", {
     apikey: apikey,
    isSessionStoreMandatory,
    storeName: storeName,
    storeAddress1: storeAddress1f,
    storeAddress2: storeAddress2f
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

  next();
});



module.exports = server.exports();


//1 enpieza