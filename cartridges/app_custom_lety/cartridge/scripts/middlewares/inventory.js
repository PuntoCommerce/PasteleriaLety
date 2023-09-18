const BasketMgr = require("dw/order/BasketMgr");
const collections = require("*/cartridge/scripts/util/collections");
const { ApiLety } = require("*/cartridge/scripts/jobs/api");
const Resource = require("dw/web/Resource");
const StoreMgr = require("dw/catalog/StoreMgr");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const Site = require("dw/system/Site");
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');

const handleExistenciaCall = (pid, quantity, storeId, empresaId) => {
  let hoursDifferenceFromGMT = Site.getCurrent().getCustomPreferenceValue(
    "hoursDifferenceFromGMT"
  );
  let productType = ProductMgr.getProduct(pid).custom.tipoproducto
  var existencia;

  let today = new Date();
  today.setHours(today.getHours() + hoursDifferenceFromGMT);
  today.setMinutes(today.getMinutes() + 1);

  if (productType === 'pedido especial') {
    existencia = ApiLety("ExistenciaPorCentroFechaEsp", {
      Empresa: empresaId,
      iIdMaterial: pid,
      iIdCentro: parseInt(storeId),
      dtFecha: today.toISOString(),
      productType: productType
    });
  } else {
    existencia = ApiLety("ExistenciaPorCentroFecha", {
      Empresa: empresaId,
      iIdMaterial: parseInt(pid),
      iIdCentro: parseInt(storeId),
      dtFecha: today.toISOString(),
      productType: productType
    });
  }


  var error = false;
  var message = "";
  var letyQuantity = 0;
  var err;

  try {
    var productExist = Number(existencia.Existencia);

    if (
      productExist < quantity
    ) {
      error = true;
      message = Resource.msgf(
        "no.stock.available",
        "stockCustom",
        null,
        letyQuantity
      );
    } else {
      letyQuantity = productExist;
    }
  } catch (error) {
    error = true;
    err = error;
    message = Resource.msg("response.error", "stockCustom", null);
  }

  return { error: error, message: message, quantity: letyQuantity };
};

const checkOnlineInventory = (req, res, next) => {
  let pid = req.form.pid;
  let quantity;
  let storeId = req.session.raw.privacy.storeId;
  let store = StoreMgr.getStore(storeId);
  let currentBasket = BasketMgr.getCurrentBasket();
  let isUpdate = false;

  if (!pid) {
    isUpdate = true;
    pid = req.querystring.pid;
    quantity = parseInt(req.querystring.quantity);
  } else {
    quantity = parseInt(req.form.quantity);
  }

  if (currentBasket && !isUpdate) {
    let exist = collections.find(
      currentBasket.productLineItems,
      (item) => item.productID == pid
    );

    if (exist) {
      quantity += exist.quantityValue;
    }
  }

  let existencia = handleExistenciaCall(
    pid,
    quantity,
    storeId,
    store.custom.empresaId
  );

  if (existencia.quantity === 0) {
    existencia.error = true
  }

  let logger = Logger.getLogger("ERP_Member", "ERP_Member")

  logger.warn("Type: {0} payload {1}", 'INFO', JSON.stringify(existencia));

  let viewData = res.getViewData();
  viewData.error = existencia.error;
  viewData.message = existencia.message;
  res.setViewData(viewData);
  next();
};

const checkOnlineInventoryMulti = (collection, storeId) => {
  let error = false;
  let message = "";
  let store = StoreMgr.getStore(storeId);
  let errors = [Resource.msg("no.stock.available.multi", "stockCustom", null)];
  let err;
  let products = collections.forEach(collection, (p) => {
    let existencia = handleExistenciaCall(
      p.productID,
      p.quantityValue,
      storeId,
      store.custom.empresaId
    );
    if (existencia.error) {
      error = true;
      errors.push(
        Resource.msgf(
          "no.stock.available.product",
          "stockCustom",
          null,
          p.productName,
          existencia.quantity
        )
      );
    }
  });

  return { error: error, errors: errors };
};

const handleNearestWithService = (collection, clientLocation) => {
  const distance = require("*/cartridge/scripts/helpers/distance");

  const stores = SystemObjectMgr.querySystemObjects(
    "Store",
    "custom.isShippingAvailable = {0}",
    "creationDate desc",
    true
  );
  let sortedStores = distance.sortStoresByDistance(stores, clientLocation);

  let aplicableStore;
  let result;
  let error = true;
  let ss;

  // Find the nearest store to find one who complete the order items to sell
  for (let i = 0; i < sortedStores.length; i++) {
    ss = sortedStores[i];
    result = checkOnlineInventoryMulti(collection, ss.store.ID);
    if (!result.error) {
      aplicableStore = ss.store;
      break;
    }
  }

  return aplicableStore;
};

const handleStoreShipping = (storeId, currentBasket, clientLocation) => {
  let store = StoreMgr.getStore(storeId);
  // if (!store.custom.isShippingAvailable) {
  store = handleNearestWithService(
    currentBasket.productLineItems,
    clientLocation
  );
  // }
  return store;
};

module.exports = {
  checkOnlineInventory: checkOnlineInventory,
  checkOnlineInventoryMulti: checkOnlineInventoryMulti,
  handleStoreShipping: handleStoreShipping,
};
