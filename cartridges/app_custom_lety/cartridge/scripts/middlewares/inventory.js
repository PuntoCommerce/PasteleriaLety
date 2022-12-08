const BasketMgr = require("dw/order/BasketMgr");
const collections = require("*/cartridge/scripts/util/collections");
const { ApiLety } = require("*/cartridge/scripts/jobs/api");
const Resource = require("dw/web/Resource");

const handleExistenciaCall = (pid, quantity, storeId) => {
  let today = new Date();
  today.setMinutes(today.getMinutes() + 1);
  let existencia = ApiLety("ExistenciaPorCentroFecha", {
    Empresa: "1",
    iIdMaterial: parseInt(pid),
    iIdCentro: parseInt(storeId),
    dtFecha: today.toISOString(),
  });

  let error = false;
  let message = "";

  /* if (typeof existencia == "string") {
    try {
      let json = JSON.parse(existencia);
      if (
        json.ExistenciaPorCentroFecha[0].Existencia < quantity ||
        json.ExistenciaPorCentroFecha[0].error
      ) {
        error = true;
        message = Resource.msg("no.stock.available", "stockCustom", null);
      }
    } catch (error) {
      error = true;
      message = Resource.msg("response.error", "stockCustom", null);
    }
  } else {
    error = true;
    message = Resource.msg("response.error", "stockCustom", null);
  } */
  return { error: error, message: message };
};

const checkOnlineInventory = (req, res, next) => {
  let pid = req.form.pid;
  let quantity;
  let storeId = req.session.raw.privacy.storeId;
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

  let existencia = handleExistenciaCall(pid, quantity, storeId);

  let viewData = res.getViewData();
  viewData.error = existencia.error;
  viewData.message = existencia.message;
  res.setViewData(viewData);
  next();
};

const checkOnlineInventoryMulti = (collection, storeId) => {
  let error = false;
  let message = "";
  let store = parseInt(storeId);
  let errors = [];
  let err;
  let products = collections.forEach(collection, (p) => {
    let existencia = handleExistenciaCall(
      p.productID,
      p.quantityValue,
      storeId
    );
    if (existencia.error) {
      error = true;
      errors.push(existencia.message + " (" + p.productName + "). ");
    }
  });

  return { error: error, errors: errors };
};

module.exports = {
  checkOnlineInventory: checkOnlineInventory,
  checkOnlineInventoryMulti: checkOnlineInventoryMulti,
};
