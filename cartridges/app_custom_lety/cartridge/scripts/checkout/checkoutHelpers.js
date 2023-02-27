const base = module.superModule
var Site = require('dw/system/Site');
var Resource = require('dw/web/Resource');

function sendConfirmationEmail(order, locale, storeId) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Locale = require('dw/util/Locale');
    var StoreMgr = require('dw/catalog/StoreMgr');

    var store = StoreMgr.getStore(storeId);
    var currentLocale = Locale.getLocale(locale);
    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order', store: store});
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

/**
 * Sends a confirmation to the current user
 * @param {dw.order.Order} order - The current user's order
 * @param {string} locale - the current request's locale id
 * @returns {void}
 */
function sendConfirmationEmailClientThird(order, locale, storeId) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Locale = require('dw/util/Locale');
    var StoreMgr = require('dw/catalog/StoreMgr');

    var store = StoreMgr.getStore(storeId);
    var currentLocale = Locale.getLocale(locale);
    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order' });
    var orderObject = { order: orderModel, store: store };

    var emailObj = {
        to: "ealvarez@pastelerialety.com",
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
function sendConfirmationEmailClientFourth(order, locale, storeId) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Locale = require('dw/util/Locale');
    var StoreMgr = require('dw/catalog/StoreMgr');

    var store = StoreMgr.getStore(storeId);
    var currentLocale = Locale.getLocale(locale);
    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order' });
    var orderObject = { order: orderModel, store: store };

    var emailObj = {
        to: "yflores@pastelerialety.com",
        subject: Resource.msg('subject.order.confirmation.email', 'order', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.orderConfirmation
    };

    emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationEmail', orderObject);
}

base.sendConfirmationEmail = sendConfirmationEmail
base.sendConfirmationEmailClient = sendConfirmationEmailClient;
base.sendConfirmationEmailClientSecund = sendConfirmationEmailClientSecund;
base.sendConfirmationEmailClientThird = sendConfirmationEmailClientThird;
base.sendConfirmationEmailClientThird = sendConfirmationEmailClientFourth;

module.exports = base;
