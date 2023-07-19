
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
var csrfProtection = require("*/cartridge/scripts/middleware/csrf");
var CustomerMgr = require('dw/customer/CustomerMgr');
const mapsApi = require("*/cartridge/scripts/googleMaps/api");

const validateEmail = (email) => {
  if (!email) {
    return false;
  }
  return true;
};

server.append("SubmitShipping", (req, res, next) => {
  let storeId = req.form.store || req.session.raw.privacy.storeId;
  const currentBasket = BasketMgr.getCurrentBasket();
  const storeForm = server.forms.getForm('shipping');
  const { firstName, lastName } = storeForm.shippingAddress.addressFields
  req.session.privacyCache.set("customerFirstName", firstName.htmlValue)
  req.session.privacyCache.set("customerLastName", lastName.htmlValue)

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
  var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');
  const shipping = server.forms.getForm("shipping");
  const currentBasket = BasketMgr.getCurrentBasket();
  var customer;
  // const currentUser = req.currentCustomer.profile;

  let viewData = res.getViewData();

  if (req.currentCustomer.profile) {
    customer = CustomerMgr.getProfile(req.currentCustomer.profile.customerNo);
  }

  if (req.currentCustomer.profile && !customer.custom.folPerson) {
    accountHelpers.insertFolPerson(req.currentCustomer.profile);
  }

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

  if (!selectedStoreId) {
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
  let concatAddress;
  let InsertaPersonaDireccion;
  let body;
  let a;
  let store;

  if (viewData.shippingMethod != "pickup" && viewData.address) {

    if (!isAbleToSD(currentBasket.productLineItems)) {
      res.json({
        form: shipping,
        fieldErrors: [],
        serverErrors: [Resource.msgf("error.no.able.to.sd", "checkout", null)],
        error: true,
      });
      return next();
    }

    const coords = JSON.parse(req.session.privacyCache.get('coords'))

    let totalAddress =
      viewData.address.address1 +
      ' ' +
      viewData.address.suite +
      ", " +
      viewData.address.address2 +
      ", " +
      viewData.address.postalCode +
      " " +
      viewData.address.city +
      ", " +
      viewData.address.stateCode;

    const addressFinal = totalAddress;

    geocode = gMaps.getGeocode({ address: totalAddress });
    if (geocode.error || geocode.status != "OK") {

      res.json({
        form: shipping,
        fieldErrors: [],
        serverErrors: [Resource.msgf("error.google.maps.address", "checkout", null, totalAddress)],
        error: true,
      });
      return next();
    }
    let lat = coords.lat ? coords.lat : geocode.results[0].geometry.location.lat;
    let lng = coords.lng ? coords.lng : geocode.results[0].geometry.location.lng;

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
    req.session.privacyCache.set("customerFirstName", viewData.address.firstName)
    req.session.privacyCache.set("customerLastName", viewData.address.lastName)

    splitedAddress = CAHelpers.splitAddress(viewData.address);

    body = {
      IdEmpresa: store.custom.empresaId,
      iIdFolioPersona: req.currentCustomer.profile && customer.custom.folPerson ? customer.custom.folPerson : 90000,
      iIdCentro: selectedStoreId,
      iIdDireccion: 0,
      iIdFolioDireccion: 0,
      sDireccion: splitedAddress.street,
      sColonia: viewData.address.address2,
      sCP: viewData.address.postalCode,
      sTelefono1: viewData.address.phone,
      sTelefono2: "",
      sEntreCalles: "",
      sObservaciones: viewData.address.postBox,
      iIdCiudad: 100,
      dLatitud: lat,
      dLongitud: lng,
      sNoInterior: splitedAddress.noInt,
      sNoExterior: viewData.address.suite || "",
      iIdUsuario: 10500,
      dtFecha: new Date().toISOString(),
      iTipoDireccion: 3,
      address: totalAddress,
    };

    InsertaPersonaDireccion = ApiLety("InsertaPersonaDireccion", body);
    if (!InsertaPersonaDireccion.error) {
      if (InsertaPersonaDireccion.firstICode == 0) {
        res.json({
          form: shipping,
          fieldErrors: [],
          serverErrors: [InsertaPersonaDireccion.firstMessage],
          error: true,
        });
        return next();
      }

      if (InsertaPersonaDireccion.iCode == 0) {
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


/**
 * CheckoutShippingServices-UpdateShippingMethodsList : The CheckoutShippingServices-UpdateShippingMethodsList endpoint gets hit once a shopper has entered certain address infromation and gets the applicable shipping methods based on the shopper's supplied shipping address infromation
 * @name Base/CheckoutShippingServices-UpdateShippingMethodsList
 * @function
 * @memberof CheckoutShippingServices
 * @param {middleware} - server.middleware.https
 * @param {querystringparameter} - shipmentUUID - the universally unique identifier of the shipment
 * @param {httpparameter} - firstName - shipping address input field, shopper's shipping first name
 * @param {httpparameter} - lastName - shipping address input field, shopper's last name
 * @param {httpparameter} - address1 - shipping address input field, address line 1
 * @param {httpparameter} - address2 - shipping address nput field address line 2
 * @param {httpparameter} - city - shipping address input field, city
 * @param {httpparameter} - postalCode -  shipping address input field, postal code (or zipcode)
 * @param {httpparameter} - stateCode - shipping address input field, state code (Not all locales have state code)
 * @param {httpparameter} - countryCode -  shipping address input field, country
 * @param {httpparameter} - phone - shipping address input field, shopper's phone number
 * @param {httpparameter} - shipmentUUID - The universally unique identifier of the shipment
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.append(
  "UpdateShippingMethodsList",
  server.middleware.https,
  function (req, res, next) {
    var BasketMgr = require("dw/order/BasketMgr");
    var Transaction = require("dw/system/Transaction");
    var AccountModel = require("*/cartridge/models/account");
    var OrderModel = require("*/cartridge/models/order");
    var URLUtils = require("dw/web/URLUtils");
    var ShippingHelper = require("*/cartridge/scripts/checkout/shippingHelpers");
    var Locale = require("dw/util/Locale");
    var basketCalculationHelpers = require("*/cartridge/scripts/helpers/basketCalculationHelpers");

    var currentBasket = BasketMgr.getCurrentBasket();

    if (!currentBasket) {
      res.json({
        error: true,
        cartError: true,
        fieldErrors: [],
        serverErrors: [],
        redirectUrl: URLUtils.url("Cart-Show").toString(),
      });
      return next();
    }

    var shipmentUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;
    var shipment;
    if (shipmentUUID) {
      shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipmentUUID);
    } else {
      shipment = currentBasket.defaultShipment;
    }
    var address = ShippingHelper.getAddressFromRequest(req);

    var shippingMethodID;

    if (shipment.shippingMethod) {
      shippingMethodID = shipment.shippingMethod.ID;
    }

    Transaction.wrap(function () {
      var shippingAddress = shipment.shippingAddress;

      if (!shippingAddress) {
        shippingAddress = shipment.createShippingAddress();
      }

      Object.keys(address).forEach(function (key) {
        var value = address[key];
        if (value) {
          shippingAddress[key] = value;
        } else {
          shippingAddress[key] = null;
        }
      });

      ShippingHelper.selectShippingMethod(shipment, shippingMethodID);

      basketCalculationHelpers.calculateTotals(currentBasket);
    });

    var usingMultiShipping = req.session.privacyCache.get("usingMultiShipping");
    var currentLocale = Locale.getLocale(req.locale.id);

    var basketModel = new OrderModel(currentBasket, {
      usingMultiShipping: usingMultiShipping,
      countryCode: currentLocale.country,
      containerView: "basket",
    });

    res.json({
      customer: new AccountModel(req.currentCustomer),
      order: basketModel
    });

    return next();
  }
);

server.post("GoogelMapAddress", function (req, res, next) {
  var templateHelper = require("*/cartridge/scripts/renderTemplateHelper");
  var latitude = req.form.lat;
  var longitude = req.form.lng;
  var myLatLng = { lat: latitude, lng: longitude };
  var getCoordsUrl = URLUtils.url('CheckoutShippingServices-GetCoords')
  req.session.privacyCache.set('coords', JSON.stringify(myLatLng))
  res.render('checkout/shipping/googlemap', {
    googleMapTemplate: myLatLng,
    url: getCoordsUrl
  })
  next();
});

server.post('GetCoords', function (req, res, next) {
  const coords = JSON.parse(req.body);
  const viewData = res.getViewData()

  viewData.coords = coords

  req.session.privacyCache.set('coords', req.body)


  res.json({ message: 'success' })

  next();
})

module.exports = server.exports();
