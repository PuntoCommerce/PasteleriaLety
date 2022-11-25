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

  // Transaction.wrap(() => {
  //   let pickUpId = viewData.storeId;
  //   currentBasket.setCustomerEmail(shipping.customPickUp.email.value);
  //   currentBasket.custom.pickupInStoreId = pickUpId;
  //   currentBasket.custom.deliveryDateTime =
  //     shipping.datetime.date.value + " : " + shipping.datetime.time.value;
  // });

  next();
});

module.exports = server.exports();
