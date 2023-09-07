const server = require("server");
server.extend(module.superModule);
// const letyCartHelper = require("*/cartridge/scripts/cart/letyCartHelpers");
const inventory = require("*/cartridge/scripts/middlewares/inventory");

server.append("Show", (req, res, next) => {
    if (req.querystring.error) {
        let viewData = res.getViewData();
        viewData.valid.error = true;
        viewData.valid.message = req.querystring.error;
        res.setViewData(viewData);
    }
    next();
})

server.replace('AddProduct', inventory.checkOnlineInventory, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var URLUtils = require('dw/web/URLUtils');
    var Transaction = require('dw/system/Transaction');
    var ProductMgr = require("dw/catalog/ProductMgr");
    var CartModel = require('*/cartridge/models/cart');
    var ProductLineItemsModel = require('*/cartridge/models/productLineItems');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');

    let viewData = res.getViewData();
    if (viewData.error) {
        res.json({
            error: viewData.error,
            message: viewData.message,
        })
        return next()
    }

    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var previousBonusDiscountLineItems = currentBasket.getBonusDiscountLineItems();
    var productId = req.form.pid;
    var childProducts = Object.hasOwnProperty.call(req.form, 'childProducts')
        ? JSON.parse(req.form.childProducts)
        : [];
    var options = req.form.options ? JSON.parse(req.form.options) : [];
    var quantity;
    var result;
    var pidsObj;

    var productType = ProductMgr.getProduct(productId).custom.tipoproducto;
    var itemsQ = Number(req.form.quantity);

    if (productType === 'pedido especial' && itemsQ > 1) {
        res.json({
            error: true,
            message: Resource.msg("error.alert.one.item", "product", null)
        });

        return next();
    }

    if (currentBasket.allProductLineItems.length > 0) {
        var productIds = [];
        var allLineItems = currentBasket.allProductLineItems;
        var collections = require("*/cartridge/scripts/util/collections");
        collections.forEach(allLineItems, function (pli) {
            productIds.push(pli);
        });
        var CartProductType = ProductMgr.getProduct(productIds[0].productID).custom.tipoproducto;

        if (CartProductType === 'pedido especial' && productType !== CartProductType) {
            res.json({
                error: true,
                message: Resource.msg("text.alert.split.order", "product", null)
            });
            return next();
        }

        if (CartProductType === 'pedido especial' && productIds[0].quantity.value === 1) {
            res.json({
                error: true,
                message: Resource.msg("error.alert.one.item", "product", null)
            });

            return next();
        }
    }

    if (currentBasket) {
        Transaction.wrap(function () {
            if (!req.form.pidsObj) {
                quantity = parseInt(req.form.quantity, 10);
                result = cartHelper.addProductToCart(
                    currentBasket,
                    productId,
                    quantity,
                    childProducts,
                    options
                );
            } else {
                // product set
                pidsObj = JSON.parse(req.form.pidsObj);
                result = {
                    error: false,
                    message: Resource.msg('text.alert.addedtobasket', 'product', null)
                };

                pidsObj.forEach(function (PIDObj) {
                    quantity = parseInt(PIDObj.qty, 10);
                    var pidOptions = PIDObj.options ? JSON.parse(PIDObj.options) : {};
                    var PIDObjResult = cartHelper.addProductToCart(
                        currentBasket,
                        PIDObj.pid,
                        quantity,
                        childProducts,
                        pidOptions
                    );
                    if (PIDObjResult.error) {
                        result.error = PIDObjResult.error;
                        result.message = PIDObjResult.message;
                    }
                });
            }
            if (!result.error) {
                cartHelper.ensureAllShipmentsHaveMethods(currentBasket);
                basketCalculationHelpers.calculateTotals(currentBasket);
            }
        });
    }

    var quantityTotal = ProductLineItemsModel.getTotalQuantity(currentBasket.productLineItems);
    var cartModel = new CartModel(currentBasket);

    var urlObject = {
        url: URLUtils.url('Cart-ChooseBonusProducts').toString(),
        configureProductstUrl: URLUtils.url('Product-ShowBonusProducts').toString(),
        addToCartUrl: URLUtils.url('Cart-AddBonusProducts').toString()
    };

    var newBonusDiscountLineItem =
        cartHelper.getNewBonusDiscountLineItem(
            currentBasket,
            previousBonusDiscountLineItems,
            urlObject,
            result.uuid
        );
    if (newBonusDiscountLineItem) {
        var allLineItems = currentBasket.allProductLineItems;
        var collections = require('*/cartridge/scripts/util/collections');
        collections.forEach(allLineItems, function (pli) {
            if (pli.UUID === result.uuid) {
                Transaction.wrap(function () {
                    pli.custom.bonusProductLineItemUUID = 'bonus'; // eslint-disable-line no-param-reassign
                    pli.custom.preOrderUUID = pli.UUID; // eslint-disable-line no-param-reassign
                });
            }
        });
    }

    var reportingURL = cartHelper.getReportingUrlAddToCart(currentBasket, result.error);

    res.json({
        reportingURL: reportingURL,
        quantityTotal: quantityTotal,
        message: result.message,
        cart: cartModel,
        newBonusDiscountLineItem: newBonusDiscountLineItem || {},
        error: result.error,
        pliUUID: result.uuid,
        minicartCountOfItems: Resource.msgf('minicart.count', 'common', null, quantityTotal)
    });

    next();
});

