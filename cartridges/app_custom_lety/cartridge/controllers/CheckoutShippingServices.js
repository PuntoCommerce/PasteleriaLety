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

const validateEmail = (email) => {
  if (!email) {
    return false;
  }
  return true;
};

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
  }

  let storeId = req.session.raw.privacy.storeId;
  Transaction.wrap(() => {
    currentBasket.setCustomerEmail(shipping.customPickUp.email.value);
    currentBasket.custom.storeId = storeId;
    currentBasket.custom.deliveryDateTime =
      shipping.datetime.date.value + " : " + shipping.datetime.time.value;
  });

  let geocode;
  let splitedAddress;
  let InsertaPersonaDireccion;
  let body;
  let a;
  if (viewData.shippingMethod != "pickup" && viewData.address) {
    let totalAddress =
      viewData.address.address1 +
      ", " +
      viewData.address.postalCode +
      " " +
      viewData.address.city +
      ", " +
      viewData.address.stateCode;

    geocode = gMaps.getGeocode([{ key: "address", value: totalAddress }]);
    let lat = 0;
    let lng = 0;
    if (geocode.status == "OK") {
      lat = geocode.results[0].geometry.location.lat;
      lng = geocode.results[0].geometry.location.lng;
    }

    splitedAddress = CAHelpers.splitAddress(viewData.address.address1);

    body = {
      IdEmpresa: 1,
      iIdFolioPersona: 90000,
      iIdCentro: parseInt(storeId),
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
      iTipoDireccion: 0,
      address: totalAddress,
    };

    InsertaPersonaDireccion = ApiLety("InsertaPersonaDireccion", body);
    if (!InsertaPersonaDireccion.error) {
      SCHelpers.createDinamycCost(
        parseFloat(InsertaPersonaDireccion.dCost) * -1,
        currentBasket
      );
      SCHelpers.saveRequestInfo(
        InsertaPersonaDireccion.iIdFolioDireccion,
        InsertaPersonaDireccion.sMensaje,
        currentBasket
      );
      COHelpers.recalculateBasket(currentBasket);
    }
  }

  next();
});

module.exports = server.exports();
