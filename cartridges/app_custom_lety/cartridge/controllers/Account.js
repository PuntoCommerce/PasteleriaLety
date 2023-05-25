"use strict";

const server = require("server");
server.extend(module.superModule);

const URLUtils = require("dw/web/URLUtils");
const {
  addLetyCardToCustomer,
  crearLetyCard
} = require("*/cartridge/scripts/helpers/letyCardHelpers");
const ApiServiceLety = require("*/cartridge/scripts/jobs/api");
const { ApiLety } = require("~/cartridge/scripts/jobs/api");


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

  const { dtFechaNacimiento } = JsonDatosMembresia.Func_DatosMembresia[0];
  const birthDay = dtFechaNacimiento.split('/')

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
      JsonDatosEstados: JsonDatosEstados,
      birthDay: birthDay
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
  if (addedCard == "1") {
    res.json({
      code: 0,
      redirectURL: URLUtils.url("Account-Show"),
    });
  } else {
    let error = "";
    switch (addedCard) {
      case "0":
        error = "No se encontró esta tarjeta. intenta con otra por favor.";
        break;
      default:
        error = "Ocurrió un error con el servidor intentalo mas tarde."
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
    if (letyCardNew === undefined || letyCardNew === "undefined" || letyCardNew === null || letyCardNew === "") {
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
      let f_Adreess = data.f_Adreess;
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
  let error = "";
  let code = "";
  if (CatalogoEstados.ERROR) {
    JsonDatosEstados = {};
    error = "Ocurrió un error con el servidor, intente más tarde por favor."
    code = 1;
  } else {
    let estados = JSON.parse(CatalogoEstados);
    JsonDatosEstados = estados.CatalogoEstados;
    code = 0;
    error = "";
  }
  res.json({
    JsonDatosEstados: JsonDatosEstados,
    code: code,
    error: error
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
  let error = "";
  let code = "";

  if (CatalogoCiudades.ERROR) {
    JsonDatosCiudades = {};
    error = "Ocurrió un error con el servidor, intente más tarde por favor."
    code = 1;
  } else {
    let catalogo = JSON.parse(CatalogoCiudades);
    JsonDatosCiudades = catalogo.CatalogoCiudades;
    code = 0;
    error = "";
  }

  res.json({
    JsonDatosCiudades: JsonDatosCiudades,
    code: code,
    error: error
  });

  next();
});



/* working create card... server.middleware.https,*/
server.post("AddLetyCardMember", function (req, res, next) {

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

server.post('GetDataFromEvo',
  (req, res, next) => {
    let membershipId = req.form;
    var Resource = require('dw/web/Resource');

    var registrationForm = server.forms.getForm('profile');
    var membershipForm = server.forms.getForm('customerEvo');

    try {
      var FuncExisteMembresía = ApiLety("ListaClientesFromMembresia", {
        Empresa: 1,
        s_IdMembresia: membershipId.membership
      });

      if (FuncExisteMembresía.ERROR) {
        registrationForm.customer.membershipId.valid = false;
        registrationForm.customer.membershipId.error =
          registrationForm.valid = false;
        res.json({
          errorMessage: Resource.msg('label.input.membershipID.error', 'forms', null),
          success: false
        })
      } else {
        let JsonFunc_ExisteMembrecia = JSON.parse(FuncExisteMembresía);
        JsonFunc_ExisteMembrecia = JsonFunc_ExisteMembrecia.ListaClientesFromMembresia;
        const birthDay = JsonFunc_ExisteMembrecia[0].dtFechaNacimiento.split('T', 2);

        var sIdFolioCard = JsonFunc_ExisteMembrecia[0].sIdFolioCard;
        if (!empty(sIdFolioCard)) {
          registrationForm.customer.firstname.value = JsonFunc_ExisteMembrecia[0].Name;
          registrationForm.customer.lastname.value = JsonFunc_ExisteMembrecia[0].sPaternalLastName;
          registrationForm.customer.email.value = JsonFunc_ExisteMembrecia[0].sEmail;
          registrationForm.customer.emailconfirm.value = JsonFunc_ExisteMembrecia[0].sEmail;
          registrationForm.customer.phone.value = JsonFunc_ExisteMembrecia[0].sPhone1;
          registrationForm.customer.birthDay.value = birthDay[0];
          session.custom.JsonFunc_ExisteMembrecia = JSON.stringify(JsonFunc_ExisteMembrecia);
          res.json({
            success: true,
            registrationForm: registrationForm,
            successMessage: Resource.msg('label.input.membershipID.verify', 'forms', null)
          });
          return next();
        }
      }
    } catch (error) {
      let err = error;
    }

    next();
  })

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
server.replace(
  'SubmitRegistration',
  server.middleware.https,
  csrfProtection.validateAjaxRequest,
  function (req, res, next) {
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var Resource = require('dw/web/Resource');

    var formErrors = require('*/cartridge/scripts/formErrors');

    var registrationForm = server.forms.getForm('profile');

    // form validation
    if (registrationForm.customer.email.value.toLowerCase()
      !== registrationForm.customer.emailconfirm.value.toLowerCase()
    ) {
      registrationForm.customer.email.valid = false;
      registrationForm.customer.emailconfirm.valid = false;
      registrationForm.customer.emailconfirm.error =
        Resource.msg('error.message.mismatch.email', 'forms', null);
      registrationForm.valid = false;
    }

    if (registrationForm.login.password.value
      !== registrationForm.login.passwordconfirm.value
    ) {
      registrationForm.login.password.valid = false;
      registrationForm.login.passwordconfirm.valid = false;
      registrationForm.login.passwordconfirm.error =
        Resource.msg('error.message.mismatch.password', 'forms', null);
      registrationForm.valid = false;
    }

    if (!CustomerMgr.isAcceptablePassword(registrationForm.login.password.value)) {
      registrationForm.login.password.valid = false;
      registrationForm.login.passwordconfirm.valid = false;
      registrationForm.login.passwordconfirm.error =
        Resource.msg('error.message.password.constraints.not.matched', 'forms', null);
      registrationForm.valid = false;
    }
    // setting variables for the BeforeComplete function
    var registrationFormObj = {
      firstName: registrationForm.customer.firstname.value,
      lastName: registrationForm.customer.lastname.value,
      sLastName: ',',
      phone: registrationForm.customer.phone.value,
      email: registrationForm.customer.email.value,
      emailConfirm: registrationForm.customer.emailconfirm.value,
      password: registrationForm.login.password.value,
      passwordConfirm: registrationForm.login.passwordconfirm.value,
      birthDay: registrationForm.customer.birthDay.value,
      validForm: registrationForm.valid,
      form: registrationForm
    };

    if (registrationForm.valid) {
      res.setViewData(registrationFormObj);

      this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
        var Transaction = require('dw/system/Transaction');
        var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');
        var authenticatedCustomer;
        var serverError;

        // getting variables for the BeforeComplete function
        var registrationForm = res.getViewData(); // eslint-disable-line

        if (registrationForm.validForm) {
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

                if (!empty(session.custom.JsonFunc_ExisteMembrecia)) {
                  const exist = session.custom.JsonFunc_ExisteMembrecia;
                  const parseInfo = JSON.parse(exist)
                  newCustomerProfile.custom.letyPuntosCard = parseInfo[0].sIdFolioCard;
                }

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
        }

        delete registrationForm.password;
        delete registrationForm.passwordConfirm;
        formErrors.removeFormValues(registrationForm.form);

        if (serverError) {
          res.setStatusCode(500);
          res.json({
            success: false,
            errorMessage: Resource.msg('error.message.unable.to.create.account', 'login', null)
          });

          return;
        }

        if (registrationForm.validForm) {
          // send a registration email
          accountHelpers.sendCreateAccountEmail(authenticatedCustomer.profile);
          accountHelpers.addUpdateExternalAccount(registrationFormObj);

          res.setViewData({ authenticatedCustomer: authenticatedCustomer });
          res.json({
            success: true,
            redirectUrl: accountHelpers.getLoginRedirectURL(req.querystring.rurl, req.session.privacyCache, true)
          });

          req.session.privacyCache.set('args', null);
        } else {
          res.json({
            fields: formErrors.getFormErrors(registrationForm)
          });
        }
      });
    } else {
      res.json({
        fields: formErrors.getFormErrors(registrationForm)
      });
    }

    return next();
  }
);

/**
 * Account-EditProfile : The Account-EditProfile endpoint renders the page that allows a shopper to edit their profile. The edit profile form is prefilled with the shopper's first name, last name, phone number and email
 * @name Base/Account-EditProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.generateToken
 * @param {middleware} - userLoggedIn.validateLoggedIn
 * @param {middleware} - consentTracking.consent
 * @param {category} - sensitive
 * @param {renders} - isml
 * @param {serverfunction} - get
 */
server.replace(
  'EditProfile',
  server.middleware.https,
  csrfProtection.generateToken,
  userLoggedIn.validateLoggedIn,
  consentTracking.consent,
  function (req, res, next) {
      var ContentMgr = require('dw/content/ContentMgr');
      var Resource = require('dw/web/Resource');
      var URLUtils = require('dw/web/URLUtils');
      var accountHelpers = require('*/cartridge/scripts/account/accountHelpers');

      var accountModel = accountHelpers.getAccountModel(req);
      var content = ContentMgr.getContent('tracking_hint');
      var profileForm = server.forms.getForm('profile');
      profileForm.clear();
      profileForm.customer.firstname.value = accountModel.profile.firstName;
      profileForm.customer.lastname.value = accountModel.profile.lastName;
      profileForm.customer.phone.value = accountModel.profile.phone;
      profileForm.customer.email.value = accountModel.profile.email;
      profileForm.customer.birthDay.value = accountModel.profile.birthDay;
      res.render('account/profile', {
          consentApi: Object.prototype.hasOwnProperty.call(req.session.raw, 'setTrackingAllowed'),
          caOnline: content ? content.online : false,
          profileForm: profileForm,
          breadcrumbs: [
              {
                  htmlValue: Resource.msg('global.home', 'common', null),
                  url: URLUtils.home().toString()
              },
              {
                  htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                  url: URLUtils.url('Account-Show').toString()
              }
          ]
      });
      next();
  }
);

/**
 * Account-SaveProfile : The Account-SaveProfile endpoint is the endpoint that gets hit when a shopper has edited their profile
 * @name Base/Account-SaveProfile
 * @function
 * @memberof Account
 * @param {middleware} - server.middleware.https
 * @param {middleware} - csrfProtection.validateAjaxRequest
 * @param {httpparameter} - dwfrm_profile_customer_firstname - Input field for the shoppers's first name
 * @param {httpparameter} - dwfrm_profile_customer_lastname - Input field for the shopper's last name
 * @param {httpparameter} - dwfrm_profile_customer_phone - Input field for the shopper's phone number
 * @param {httpparameter} - dwfrm_profile_customer_email - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_customer_emailconfirm - Input field for the shopper's email address
 * @param {httpparameter} - dwfrm_profile_login_password  - Input field for the shopper's password
 * @param {httpparameter} - csrf_token - hidden input field CSRF token
 * @param {category} - sensititve
 * @param {returns} - json
 * @param {serverfunction} - post
 */
server.replace(
  'SaveProfile',
  server.middleware.https,
  csrfProtection.validateAjaxRequest,
  function (req, res, next) {
      var Transaction = require('dw/system/Transaction');
      var CustomerMgr = require('dw/customer/CustomerMgr');
      var Resource = require('dw/web/Resource');
      var URLUtils = require('dw/web/URLUtils');
      var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');

      var formErrors = require('*/cartridge/scripts/formErrors');

      var profileForm = server.forms.getForm('profile');

      // form validation
      if (profileForm.customer.email.value.toLowerCase()
          !== profileForm.customer.emailconfirm.value.toLowerCase()) {
          profileForm.valid = false;
          profileForm.customer.email.valid = false;
          profileForm.customer.emailconfirm.valid = false;
          profileForm.customer.emailconfirm.error =
              Resource.msg('error.message.mismatch.email', 'forms', null);
      }
      
      if (req.currentCustomer.profile) {
        var customerNo = req.currentCustomer.profile.customerNo;
      }
      
      var result = {
          firstName: profileForm.customer.firstname.value,
          lastName: profileForm.customer.lastname.value,
          phone: profileForm.customer.phone.value,
          email: profileForm.customer.email.value,
          confirmEmail: profileForm.customer.emailconfirm.value,
          birthDay: profileForm.customer.birthDay.value,
          password: profileForm.login.password.value,
          profileForm: profileForm,
          customerNo: customerNo
      };
      if (profileForm.valid) {
          res.setViewData(result);
          this.on('route:BeforeComplete', function (req, res) { // eslint-disable-line no-shadow
              var formInfo = res.getViewData();
              var customer = CustomerMgr.getCustomerByCustomerNumber(
                  req.currentCustomer.profile.customerNo
              );
              var profile = customer.getProfile();
              var customerLogin;
              var status;

              Transaction.wrap(function () {
                  status = profile.credentials.setPassword(
                      formInfo.password,
                      formInfo.password,
                      true
                  );

                  if (status.error) {
                      formInfo.profileForm.login.password.valid = false;
                      formInfo.profileForm.login.password.error =
                          Resource.msg('error.message.currentpasswordnomatch', 'forms', null);
                  } else {
                      customerLogin = profile.credentials.setLogin(
                          formInfo.email,
                          formInfo.password
                      );
                  }
              });
              // var xx = new Date(formInfo.birthDay);
              delete formInfo.password;
              delete formInfo.confirmEmail;
              if (customerLogin) {
                  Transaction.wrap(function () {
                      profile.setFirstName(formInfo.firstName);
                      profile.setLastName(formInfo.lastName);
                      profile.setEmail(formInfo.email);
                      profile.setPhoneHome(formInfo.phone);
                      profile.setBirthday(new Date(formInfo.birthDay));
                  });

                  // Send account edited email
                  accountHelpers.sendAccountEditedEmail(customer.profile);
                  accountHelpers.insertFolPerson(formInfo);

                  delete formInfo.profileForm;
                  delete formInfo.email;

                  res.json({
                      success: true,
                      redirectUrl: URLUtils.url('Account-Show').toString()
                  });
              } else {
                  if (!status.error) {
                      formInfo.profileForm.customer.email.valid = false;
                      formInfo.profileForm.customer.email.error =
                          Resource.msg('error.message.username.invalid', 'forms', null);
                  }

                  delete formInfo.profileForm;
                  delete formInfo.email;

                  res.json({
                      success: false,
                      fields: formErrors.getFormErrors(profileForm)
                  });
              }
          });
      } else {
          res.json({
              success: false,
              fields: formErrors.getFormErrors(profileForm)
          });
      }
      return next();
  }
);

module.exports = server.exports();