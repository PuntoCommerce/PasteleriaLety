"use strict";

const server = require("server");
server.extend(module.superModule);

const URLUtils = require("dw/web/URLUtils");
const {
  addLetyCardToCustomer,
  crearLetyCard,
} = require("*/cartridge/scripts/helpers/letyCardHelpers");
const ApiServiceLety = require("*/cartridge/scripts/jobs/api");


var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');


/**
 * Checks if the email value entered is correct format
 * @param {string} email - email string to check if valid
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
  var regex = /^[\w.%+-]+@[\w.-]+\.[\w]{2,6}$/;
  return regex.test(email);
}


server.get("Saldo", server.middleware.https, function (req, res, next) {

  let letyCard = req.querystring.letyCard;

  let Func_DatosMembresia = ApiServiceLety.ApiLety("Func_DatosMembresia", {
    Empresa: 1,
    s_IdMembresia: letyCard,
  });

  let JsonDatosMembresia;

  if (Func_DatosMembresia.ERROR) {
    JsonDatosMembresia = {};
  } else {
    JsonDatosMembresia = JSON.parse(Func_DatosMembresia);
  }

  /* Woring */

  let CatalogoCiudades = ApiServiceLety.ApiLety(
    "CatalogoCiudades", {
      Empresa: 1,
      IdEstado: "0"
    }
  );

  let JsonDatosCiudades;

  if (CatalogoCiudades.ERROR) {
    JsonDatosCiudades = {};
  } else {
    let catalogo = JSON.parse(CatalogoCiudades);
    JsonDatosCiudades = catalogo.CatalogoCiudades;
  }
  // delete
  let CatalogoEstados = ApiServiceLety.ApiLety(
    "CatalogoEstados", {
      Empresa: 1
    }
  );

  let JsonDatosEstados;
  let estdo = "";

  if (CatalogoEstados.ERROR) {
    JsonDatosEstados = {};
  } else {
    let estados = JSON.parse(CatalogoEstados);
    JsonDatosEstados = estados.CatalogoEstados;

  }

  if (CatalogoEstados.ERROR) {
    JsonDatosEstados = {};
  } else {
    let estados = JSON.parse(CatalogoEstados);
    JsonDatosEstados = estados.CatalogoEstados
  }
  res.render("account/saldoLetyClub", {
    Account: {
      LetyCard: letyCard,
      JsonDatosMembresia: JsonDatosMembresia,
      JsonDatosCiudades: JsonDatosCiudades,
      JsonDatosEstados: JsonDatosEstados
    },
  });
  next();
});


server.get("Movimientos", server.middleware.https, function (req, res, next) {

  var Site = require("dw/system/Site");
  var PageMgr = require("dw/experience/PageMgr");
  var pageMetaHelper = require("*/cartridge/scripts/helpers/pageMetaHelper");
  var accountHelpers = require("*/cartridge/scripts/account/accountHelpers");
  let ListaMovimientos = [];


  let Func_MovimientosMembresia = ApiServiceLety.ApiLety(
    "Func_MovimientosMembresia", {
      Empresa: 1,
      s_IdMembresia: req.querystring.letyCard
    }
  );


  if (Func_MovimientosMembresia.ERROR) {
    ListaMovimientos = []
  } else {
    let JsonMovimientosMembresia = JSON.parse(Func_MovimientosMembresia);
    ListaMovimientos = JsonMovimientosMembresia.Func_MovimientosMembresia;
  }

  res.render("account/movesLetyClub", {
    ListaMovimientos: ListaMovimientos,
    arrayMovimientos: JSON.stringify(ListaMovimientos)
  });
  next();
});

server.post("AddLetyCard", (req, res, next) => {
  const data = JSON.parse(JSON.stringify(req.form));
  const Custom = req.currentCustomer.profile.customerNo;
  const addedCard = addLetyCardToCustomer(Custom, data.letyCard);// null error servidor 0 no existe
  if(addedCard == "1") {
    res.json({
      code: 0,
      redirectURL: URLUtils.url("Account-Show"), 
    });
  } else {
    let error="";
    switch (addedCard) {
      case "0":
          error="No se encontró esta tarjeta. intenta con otra por favor.";
        break;
      default:
        error="Ocurrió un error con el servidor intentalo mas tarde."
        break;
    }
    res.json({
      code: 1,
      error: error
    });
  }
    next();
}); 

server.post("GenerateLetyCard", (req, res, next) => {

  let code;
  try {
    const Custom = req.currentCustomer.profile.customerNo;
    const data = JSON.parse(JSON.stringify(req.form));
    const letyCardNew = crearLetyCard(Custom, data);
    if(letyCardNew === undefined || letyCardNew === "undefined" || letyCardNew === null || letyCardNew === "") {
      code = 1;
    } else {
      code = 0;
    }
  } catch (error) {
    code = 1;
  }

  res.json({
    code: code
  });

  next();
});


