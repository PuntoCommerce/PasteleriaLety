const base = module.superModule;

var ProductMgr = require('dw/catalog/ProductMgr');
var Resource = require('dw/web/Resource');
var productHelper = require('*/cartridge/scripts/helpers/productHelpers');

const ApiServiceLety = require("~/cartridge/scripts/jobs/api");

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
    let JSONApiServiceLety;
    let Saldo1;
    let JSONApiServiceLety1;

    //Existencia
    //var catalogo = ProductExistencia.ExistenciaPorCentroFecha({Empresa:1,iIdCentro:19,iIdMaterial:145,dtFecha:'2022-10-26T00:00:00.000-05:00'});
    //Lety club Tarjeta con puntos
    //3019009418164
    //Lety club Tarjeta sin puntos
    //3000006236103


    /*let ExistenciaPorCentroFecha = ApiServiceLety.ApiLety("ExistenciaPorCentroFecha",{Empresa:1,iIdCentro:19,iIdMaterial:145,dtFecha:'2022-10-26T00:00:00.000-05:00'});
    let NewCalculoSD = ApiServiceLety.ApiLety("NewCalculoSD",{Empresa:1,Posicion:1,IdCentroAlta:1001,IdCentroAfecta:17,CentroAfecta:'Apodaca',bIndEnRango:1,Tiempo:'2022-10-14',IdFolioDireccionSeleccionado:404561001,IdFolioPersonaSeleccionado:713181001,dLat:25.71211680,dLng:-100.2948341,IdServicio:0,Folio:55000,NombreCliente:'Nombre de prueba',Direccion:'670af8d5-b9bf-40ba-a6bd-c6560b22caf2'});
    let LetyClub = ApiServiceLety.ApiLety("getLetyClub",{Empresa:1,s_IdMembresia:3019009418164});
    JSONApiServiceLety = JSON.parse(LetyClub);
    Saldo = JSONApiServiceLety.getLetyClub[0]['dSaldo'];
    let monto = 25;

    if(Saldo>=monto){
        let getLetyClubQuitarPuntos = ApiServiceLety.ApiLety("getLetyClubQuitarPuntos",{Empresa:1,s_IdMembresia:3019009418164,dMonto:monto,dSaldoAnterior:Saldo,sFolioWeb:'ban1xuKKHYX'});
    }
    
    let LetyClub1 = ApiServiceLety.ApiLety("getLetyClub",{Empresa:1,s_IdMembresia:3019009418164});
    JSONApiServiceLety1 = JSON.parse(LetyClub1);
    Saldo1 = JSONApiServiceLety1.getLetyClub[0]['dSaldo'];
    let Func_DatosMembresia = ApiServiceLety.ApiLety("Func_DatosMembresia",{Empresa:1,s_IdMembresia:3019009418164});
    let Func_MovimientosMembresia = ApiServiceLety.ApiLety("Func_MovimientosMembresia",{Empresa:1,s_IdMembresia:3019009418164});
    */

    //if (product.bundle) {
    //if (Existencia) {
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