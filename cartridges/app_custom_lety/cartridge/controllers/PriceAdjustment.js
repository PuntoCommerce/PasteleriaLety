const server = require("server");
var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');
var AmountDiscount = require('dw/campaign/AmountDiscount');
var ProductLineItem = require('dw/order/ProductLineItem');

const renderTemplateHelper = require("*/cartridge/scripts/renderTemplateHelper");
var OrderModel = require('*/cartridge/models/order');
var Locale = require("dw/util/Locale");

const { removeLetyPuntos } = require("*/cartridge/scripts/helpers/letyCardHelpers");

var COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers");
var Site = require('dw/system/Site');
server.post("LetyPuntos", (req, res, next) => {

    const currentBasket = BasketMgr.getCurrentBasket();

    const letyPuntosPromotionId = Site.getCurrent().getCustomPreferenceValue("letyPuntosPromotionId");
    const {
        toAjustment,
        member
    } = req.form;
    let result;
    let code;
    let err;
    try {
        let letyPuntosAmount = Number(toAjustment);
        Transaction.wrap(function (params) {
            currentBasket.createPriceAdjustment(letyPuntosPromotionId, AmountDiscount(letyPuntosAmount));
            currentBasket.custom.letyPuntosAmount = letyPuntosAmount;
            currentBasket.custom.letyPuntosCard = member;
        });

        COHelpers.recalculateBasket(currentBasket); // update
        code = 0;
        err = "Sin error";

    } catch (error) {
        err = error;
        code = 1;
        result = "";
    }

    var currentLocale = Locale.getLocale(req.locale.id);

    var orderModel = new OrderModel(
        currentBasket, {
            usingMultiShipping: false,
            shippable: true,
            countryCode: currentLocale.country,
            containerView: 'basket'
        }
    );
    let renderedTotas = renderTemplateHelper.getRenderedHtml({
            order: orderModel
        },
        "checkout/orderTotalSummary"
    );

    // dela forma viejita.
    res.json({
        body: toAjustment,
        err: err,
        code: code,
        renderedTotas: renderedTotas
    })

    next();
});
server.post("RemoveLetyPuntos", (req, res, next) => {
    /*
        Si se intenta remover el ajuste de precio si haber agregado antes, lanzara una excepcion.
        validar que solo aplique si existe.
    */
    const letyPuntosPromotionId = Site.getCurrent().getCustomPreferenceValue("letyPuntosPromotionId");


    let removed = removeLetyPuntos(req.locale.id, letyPuntosPromotionId)
    
    let renderedTotas = renderTemplateHelper.getRenderedHtml({
            order: removed.orderModel
        },
        "checkout/orderTotalSummary"
    );

    res.json({
        err: removed.err,
        code: removed.code,
        response: removed.result,
        renderedTotas: renderedTotas
    });

    next();
});
module.exports = server.exports();