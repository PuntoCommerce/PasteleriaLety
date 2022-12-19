const base = module.superModule
var Site = require('dw/system/Site');
var Resource = require('dw/web/Resource');
/**
 * Sends a confirmation to the current user
 * @param {dw.order.Order} order - The current user's order
 * @param {string} locale - the current request's locale id
 * @returns {void}
 */
function sendConfirmationEmailClient(order, locale, storeId) {
    var OrderModel = require('*/cartridge/models/order');
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Locale = require('dw/util/Locale');
    var StoreMgr = require('dw/catalog/StoreMgr');
    var email;
    if (storeId) {
    var store = StoreMgr.getStore(storeId);
    email = store.email;
    }

    var currentLocale = Locale.getLocale(locale);

    var orderModel = new OrderModel(order, { countryCode: currentLocale.country, containerView: 'order' });

    var orderObject = { order: orderModel };


    var emailObj = {
        to: email,
        subject: Resource.msg('subject.order.confirmation.email', 'order', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.orderConfirmation
    };

    emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationEmail', orderObject);
}

base.sendConfirmationEmailClient=sendConfirmationEmailClient;

module.exports = base;
