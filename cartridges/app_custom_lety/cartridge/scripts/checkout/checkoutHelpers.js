const base = module.superModule
var Site = require('dw/system/Site');
var Resource = require('dw/web/Resource');
var collections = require('*/cartridge/scripts/util/collections');

var BasketMgr = require('dw/order/BasketMgr');
var HookMgr = require('dw/system/HookMgr');
var OrderMgr = require('dw/order/OrderMgr');
var PaymentInstrument = require('dw/order/PaymentInstrument');
var PaymentMgr = require('dw/order/PaymentMgr');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var Site = require('dw/system/Site');
var Transaction = require('dw/system/Transaction');

var AddressModel = require('*/cartridge/models/address');
var formErrors = require('*/cartridge/scripts/formErrors');

var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');
var ShippingHelper = require('*/cartridge/scripts/checkout/shippingHelpers');

var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');


function copyBillingAddressToBasket(address, currentBasket) {
    var billingAddress = currentBasket.billingAddress;

    Transaction.wrap(function () {
        if (!billingAddress) {
            billingAddress = currentBasket.createBillingAddress();
        }

        billingAddress.setFirstName(address.firstName);
        billingAddress.setLastName(address.lastName);
        billingAddress.setAddress1(address.address1);
        billingAddress.setAddress2(address.address2);
        billingAddress.setCity(address.city);
        billingAddress.setPostalCode(address.postalCode);
        billingAddress.setStateCode(address.stateCode);
        billingAddress.setCountryCode(address.countryCode.value);
        billingAddress.setSuite(address.suite)
        billingAddress.setPostBox(address.postBox)
        if (!billingAddress.phone) {
            billingAddress.setPhone(address.phone);
        }
    });
}

function copyShippingAddressToShipment(shippingData, shipmentOrNull) {
    var currentBasket = BasketMgr.getCurrentBasket();
    var shipment = shipmentOrNull || currentBasket.defaultShipment;

    var shippingAddress = shipment.shippingAddress;

    Transaction.wrap(function () {
        if (shippingAddress === null) {
            shippingAddress = shipment.createShippingAddress();
        }

        shippingAddress.setFirstName(shippingData.address.firstName);
        shippingAddress.setLastName(shippingData.address.lastName);
        shippingAddress.setAddress1(shippingData.address.address1);
        shippingAddress.setAddress2(shippingData.address.address2);
        shippingAddress.setCity(shippingData.address.city);
        shippingAddress.setPostalCode(shippingData.address.postalCode);
        shippingAddress.setStateCode(shippingData.address.stateCode);
        var countryCode = shippingData.address.countryCode.value ? shippingData.address.countryCode.value : shippingData.address.countryCode;
        shippingAddress.setCountryCode(countryCode);
        shippingAddress.setPhone(shippingData.address.phone);
        shippingAddress.setSuite(shippingData.address.suite)
        shippingAddress.setPostBox(shippingData.address.postBox)

        ShippingHelper.selectShippingMethod(shipment, shippingData.shippingMethod);
    });
}

function copyCustomerAddressToShipment(address, shipmentOrNull) {
        var currentBasket = BasketMgr.getCurrentBasket();
        var shipment = shipmentOrNull || currentBasket.defaultShipment;
        var shippingAddress = shipment.shippingAddress;

        Transaction.wrap(function () {
            if (shippingAddress === null) {
                shippingAddress = shipment.createShippingAddress();
            }

            shippingAddress.setFirstName(address.firstName);
            shippingAddress.setLastName(address.lastName);
            shippingAddress.setAddress1(address.address1);
            shippingAddress.setAddress2(address.address2);
            shippingAddress.setCity(address.city);
            shippingAddress.setPostalCode(address.postalCode);
            shippingAddress.setStateCode(address.stateCode);
            var countryCode = address.countryCode;
            shippingAddress.setCountryCode(countryCode.value);
            shippingAddress.setPhone(address.phone);
            shippingAddress.setSuite(address.suite)
            shippingAddress.setPostBox(address.postBox)
        });
}

function copyCustomerAddressToBilling(address) {
        var currentBasket = BasketMgr.getCurrentBasket();
        var billingAddress = currentBasket.billingAddress;

        Transaction.wrap(function () {
            if (!billingAddress) {
                billingAddress = currentBasket.createBillingAddress();
            }

            billingAddress.setFirstName(address.firstName);
            billingAddress.setLastName(address.lastName);
            billingAddress.setAddress1(address.address1);
            billingAddress.setAddress2(address.address2);
            billingAddress.setCity(address.city);
            billingAddress.setPostalCode(address.postalCode);
            billingAddress.setStateCode(address.stateCode);
            var countryCode = address.countryCode;
            billingAddress.setCountryCode(countryCode.value);
            billingAddress.setSuite(address.suite)
            billingAddress.setPostBox(address.postBox)

            if (!billingAddress.phone) {
                billingAddress.setPhone(address.phone);
            }
        });
}

//=================================

function sendConfirmationEmail(order, locale, storeId) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Locale = require('dw/util/Locale');
    var StoreMgr = require('dw/catalog/StoreMgr');

    var store = StoreMgr.getStore(storeId);
    var currentLocale = Locale.getLocale(locale);
    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order', store: store });
    var orderObject = { order: orderModel, store: store };

    var emailObj = {
        to: order.customerEmail,
        subject: Resource.msg('subject.order.confirmation.email', 'order', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.orderConfirmation
    };

    emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationEmail', orderObject);
}

function sendConfirmationEmailClient(order, locale, storeId) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Locale = require('dw/util/Locale');
    var StoreMgr = require('dw/catalog/StoreMgr');

    var store = StoreMgr.getStore(storeId);
    var currentLocale = Locale.getLocale(locale);
    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order' });
    var orderObject = { order: orderModel, store: store };
    var email = store.email;

    var emailObj = {
        to: email,
        subject: Resource.msg('subject.order.confirmation.email', 'order', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.orderConfirmation
    };

    emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationEmail', orderObject);
}

/**
 * Sends a confirmation to the current user
 * @param {dw.order.Order} order - The current user's order
 * @param {string} locale - the current request's locale id
 * @returns {void}
 */
function sendConfirmationEmailClientSecund(order, locale, storeId) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Locale = require('dw/util/Locale');
    var StoreMgr = require('dw/catalog/StoreMgr');

    var store = StoreMgr.getStore(storeId);
    var currentLocale = Locale.getLocale(locale);
    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order' });
    var orderObject = { order: orderModel, store: store };

    var emailObj = {
        to: "admon.tiendaonline@pastelerialety.com",
        subject: Resource.msg('subject.order.confirmation.email', 'order', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.orderConfirmation
    };

    emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationEmail', orderObject);
}

base.copyCustomerAddressToShipment = copyCustomerAddressToShipment;
base.copyCustomerAddressToBilling = copyCustomerAddressToBilling;
base.copyShippingAddressToShipment = copyShippingAddressToShipment;
base.copyBillingAddressToBasket = copyBillingAddressToBasket;
base.sendConfirmationEmail = sendConfirmationEmail
base.sendConfirmationEmailClient = sendConfirmationEmailClient;
base.sendConfirmationEmailClientSecund = sendConfirmationEmailClientSecund;

module.exports = base;