server.post("SaveSaldoForm", (req, res, next) => {
  // sacar todo desde node. con desestructuracion d
  const data = JSON.parse(JSON.stringify(req.form));
  //const data = JSON.parse(JSON.stringify(req.form));
  let Func_DatosMembresia = ApiServiceLety.ApiLety("Func_DatosMembresia", {
    Empresa: 1,
    s_IdMembresia: data.lLetyCard,
  });
  let JsonDatosMembresia;
  if (Func_DatosMembresia.ERROR) {
    JsonDatosMembresia = {};
    return res.json({
      error: 1,
      msg: "Ocurrió un error al intentar actualizar los datos."
    });
  } else {
    JsonDatosMembresia = JSON.parse(Func_DatosMembresia);
    let iIdFolioPersona = JsonDatosMembresia = JsonDatosMembresia.Func_DatosMembresia[0].iIdFolioPersona
    if (iIdFolioPersona != "" || iIdFolioPersona != undefined != null) { // suele llegar con comillas.
      let dtFechaNacimiento = data.dtFechaNacimiento;
      let PreferenciaProducto = data.PreferenciaProducto;
      let s_Sexo = data.s_Sexo;
      let s_EstadoCivil = data.s_EstadoCivil;
      let f_Adreess = data.s_EstadoCivil;
      if (dtFechaNacimiento == undefined || dtFechaNacimiento == null) {
        dtFechaNacimiento = "";
      }
      if (PreferenciaProducto == undefined || PreferenciaProducto == null) {
        PreferenciaProducto = "";
      }
      if (s_Sexo == undefined || s_Sexo == null) {
        s_Sexo = "";
      }
      if (s_EstadoCivil == undefined || s_EstadoCivil == null) {
        s_EstadoCivil = "";
      }
      if (f_Adreess == undefined || f_Adreess == null) {
        f_Adreess = "";
      } 
      let Func_ActualizaDatosMembresia = ApiServiceLety.ApiLety(
        "Func_ActualizaDatosMembresia", {
          Empresa: 1,
          s_IdMembresia: data.lLetyCard,
          i_IdFolioPersona: iIdFolioPersona,
          s_Nombre: data.s_Nombre,
          s_Appaterno: data.s_ApellidoPat,
          s_Apmaterno: data.s_Apmaterno,
          s_FechaNacimiento: dtFechaNacimiento,
          s_Sexo: s_Sexo,
          i_IdCiudad: data.cCiudad,
          s_EdoCivil: s_EstadoCivil,
          s_PastelFavorito: PreferenciaProducto,
          s_Direccion: f_Adreess,
          s_Colonia: data.s_Colonia,
          s_Telefono: data.s_Telefono1,
          s_Mail: data.s_Mail
        }
      );
      let JsonDatosActualizar;
      JsonDatosActualizar = Func_ActualizaDatosMembresia;
      if (JsonDatosActualizar.ERROR) {
        return res.json({
          error: 1,
          msg: "Ocurrió un error al intentar actualizar los datos."
        });
      } else {
        res.json({
          error: 0,
          msg: "ok"
        });
      }
    } else {
      return res.json({
        error: 1,
        msg: "Ocurrió un error al intentar actualizar los datos."
      });
    }
  }
  next();
});


server.post("getState", (req, res, next) => {
  /*
   const {
     idEstado
   } = JSON.parse(req.body);*/
   
   let CatalogoEstados = ApiServiceLety.ApiLety(
     "CatalogoEstados", {
       Empresa: 1
     }
   );
   let JsonDatosEstados;
   let error="";
   let code="";
   if (CatalogoEstados.ERROR) {
     JsonDatosEstados = {};
     error="Ocurrió un error con el servidor, intente más tarde por favor."
     code=1;
   } else {
     let estados = JSON.parse(CatalogoEstados);
     JsonDatosEstados = estados.CatalogoEstados;
     code=0;
     error="";
   }
   res.json({
     JsonDatosEstados: JsonDatosEstados,
     code:code,
     error:error
   });
   
   next();
  });
   
