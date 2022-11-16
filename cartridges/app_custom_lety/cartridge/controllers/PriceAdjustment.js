const server = require("server");

var BasketMgr = require('dw/order/BasketMgr');

server.post("LetyPuntos", (req, res, next) => {
    const currentBasket = BasketMgr.getCurrentBasket();
    const {toAjustment, member} = req.form;

    res.json({
        status: "ok",
        body: toAjustment
    })

    next();
});

module.exports = server.exports();