server.replace('UpdateQuantity', inventory.checkOnlineInventory, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var Resource = require('dw/web/Resource');
    var Transaction = require('dw/system/Transaction');
    var URLUtils = require('dw/web/URLUtils');
    var CartModel = require('*/cartridge/models/cart');
    var collections = require('*/cartridge/scripts/util/collections');
    var cartHelper = require('*/cartridge/scripts/cart/cartHelpers');
    var basketCalculationHelpers = require('*/cartridge/scripts/helpers/basketCalculationHelpers');
    var collections = require("*/cartridge/scripts/util/collections");
    var ProductMgr = require('dw/catalog/ProductMgr');

    var productIds = [];

    let viewData = res.getViewData();
    if (viewData.error) {
        res.setStatusCode(500);
        res.json({
            error: viewData.error,
            errorMessage: viewData.message,
        })
        return next()
    }

    var currentBasket = BasketMgr.getCurrentBasket();
    var allLineItems = currentBasket.allProductLineItems;

    collections.forEach(allLineItems, function (pli) {
        productIds.push(pli);
    });

    var CartProductType = ProductMgr.getProduct(productIds[0].productID).custom.tipoproducto;

    if (CartProductType === 'pedido especial' && productIds[0].quantity.value === 1) {
        res.setStatusCode(500);
        res.json({
            error: true,
            errorMessage: Resource.msg("error.alert.one.item", "product", null)
        });

        return next();
    }


    if (!currentBasket) {
        res.setStatusCode(500);
        res.json({
            error: true,
            redirectUrl: URLUtils.url('Cart-Show').toString()
        });

        return next();
    }

    var productId = req.querystring.pid;
    var updateQuantity = parseInt(req.querystring.quantity, 10);
    var uuid = req.querystring.uuid;
    var productLineItems = currentBasket.productLineItems;
    var matchingLineItem = collections.find(productLineItems, function (item) {
        return item.productID === productId && item.UUID === uuid;
    });
    var availableToSell = 0;

    var totalQtyRequested = 0;
    var qtyAlreadyInCart = 0;
    var minOrderQuantity = 0;
    var perpetual = false;
    var canBeUpdated = false;
    var bundleItems;
    var bonusDiscountLineItemCount = currentBasket.bonusDiscountLineItems.length;

    if (matchingLineItem) {
        if (matchingLineItem.product.bundle) {
            bundleItems = matchingLineItem.bundledProductLineItems;
            canBeUpdated = collections.every(bundleItems, function (item) {
                var quantityToUpdate = updateQuantity *
                    matchingLineItem.product.getBundledProductQuantity(item.product).value;
                qtyAlreadyInCart = cartHelper.getQtyAlreadyInCart(
                    item.productID,
                    productLineItems,
                    item.UUID
                );
                totalQtyRequested = quantityToUpdate + qtyAlreadyInCart;
                availableToSell = item.product.availabilityModel.inventoryRecord.ATS.value;
                perpetual = item.product.availabilityModel.inventoryRecord.perpetual;
                minOrderQuantity = item.product.minOrderQuantity.value;
                return (totalQtyRequested <= availableToSell || perpetual) &&
                    (quantityToUpdate >= minOrderQuantity);
            });
        } else {
            availableToSell = matchingLineItem.product.availabilityModel.inventoryRecord.ATS.value;
            perpetual = matchingLineItem.product.availabilityModel.inventoryRecord.perpetual;
            qtyAlreadyInCart = cartHelper.getQtyAlreadyInCart(
                productId,
                productLineItems,
                matchingLineItem.UUID
            );
            totalQtyRequested = updateQuantity + qtyAlreadyInCart;
            minOrderQuantity = matchingLineItem.product.minOrderQuantity.value;
            canBeUpdated = (totalQtyRequested <= availableToSell || perpetual) &&
                (updateQuantity >= minOrderQuantity);
        }
    }

    if (canBeUpdated) {
        Transaction.wrap(function () {
            matchingLineItem.setQuantityValue(updateQuantity);

            var previousBounsDiscountLineItems = collections.map(currentBasket.bonusDiscountLineItems, function (bonusDiscountLineItem) {
                return bonusDiscountLineItem.UUID;
            });

            basketCalculationHelpers.calculateTotals(currentBasket);
            if (currentBasket.bonusDiscountLineItems.length > bonusDiscountLineItemCount) {
                var prevItems = JSON.stringify(previousBounsDiscountLineItems);

                collections.forEach(currentBasket.bonusDiscountLineItems, function (bonusDiscountLineItem) {
                    if (prevItems.indexOf(bonusDiscountLineItem.UUID) < 0) {
                        bonusDiscountLineItem.custom.bonusProductLineItemUUID = matchingLineItem.UUID; // eslint-disable-line no-param-reassign
                        matchingLineItem.custom.bonusProductLineItemUUID = 'bonus';
                        matchingLineItem.custom.preOrderUUID = matchingLineItem.UUID;
                    }
                });
            }
        });
    }

    if (matchingLineItem && canBeUpdated) {
        var basketModel = new CartModel(currentBasket);
        res.json(basketModel);
    } else {
        res.setStatusCode(500);
        res.json({
            errorMessage: Resource.msg('error.cannot.update.product.quantity', 'cart', null)
        });
    }

    return next();
});

server.get("OnlineInventory", (req, res, next) => {
    const { ApiLety } = require("*/cartridge/scripts/jobs/api");
    const StoreMgr = require('dw/catalog/StoreMgr');

    let pid = req.querystring.pid;
    let storeId = req.session.raw.privacy.storeId;

    if (req.querystring.storeId) {
        storeId = req.querystring.storeId;
    }

    let store = StoreMgr.getStore(storeId);

    let today = new Date();
    today.setMinutes(today.getMinutes() + 1);
    let existencia = ApiLety("ExistenciaPorCentroFecha", {
        Empresa: store.custom.empresaId,
        iIdMaterial: parseInt(pid),
        iIdCentro: parseInt(storeId),
        dtFecha: today.toISOString(),
    });
    res.json({
        existencia: existencia,
        errorMessage: existencia.errorMessage,
        pid: pid,
        storeId: storeId
    })
    next();
})

module.exports = server.exports();