server.post("getCities", (req, res, next) => {
  let CatalogoCiudades = ApiServiceLety.ApiLety(
    "CatalogoCiudades", {
      Empresa: 1,
      IdEstado: "0"
    }
  );
  
  let JsonDatosCiudades;
  let error="";
  let code="";
  
  if (CatalogoCiudades.ERROR) {
    JsonDatosCiudades = {};
    error="Ocurrió un error con el servidor, intente más tarde por favor."
    code=1;
  } else {
    let catalogo = JSON.parse(CatalogoCiudades);
    JsonDatosCiudades = catalogo.CatalogoCiudades;
    code=0;
    error="";
  }
  
  res.json({
    JsonDatosCiudades: JsonDatosCiudades,
    code:code,
    error: error
  });
  
  next();
});
  


/* working create card... server.middleware.https,*/
server.post("AddLetyCardMember",  function (req, res, next) {

  const Custom = req.currentCustomer;
  let letyCard = req.querystring.letyCard;
  const userData = req.currentCustomer.profile;


  let CatalogoCiudades = ApiServiceLety.ApiLety(
    "CatalogoCiudades", {
      Empresa: 1,
      IdEstado: "0"
    }
  );

  let JsonDatosCiudades;

  if (CatalogoCiudades.ERROR) {
    JsonDatosCiudades = {};
  } else {
    let catalogo = JSON.parse(CatalogoCiudades);
    JsonDatosCiudades = catalogo.CatalogoCiudades;
  }
  // delete
  let CatalogoEstados = ApiServiceLety.ApiLety(
    "CatalogoEstados", {
      Empresa: 1
    }
  );

  let JsonDatosEstados;

  if (CatalogoEstados.ERROR) {
    JsonDatosEstados = {};
  } else {
    let estados = JSON.parse(CatalogoEstados);
    JsonDatosEstados = estados.CatalogoEstados;

  }

  res.render("account/cardLetyClub", {
    Account: {
      JsonDatosCiudades: JsonDatosCiudades,
      userData: userData,
      JsonDatosEstados: JsonDatosEstados
    }
  });
  next();
});

/* if (registrationForm.validForm) {
  var login = registrationForm.email;
  var password = registrationForm.password;

  // attempt to create a new user and log that user in.
  try {
      Transaction.wrap(function () {
          var error = {};
          var newCustomer = CustomerMgr.createCustomer(login, password);

          var authenticateCustomerResult = CustomerMgr.authenticateCustomer(login, password);
          if (authenticateCustomerResult.status !== 'AUTH_OK') {
              error = { authError: true, status: authenticateCustomerResult.status };
              throw error;
          }

          authenticatedCustomer = CustomerMgr.loginCustomer(authenticateCustomerResult, false);

          if (!authenticatedCustomer) {
              error = { authError: true, status: authenticateCustomerResult.status };
              throw error;
          } else {
              // assign values to the profile
              var newCustomerProfile = newCustomer.getProfile();

              newCustomerProfile.firstName = registrationForm.firstName;
              newCustomerProfile.lastName = registrationForm.lastName;
              newCustomerProfile.phoneHome = registrationForm.phone;
              newCustomerProfile.email = registrationForm.email;
          }
      });
  } catch (e) {
      if (e.authError) {
          serverError = true;
      } else {
          registrationForm.validForm = false;
          registrationForm.form.customer.email.valid = false;
          registrationForm.form.customer.emailconfirm.valid = false;
          registrationForm.form.customer.email.error =
              Resource.msg('error.message.username.invalid.regist', 'forms', null);
      }
  }
} */
/* working create card... */

/**
 * Account-SubmitRegistration : The Account-SubmitRegistration endpoint is the endpoint that gets hit when a shopper submits their registration for a new account
 * @name Base/Account-SubmitRegistration
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {querystringparameter} - rurl - redirect url. The value of this is a number. This number then gets mapped to an endpoint set up in oAuthRenentryRedirectEndpoints.js
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password - Input field for the shopper's password
 * @param {httpparameter} - dwfrm_profile_login_passwordconfirm: - Input field for the shopper's password to confirm
 * @param {httpparameter} - dwfrm_profile_customer_addtoemaillist - Checkbox for whether or not a shopper wants to be added to the mailing list
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensitive
 * @param {returns} - json
 * @param {serverfunction} - post
 */
// server.replace(
//   'SubmitRegistration',
//   server.middleware.https,
//   csrfProtection.validateAjaxRequest,
//   function (req, res, next) {
//       var CustomerMgr = require('dw/customer/CustomerMgr');
//       var Resource = require('dw/web/Resource');

//       var formErrors = require('*/cartridge/scripts/formErrors');

//       var registrationForm = server.forms.getForm('profile');

//       // form validation
//       if (registrationForm.customer.email.value.toLowerCase()
//           !== registrationForm.customer.emailconfirm.value.toLowerCase()
//       ) {
//           registrationForm.customer.email.valid = false;
//           registrationForm.customer.emailconfirm.valid = false;
//           registrationForm.customer.emailconfirm.error =
//               Resource.msg('error.message.mismatch.email', 'forms', null);
//           registrationForm.valid = false;
//       }

