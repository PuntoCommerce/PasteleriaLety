 const Transaction = require("dw/system/Transaction");
 const CustomerMgr = require("dw/customer/CustomerMgr");
 var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
 const ApiServiceLety = require("*/cartridge/scripts/jobs/api");
 var Resource = require('dw/web/Resource');
 var Site = require('dw/system/Site');
 var URLUtils = require('dw/web/URLUtils');
const BasketMgr = require('dw/order/BasketMgr');
const COHelpers = require("*/cartridge/scripts/checkout/checkoutHelpers");
const OrderModel = require('*/cartridge/models/order');
const Locale = require('dw/util/Locale');
const collections = require('*/cartridge/scripts/util/collections');

function getTotalAvailableLetyPuntos(collection) {
  let products = collection.iterator();
  let product;
  let total = 0;
  while (products.hasNext()) {
    product = products.next();
    if (product.product.custom.isLetyPuntos) {
      total += product.basePrice.value;
    }
  }
  return total;
}


 function addLetyCardToCustomer(customerNo, letyCard){
    let Func_ExisteMembrecia = ApiServiceLety.ApiLety(
        "Func_ExisteMembrecia",
        { 
          Empresa: 1, 
          s_IdMembresia: letyCard 
        }
      );
      let ExistenciaLetyCart = [];
      let Exis = {};

      if(Func_ExisteMembrecia.ERROR) {
        ExistenciaLetyCart = []
      }else{
        let JsonFunc_ExisteMembrecia = JSON.parse(Func_ExisteMembrecia);
        ExistenciaLetyCart =JsonFunc_ExisteMembrecia.Func_ExisteMembrecia;
        Exis = ExistenciaLetyCart[0].Column1;
        if(Exis=='1'){
            const customer = CustomerMgr.getProfile(customerNo);
            if (customer && letyCard) {
                Transaction.wrap(() => {
                customer.custom.letyPuntosCard = letyCard;
                });
            }
        }else{
          Exis=='0';
        }
      }
    return Exis;
 };

 function crearLetyCard(customerNo, data){
  
  const customer = CustomerMgr.getProfile(customerNo);
  let LetyC = "";
  let LetyCardNew = "";
  let newMembresia = ApiServiceLety.ApiLety(
    "Func_AsignaNuevaMembresia",
    { 
      Empresa: 1,
      s_Nombre:data.s_Nombre,
      s_Appaterno:data.s_ApellidoPat,
      s_Apmaterno:data.s_Apmaterno,
      s_FechaNacimiento:data.dtFechaNacimiento,
      s_Sexo:data.s_Sexo,
      i_IdCiudad:data.cCiudad,
      s_EdoCivil:data.s_EstadoCivil,
      s_PastelFavorito:data.PreferenciaProducto,
      s_Direccion:data.f_Adreess,
      s_Colonia:data.s_Colonia,
      s_Telefono:data.s_Telefono1,
      s_Mail:data.s_Mail
    }
  );
  if (newMembresia.ERROR) {
    LetyC = "";
  } else {
    let membresiaN = JSON.parse(newMembresia);
    LetyCardNew = membresiaN.Func_AsignaNuevaMembresia[0].iIdMembresia;
    //letyC = LetyCardNew[0].iIdMembresia;
    var userObject = {
      membresia: LetyCardNew,
      url: URLUtils.https('Account-Show')
    };

    this.addLetyCardToCustomer(customerNo, LetyCardNew);
 
    var emailObj = {
      to: customer.email,
      subject: Resource.msg('email.subject.new.letyClub', 'registration', null),
      from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
      type: emailHelpers.emailTypes.clubLetyCard
    };
    
    emailHelpers.sendEmail(emailObj, 'account/components/clubLetyEmail', userObject);  
  }
};

function checkLetyCard(membershipID, data){

  const customer = CustomerMgr.getProfile(customerNo);
  let LetyC = "";
  let LetyCardNew = "";
  let newMembresia = ApiServiceLety.ApiLety(
    "Func_AsignaNuevaMembresia",
    { 
      Empresa: 1,
      s_Nombre:data.s_Nombre,
      s_Appaterno:data.s_ApellidoPat,
      s_Apmaterno:data.s_Apmaterno,
      s_FechaNacimiento:data.dtFechaNacimiento,
      s_Sexo:data.s_Sexo,
      i_IdCiudad:data.cCiudad,
      s_EdoCivil:data.s_EstadoCivil,
      s_PastelFavorito:data.PreferenciaProducto,
      s_Direccion:data.f_Adreess,
      s_Colonia:data.s_Colonia,
      s_Telefono:data.s_Telefono1,
      s_Mail:data.s_Mail
    }
  );
  if (newMembresia.ERROR) {
    LetyC = "";
  } else {
    let membresiaN = JSON.parse(newMembresia);
    LetyCardNew = membresiaN.Func_AsignaNuevaMembresia[0].iIdMembresia;
    //letyC = LetyCardNew[0].iIdMembresia;
    var userObject = {
      membresia: LetyCardNew,
      url: URLUtils.https('Account-Show')
    };

    this.addLetyCardToCustomer(customerNo, LetyCardNew);

    var emailObj = {
      to: customer.email,
      subject: Resource.msg('email.subject.new.letyClub', 'registration', null),
      from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
      type: emailHelpers.emailTypes.clubLetyCard
    };

    emailHelpers.sendEmail(emailObj, 'account/components/clubLetyEmail', userObject);  
  }
};

function removeLetyPuntos(localeId, promotionID) {
  const currentBasket = BasketMgr.getCurrentBasket();
    let result;
    let code;
    let err;
    try {
      let letyPuntosPA = collections.find(currentBasket.priceAdjustments, 
          (pa) => { return pa.promotionID == promotionID });
      if(letyPuntosPA) {
        Transaction.wrap(function (params) {
          result = currentBasket.removePriceAdjustment(letyPuntosPA);
          currentBasket.custom.letyPuntosAmount = 0;
          currentBasket.custom.letyPuntosCard = "";
        });
        COHelpers.recalculateBasket(currentBasket);
        code = 0;
        err = "Sin error";
      }
    } catch (error) {
        err = error;
        code = 1;
        result = "";
    }
    var currentLocale = Locale.getLocale(localeId);

    var orderModel = new OrderModel(
        currentBasket, {
            usingMultiShipping: false,
            shippable: true,
            countryCode: currentLocale.country,
            containerView: 'basket'
        }
    );

    return {
      orderModel: orderModel,
      err: err,
      code: code,
      result: result
    }
}

 module.exports = {
   addLetyCardToCustomer: addLetyCardToCustomer,
   crearLetyCard:crearLetyCard,
   removeLetyPuntos: removeLetyPuntos,
   getTotalAvailableLetyPuntos: getTotalAvailableLetyPuntos
 };
