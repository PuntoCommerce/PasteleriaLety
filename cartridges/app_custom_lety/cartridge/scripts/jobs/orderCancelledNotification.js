var OrderMgr = require("dw/order/OrderMgr");
var Order = require("dw/order/Order");
var Transaction = require("dw/system/Transaction");
var Resource = require('dw/web/Resource');
var emailHelpers = require('~/cartridge/scripts/helpers/emailHelpers');
var updateEmailStatus = require('~/cartridge/scripts/helpers/emailStatusMgr');
var Site = require('dw/system/Site');

/*
  Search all orders that was created 7 day ago to check the payment status and update it
  Order status values list:
    ORDER_STATUS_CANCELLED  :  Number = 6
    constant for when Order Status is Cancelled
    ORDER_STATUS_COMPLETED  :  Number = 5
    constant for when Order Status is Completed
    ORDER_STATUS_CREATED  :  Number = 0
    constant for when Order Status is Created
    ORDER_STATUS_FAILED  :  Number = 8
    constant for when Order Status is Failed
    ORDER_STATUS_NEW  :  Number = 3
    constant for when Order Status is New
    ORDER_STATUS_OPEN  :  Number = 4
    constant for when Order Status is Open
    ORDER_STATUS_REPLACED  :  Number = 7
    constant for when Order Status is Replaced
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
        let orderNotified = order.custom.cancelledOrderNotified;

        if(order.status.value == 6 && !orderNotified) {
            let orderData = order;

            var emailObj = {
                to: orde.customerEmail,
                subject: Resource.msg('subject.order.cancellation.email', 'order', null),
                from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
                type: emailHelpers.emailTypes.orderCancelled
            };

            emailHelpers.sendEmail(emailObj, 'checkout/cancellation/confirmationOrderCancel', {
                order: orderData
            });

            updateEmailStatus.setCancelledOrderNotified(order);
        }
    };
};

exports.execute = execute;
