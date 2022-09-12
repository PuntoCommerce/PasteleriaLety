const Transaction = require("dw/system/Transaction");

const setCancelledOrderNotified = (order) => {
    const result = { error: false, message: {} };
    try {
        Transaction.wrap(() => {
            order.custom.cancelledOrderNotified = true;
        });
    } catch (error) {
        result.error = true;
        result.message = error;
    }
    return result;
};

const setShippedNotified = (order) => {
    const result = { error: false, message: {} };
    try {
        Transaction.wrap(() => {
            order.custom.shippedOrderNotified = true;
        });
    } catch (error) {
        result.error = true;
        result.message = error;
    }
    return result;
};

const setDeliveredNotified = (order) => {
    const result = { error: false, message: {} };
    try {
        Transaction.wrap(() => {
            order.custom.deliveredOrderNotified = true;
        });
    } catch (error) {
        result.error = true;
        result.message = error;
    }
    return result;
};

module.exports = {
    setCancelledOrderNotified: setCancelledOrderNotified,
    setShippedNotified: setShippedNotified,
    setDeliveredNotified: setDeliveredNotified
};
