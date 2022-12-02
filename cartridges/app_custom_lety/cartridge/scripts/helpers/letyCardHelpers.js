 const Transaction = require("dw/system/Transaction");
 const CustomerMgr = require("dw/customer/CustomerMgr");
 var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
 const ApiServiceLety = require("*/cartridge/scripts/jobs/api");
 var Resource = require('dw/web/Resource');
 var Site = require('dw/system/Site');
 var URLUtils = require('dw/web/URLUtils');

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
        }
      }
    
 };

 function crearLetyCard(customerNo){
  
  const customer = CustomerMgr.getProfile(customerNo);
  let LetyC = "";
  let LetyCardNew = "";
  let newMembresia = ApiServiceLety.ApiLety(
    "Func_AsignaNuevaMembresia",
    { 
      Empresa: 1, 
      s_Nombre:"fddfdf",
      s_Appaterno:"dfdfdf",
      s_Apmaterno:"dfdfdf",
      s_FechaNacimiento:"02/02/2022",
      s_Sexo:"M",
      i_IdCiudad:"1086",
      s_EdoCivil:"soltero",
      s_PastelFavorito:"cubano",
      s_Direccion:"gdssdg",
      s_Colonia:"dgsdsgdgs",
      s_Telefono:"dgsgsd",
      s_Mail:"dgssgdsdggds" 
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

 module.exports = {
   addLetyCardToCustomer: addLetyCardToCustomer,
   crearLetyCard:crearLetyCard,
 };
