const BasketMgr = require("dw/order/BasketMgr");
const collections = require("*/cartridge/scripts/util/collections");
const { ApiLety } = require("*/cartridge/scripts/jobs/api");
const Resource = require("dw/web/Resource");
const StoreMgr = require("dw/catalog/StoreMgr");
const SystemObjectMgr = require("dw/object/SystemObjectMgr");
const Site = require("dw/system/Site");

const handleExistenciaCall = (pid, quantity, storeId, empresaId) => {
  let hoursDifferenceFromGMT = Site.getCurrent().getCustomPreferenceValue(
    "hoursDifferenceFromGMT"
  );
  let today = new Date();
  today.setHours(today.getHours() + hoursDifferenceFromGMT);
  today.setMinutes(today.getMinutes() + 1);
  let existencia = ApiLety("ExistenciaPorCentroFecha", {
    Empresa: empresaId,
    iIdMaterial: parseInt(pid),
    iIdCentro: parseInt(storeId),
    dtFecha: today.toISOString(),
  });

  let error = false;
  let message = "";
  let letyQuantity = 0;

  if (typeof existencia == "string") {
    try {
      let json = JSON.parse(existencia);
      if (
        json.ExistenciaPorCentroFecha[0].Existencia < quantity ||
        json.ExistenciaPorCentroFecha[0].error
      ) {
        letyQuantity = json.ExistenciaPorCentroFecha[0].error
          ? 0
          : Math.ceil(json.ExistenciaPorCentroFecha[0].Existencia);
        error = true;
        message = Resource.msgf(
          "no.stock.available",
          "stockCustom",
          null,
          letyQuantity
        );
      }
    } catch (error) {
      error = true;
      message = Resource.msg("response.error", "stockCustom", null);
    }
  } else {
    error = true;
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
