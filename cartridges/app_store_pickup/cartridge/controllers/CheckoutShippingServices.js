"use strict";

var server = require("server");
server.extend(module.superModule);

server.prepend("SubmitShipping", function (req, res, next) {
  var BasketMgr = require("dw/order/BasketMgr");
  var ShippingHelper = require("*/cartridge/scripts/checkout/shippingHelpers");

  var currentBasket = BasketMgr.getCurrentBasket();
  var shipmentUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;
  var shipment;

  if (shipmentUUID) {
    shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipmentUUID);
  } else {
    shipment = currentBasket.defaultShipment;
  }

  /* eslint-disable no-shadow */
  // eslint-disable-next-line no-unused-vars
  this.on(
    "route:BeforeComplete",
    function (req, res) {
      ShippingHelper.markShipmentForShipping(shipment);
    },
    this
  );
  /* eslint-enable no-shadow */

  return next();
});

server.append("SubmitShipping", function (req, res, next) {
  var BasketMgr = require("dw/order/BasketMgr");
  var Resource = require("dw/web/Resource");
  var Transaction = require("dw/system/Transaction");
  var ShippingHelper = require("*/cartridge/scripts/checkout/shippingHelpers");
  const COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers")


  var currentBasket = BasketMgr.getCurrentBasket();
  var shipmentUUID = req.querystring.shipmentUUID || req.form.shipmentUUID;
  var shipment;

  if (shipmentUUID) {
    shipment = ShippingHelper.getShipmentByUUID(currentBasket, shipmentUUID);
  } else {
    shipment = currentBasket.defaultShipment;
  }

  if (shipment.shippingMethodID == "pickup") {
    if (!req.form.store) {
      res.setStatusCode(500);
      res.json({
        error: true,
        errorMessage: Resource.msg(
          "error.no.store.selected",
          "storeLocator",
          null
        ),
      });
    } else {
      var viewData = res.getViewData();
      delete viewData.fieldErrors;
      let sForm = server.forms.getForm("shipping");

      let pickupFields = COHelpers.validateFields({
        firstName: sForm.shippingAddress.addressFields.firstName,
        lastName: sForm.shippingAddress.addressFields.lastName,
        phne: sForm.shippingAddress.addressFields.phone,
      })

      if(Object.keys(pickupFields).length > 0) {
        req.session.privacyCache.set(currentBasket.defaultShipment.UUID, 'invalid');
        res.json({
            form: sForm,
            fieldErrors: [pickupFields],
            serverErrors: [],
            error: true
        });
        return next();
      }

      viewData.error = false;
      viewData.shipmentUUID = req.form.shipmentUUID;
      viewData.storeId = req.form.store;
      viewData.shippingMethod = shipment.shippingMethodID;

      res.setViewData(viewData);

      this.on("route:BeforeComplete", function (req, res) {
        var StoreMgr = require("dw/catalog/StoreMgr");
        var Locale = require("dw/util/Locale");
        var OrderModel = require("*/cartridge/models/order");
        var AccountModel = require("*/cartridge/models/account");
        var COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers");

        var viewData = res.getViewData();

        var storeId = viewData.storeId;
        var store = StoreMgr.getStore(storeId);
        var viewDataShipmentUUID = viewData.shipmentUUID;
        var viewDataShipment = viewDataShipmentUUID
          ? ShippingHelper.getShipmentByUUID(
              currentBasket,
              viewDataShipmentUUID
            )
          : currentBasket.defaultShipment;

        if (storeId) {
          ShippingHelper.markShipmentForPickup(viewDataShipment, storeId);
          req.session.privacyCache.set("storeId", storeId);


          Transaction.wrap(function () {
            var storeAddress = {
              address: {
                firstName: sForm.shippingAddress.addressFields.firstName.value,
                lastName: sForm.shippingAddress.addressFields.lastName.value,
                address1: store.address1,
                address2: storeId,
                city: store.city,
                stateCode: store.stateCode || "NA",
                postalCode: store.postalCode,
                countryCode: store.countryCode.value,
                phone: sForm.shippingAddress.addressFields.phone.value,
              },
              shippingMethod: viewData.shippingMethod,
            };
            COHelpers.copyShippingAddressToShipment(
              storeAddress,
              viewDataShipment
            );

            COHelpers.setGift(viewDataShipment, false, null);
          });
        }

        COHelpers.recalculateBasket(currentBasket);

        var usingMultiShipping =
          req.session.privacyCache.get("usingMultiShipping");
        if (usingMultiShipping === true && currentBasket.shipments.length < 2) {
          req.session.privacyCache.set("usingMultiShipping", false);
          usingMultiShipping = false;
        }

        var currentLocale = Locale.getLocale(req.locale.id);
        var basketModel = new OrderModel(currentBasket, {
          usingMultiShipping: usingMultiShipping,
          shippable: true,
          countryCode: currentLocale.country,
          containerView: "basket",
        });

        res.json({
          customer: new AccountModel(req.currentCustomer),
          order: basketModel,
          form: sForm,
        });
      });
      /* eslint-enable no-shadow */
    }
  }
  next();
});

module.exports = server.exports();
