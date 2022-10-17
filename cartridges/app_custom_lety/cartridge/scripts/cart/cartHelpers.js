const base = module.superModule;

var ProductMgr = require('dw/catalog/ProductMgr');
var Resource = require('dw/web/Resource');
var productHelper = require('*/cartridge/scripts/helpers/productHelpers');

const ProductExistencia = require("~/cartridge/scripts/jobs/api");

base.addProductToCart = (currentBasket, productId, quantity, childProducts, options) => {
    var availableToSell;
    var defaultShipment = currentBasket.defaultShipment;
    var perpetual;
    //Consultar el producto de la api de Lety
    var product = ProductMgr.getProduct(productId);//este es el que optiene los productos dentro de salsforce
    var productInCart;
    var productLineItems = currentBasket.productLineItems;
    var productQuantityInCart;
    var quantityToSet;
    var optionModel = productHelper.getCurrentOptionModel(product.optionModel, options);
    var result = {
        error: false,
        message: Resource.msg('text.alert.addedtobasket', 'product', null)
    };

    var totalQtyRequested = 0;
    var canBeAdded = false;
    let Existencia;
    let Saldo;
    let JSONProduct;

    //Existencia
    //var catalogo = ProductExistencia.ExistenciaPorCentroFecha({Empresa:1,iIdCentro:19,iIdMaterial:145,dtFecha:'2022-10-26T00:00:00.000-05:00'});
    //Lety club Tarjeta con puntos
    //var catalogo = ProductExistencia.getLetyClub({Empresa:1,s_IdMembresia:3019009418164});
    //Lety club Tarjeta sin puntos
    //var catalogo = ProductExistencia.getLetyClub({Empresa:1,s_IdMembresia:3000006236103});
    //JSONProduct = JSON.parse(catalogo);
    //Existencia = JSONProduct.ExistenciaPorCentroFecha[0]['Existencia'];
    //Saldo = JSONProduct.getLetyClub[0]['dSaldo'];
    if (product.bundle) {
    /* if (Existencia) { */
        canBeAdded = base.checkBundledProductCanBeAdded(childProducts, productLineItems, quantity);
    } else {
        totalQtyRequested = quantity + base.getQtyAlreadyInCart(productId, productLineItems);
        perpetual = product.availabilityModel.inventoryRecord.perpetual;
        canBeAdded =(perpetual || totalQtyRequested <= product.availabilityModel.inventoryRecord.ATS.value);
       /*  canBeAdded =(perpetual || totalQtyRequested <= Existencia); */
    }

    if (!canBeAdded) {
        result.error = true;
        result.message = Resource.msgf(
            'error.alert.selected.quantity.cannot.be.added.for',
            'product',
            null,
            //Existencia,
            product.availabilityModel.inventoryRecord.ATS.value,
            product.name
        );
        return result;
    }

    productInCart = base.getExistingProductLineItemInCart(
        product, productId, productLineItems, childProducts, options);

    if (productInCart) {
        productQuantityInCart = productInCart.quantity.value;
        quantityToSet = quantity ? quantity + productQuantityInCart : productQuantityInCart + 1;
        availableToSell = productInCart.product.availabilityModel.inventoryRecord.ATS.value;

        if (availableToSell >= quantityToSet || perpetual) {
            productInCart.setQuantityValue(quantityToSet);
            result.uuid = productInCart.UUID;
        } else {
            result.error = true;
            result.message = availableToSell === productQuantityInCart
            //result.message = Existencia === productQuantityInCart
                ? Resource.msg('error.alert.max.quantity.in.cart', 'product', null)
                : Resource.msg('error.alert.selected.quantity.cannot.be.added', 'product', null);
        }
    } else {
        var productLineItem;
        productLineItem = base.addLineItem(
            currentBasket,
            product,
            quantity,
            childProducts,
            optionModel,
            defaultShipment
        );

        result.uuid = productLineItem.UUID;
    }

    return result;
}

module.exports = base;      