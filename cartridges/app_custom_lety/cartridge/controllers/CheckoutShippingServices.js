const server = require("server");
server.extend(module.superModule);
const BasketMgr = require("dw/order/BasketMgr");
const COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers");
const Transaction = require("dw/system/Transaction");

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

  shipping.customPickUp.email.valid = validateEmail(
    shipping.customPickUp.email.value
  );

  let customPickUpErrors = COHelpers.validateShippingForm(
    shipping.customPickUp
  );

  if (Object.keys(customPickUpErrors).length > 0) {
    req.session.privacyCache.set(currentBasket.defaultShipment.UUID, "invalid");

    viewData = {
      form: shipping,
      fieldErrors: [customPickUpErrors],
      serverErrors: [],
      error: true,
    };
    res.setViewData(viewData);
    return next();
  }

  Transaction.wrap(() => {
    let pickUpId = viewData.storeId;
    // let shipment = currentBasket.defaulShipment.shippingAddress;
    let result = {
      address: {
        firstName: shipping.customPickUp.firstName.value,
        lastName: shipping.customPickUp.lastName.value,
        phone: shipping.customPickUp.phone.value,
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        countryCode: "MX",
      },
    };

    COHelpers.copyShippingAddressToShipment(
      result,
      currentBasket.defaultShipment
    );
    currentBasket.setCustomerEmail(shipping.customPickUp.email.value);
    currentBasket.custom.pickupInStoreId = pickUpId;
    currentBasket.custom.deliveryDateTime =
      shipping.datetime.date.value + " : " + shipping.datetime.time.value;
  });

  next();
});

module.exports = server.exports();