//       if (registrationForm.login.password.value
//           !== registrationForm.login.passwordconfirm.value
//       ) {
//           registrationForm.login.password.valid = false;
//           registrationForm.login.passwordconfirm.valid = false;
//           registrationForm.login.passwordconfirm.error =
//               Resource.msg('error.message.mismatch.password', 'forms', null);
//           registrationForm.valid = false;
//       }

//       if (!CustomerMgr.isAcceptablePassword(registrationForm.login.password.value)) {
//           registrationForm.login.password.valid = false;
//           registrationForm.login.passwordconfirm.valid = false;
//           registrationForm.login.passwordconfirm.error =
//               Resource.msg('error.message.password.constraints.not.matched', 'forms', null);
//           registrationForm.valid = false;
//       }

//       // setting variables for the BeforeComplete function
//       var registrationFormObj = {
//           firstName: registrationForm.customer.firstname.value,
//           lastName: registrationForm.customer.lastname.value,
//           phone: registrationForm.customer.phone.value,
//           email: registrationForm.customer.email.value,
//           emailConfirm: registrationForm.customer.emailconfirm.value,
//           password: registrationForm.login.password.value,
//           passwordConfirm: registrationForm.login.passwordconfirm.value,
//           validForm: registrationForm.valid,
//           form: registrationForm
//       };

//       if (registrationForm.valid) {
//           res.setViewData(registrationFormObj);

//           this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
//               var Transaction = require('dw/system/Transaction');
//               var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');
//               var authenticatedCustomer;
//               var serverError;

//               // getting variables for the BeforeComplete function
//               var registrationForm = res.getViewData(); // eslint-disable-line

//               if (registrationForm.validForm) {
//                   var login = registrationForm.email;
//                   var password = registrationForm.password;

//                   // attempt to create a new user and log that user in.
//                   try {
//                       Transaction.wrap(function () {
//                           var error = {};
//                           var newCustomer = CustomerMgr.createCustomer(login, password);

//                           var authenticateCustomerResult = CustomerMgr.authenticateCustomer(login, password);
//                           if (authenticateCustomerResult.status !== 'AUTH_OK') {
//                               error = { authError: true, status: authenticateCustomerResult.status };
//                               throw error;
//                           }

//                           authenticatedCustomer = CustomerMgr.loginCustomer(authenticateCustomerResult, false);

//                           if (!authenticatedCustomer) {
//                               error = { authError: true, status: authenticateCustomerResult.status };
//                               throw error;
//                           } else {
//                               // assign values to the profile
//                               var newCustomerProfile = newCustomer.getProfile();

//                               newCustomerProfile.firstName = registrationForm.firstName;
//                               newCustomerProfile.lastName = registrationForm.lastName;
//                               newCustomerProfile.phoneHome = registrationForm.phone;
//                               newCustomerProfile.email = registrationForm.email;
//                           }
//                       });
//                   } catch (e) {
//                       if (e.authError) {
//                           serverError = true;
//                       } else {
//                           registrationForm.validForm = false;
//                           registrationForm.form.customer.email.valid = false;
//                           registrationForm.form.customer.emailconfirm.valid = false;
//                           registrationForm.form.customer.email.error =
//                               Resource.msg('error.message.username.invalid.regist', 'forms', null);
//                       }
//                   }
//               }

//               delete registrationForm.password;
//               delete registrationForm.passwordConfirm;
//               formErrors.removeFormValues(registrationForm.form);

//               if (serverError) {
//                   res.setStatusCode(500);
//                   res.json({
//                       success: false,
//                       errorMessage: Resource.msg('error.message.unable.to.create.account', 'login', null)
//                   });

//                   return;
//               }

//               if (registrationForm.validForm) {
//                   // send a registration email
//                   accountHelpers.sendCreateAccountEmail(authenticatedCustomer.profile);

//                   res.setViewData({ authenticatedCustomer: authenticatedCustomer });
//                   res.json({
//                       success: true,
//                       redirectUrl: accountHelpers.getLoginRedirectURL(req.querystring.rurl, req.session.privacyCache, true)
//                   });

//                   req.session.privacyCache.set('args', null);
//               } else {
//                   res.json({
//                       fields: formErrors.getFormErrors(registrationForm)
//                   });
//               }
//           });
//       } else {
//           res.json({
//               fields: formErrors.getFormErrors(registrationForm)
//           });
//       }

//       return next();
//   }
// );


module.exports = server.exports();