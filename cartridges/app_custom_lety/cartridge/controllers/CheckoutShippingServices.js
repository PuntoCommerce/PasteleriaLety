const server = require("server");
server.extend(module.superModule);
const BasketMgr = require("dw/order/BasketMgr");
const COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers");
const Transaction = require("dw/system/Transaction");
const CAHelpers = require("*/cartridge/scripts/helpers/customAddressHelpers");
const SCHelpers = require("*/cartridge/scripts/helpers/shippingCostHelpers");
const { ApiLety } = require("*/cartridge/scripts/jobs/api");
const gMaps = require("*/cartridge/scripts/googleMaps/api");
const OrderModel = require("*/cartridge/models/order");
const Locale = require("dw/util/Locale");
const inventory = require("*/cartridge/scripts/middlewares/inventory");
const URLUtils = require("dw/web/URLUtils");
const Resource = require("dw/web/Resource");
const { isAbleToSD } = require("*/cartridge/scripts/helpers/logisiticHelpers");

const validateEmail = (email) => {
  if (!email) {
    return false;
  }
  return true;
};

server.prepend("SubmitShipping", (req, res, next) => {
  let storeId = req.form.store || req.session.raw.privacy.storeId;
  const currentBasket = BasketMgr.getCurrentBasket();
  if (currentBasket) {
    let existencia = inventory.checkOnlineInventoryMulti(
      currentBasket.productLineItems,
      storeId
    );
    if (existencia.error) {
      let message = existencia.errors.join("");
      let viewData = res.getViewData();
      viewData.error = true;
      viewData = {
        error: true,
        cartError: true,
        fieldErrors: [],
        serverErrors: [],
        redirectUrl: URLUtils.url("Cart-Show", "error", message).toString(),
      };
      res.setViewData(viewData);
      return next();
    }
  }
  next();
});

server.append("SubmitShipping", (req, res, next) => {
  const shipping = server.forms.getForm("shipping");
  const currentBasket = BasketMgr.getCurrentBasket();

  let viewData = res.getViewData();

  const formFields = COHelpers.validateFields({
    email: shipping.customPickUp.email,
    date: shipping.datetime.date,
    time: shipping.datetime.time,
  });

  if (Object.keys(formFields).length > 0) {
    req.session.privacyCache.set(currentBasket.defaultShipment.UUID, "invalid");

    res.json({
      form: shipping,
      fieldErrors: [formFields],
      serverErrors: [],
      error: true,
    });
    return next();
  }

  let selectedStoreId = req.form.store || req.session.raw.privacy.storeId;

  if(!selectedStoreId) {
    let message = Resource.msg("error.no.storeid.session", "checkout", null);
    res.json({
      error: true,
      cartError: true,
      fieldErrors: [],
      serverErrors: [],
      redirectUrl: URLUtils.url("Cart-Show", "error", message).toString(),
    });
    return next();
  }

  let existencia = inventory.checkOnlineInventoryMulti(
    currentBasket.productLineItems,
    selectedStoreId
  );
  if (existencia.error) {
    let message = existencia.errors.join("");
    res.json({
      error: true,
      cartError: true,
      fieldErrors: [],
      serverErrors: [],
      redirectUrl: URLUtils.url("Cart-Show", "error", message).toString(),
    });
    return next();
  }

  let geocode;
  let splitedAddress;
  let InsertaPersonaDireccion;
  let body;
  let a;
  let store;
  if (viewData.shippingMethod != "pickup" && viewData.address) {

    if(!isAbleToSD(currentBasket.productLineItems)){
      res.json({
        form: shipping,
        fieldErrors: [],
        serverErrors: [Resource.msgf("error.no.able.to.sd", "checkout", null)],
        error: true,
      });
      return next();
    }


    let totalAddress =
      viewData.address.address1 +
      ", " +
      viewData.address.postalCode +
      " " +
      viewData.address.city +
      ", " +
      viewData.address.stateCode;

    geocode = gMaps.getGeocode({ address: totalAddress });
    if(geocode.error || geocode.status != "OK"){

      res.json({
        form: shipping,
        fieldErrors: [],
        serverErrors: [Resource.msgf("error.google.maps.address", "checkout", null, totalAddress)],
        error: true,
      });
      return next();
    }
    let lat = geocode.results[0].geometry.location.lat;
    let lng = geocode.results[0].geometry.location.lng;

    store = inventory.handleStoreShipping(
      selectedStoreId,
      currentBasket,
      { lat: lat, lng: lng }
    );

    if (!store) {
      res.json({
        error: true,
        cartError: true,
        fieldErrors: [],
        serverErrors: [],
        redirectUrl: URLUtils.url(
          "Cart-Show",
          "error",
          Resource.msg("error.shipping.store.stock", "checkout", null)
        ).toString(),
      });
      return next();
    }

    selectedStoreId = store.ID;

    req.session.privacyCache.set("storeId", selectedStoreId);
    req.session.privacyCache.set("empresaId", store.custom.empresaId);

    splitedAddress = CAHelpers.splitAddress(viewData.address.address1);

    body = {
      IdEmpresa: store.custom.empresaId,
      iIdFolioPersona: 90000,
      iIdCentro: selectedStoreId,
      iIdDireccion: 0,
      iIdFolioDireccion: 0,
      sDireccion: splitedAddress.street,
      sColonia: "",
      sCP: viewData.address.postalCode,
      sTelefono1: viewData.address.phone,
      sTelefono2: "",
      sEntreCalles: "",
      sObservaciones: viewData.address.address2,
      iIdCiudad: 100,
      dLatitud: lat,
      dLongitud: lng,
      sNoInterior: splitedAddress.noInt,
      sNoExterior: splitedAddress.noExt || "",
      iIdUsuario: 10500,
      dtFecha: new Date().toISOString(),
      iTipoDireccion: 3,
      address: totalAddress,
    };

    InsertaPersonaDireccion = ApiLety("InsertaPersonaDireccion", body);
    if (!InsertaPersonaDireccion.error) {
      if(InsertaPersonaDireccion.firstICode == 0){
        res.json({
          form: shipping,
          fieldErrors: [],
          serverErrors: [InsertaPersonaDireccion.firstMessage],
          error: true,
        });
        return next();
      }
      
      if(InsertaPersonaDireccion.iCode == 0){
        res.json({
          form: shipping,
          fieldErrors: [],
          serverErrors: [Resource.msg("shipping.no.coverage", "checkout", null)],
          error: true,
        });
        return next();
      }

      SCHelpers.createDinamycCost(
        parseFloat(InsertaPersonaDireccion.dCost) * -1,
        currentBasket
      );
      SCHelpers.saveRequestInfo(
        InsertaPersonaDireccion.iIdFolioDireccion,
        InsertaPersonaDireccion.sMensaje,
        currentBasket
      );
      
    } else {
      res.json({
        form: shipping,
        fieldErrors: [],
        serverErrors: [Resource.msg("error.server.conection", "checkout", null)],
        error: true,
      });
      return next();
    }
  }

  res.setViewData(viewData);

  Transaction.wrap(() => {
    currentBasket.setCustomerEmail(shipping.customPickUp.email.value);
    currentBasket.custom.storeId = selectedStoreId;
    currentBasket.custom.deliveryDateTime =
      shipping.datetime.date.value + " : " + shipping.datetime.time.value;
  });

  next();
});

server.append("SelectShippingMethod", (req, res, next) => {
  const currentBasket = BasketMgr.getCurrentBasket();
  SCHelpers.removeDinamycCost(currentBasket);
  next();
});

module.exports = server.exports();
