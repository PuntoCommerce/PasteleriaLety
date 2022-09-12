var OrderMgr = require("dw/order/OrderMgr");
var Order = require("dw/order/Order");
var Transaction = require("dw/system/Transaction");
var Resource = require('dw/web/Resource');
var emailHelpers = require('~/cartridge/scripts/helpers/emailHelpers');
var updateEmailStatus = require('~/cartridge/scripts/helpers/emailStatusMgr');
var Site = require('dw/system/Site');

/*
  Search all orders that was created 7 day ago to check the payment status and update it
  Order *custom order shipping status* values list:
    orderShipped  :  boolean = false
    shippedOrderNotified :  boolean = false
    orderShippingDelivered :  boolean = false
    deliveredOrderNotified :  boolean = false
 */

const execute = () => {

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 7);

    let orders = OrderMgr.searchOrders(
        "creationDate > {0}",
        "creationDate desc",
        currentDate
    );

    for each(order in orders) {
        let orderShipped = order.custom.orderShipped;
        let shippedOrderNotified = order.custom.shippedOrderNotified;
        let orderShippingDelivered = order.custom.orderShippingDelivered;
        let deliveredOrderNotified = order.custom.deliveredOrderNotified;

        if(orderShipped && !shippedOrderNotified) {
        let orderData = order;

        var emailObj = {
            to: orde.customerEmail,
            subject: Resource.msg('subject.order.shipped.email', 'order', null),
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
            type: emailHelpers.emailTypes.orderShipped
        };

        emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationOrderTrack', {
            order: orderData
        });

        updateEmailStatus.setShippedNotified(order);
    }

    if (orderShippingDelivered && !deliveredOrderNotified) {
        let orderData = order;

        var emailObj = {
            to: orde.customerEmail,
            subject: Resource.msg('subject.order.delivered.email', 'order', null),
            from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
            type: emailHelpers.emailTypes.orderShipped
        };

        emailHelpers.sendEmail(emailObj, 'checkout/confirmation/confirmationDelivery', {
            order: orderData
        });

        updateEmailStatus.setDeliveredNotified(order);
    }
};
};

exports.execute = execute;

