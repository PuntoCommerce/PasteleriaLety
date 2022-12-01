"use strict";

/**
 * @namespace Checkout
 */

const server = require("server");
server.extend(module.superModule);

const URLUtils = require("dw/web/URLUtils");
const csrfProtection = require("*/cartridge/scripts/middleware/csrf");
const consentTracking = require("*/cartridge/scripts/middleware/consentTracking");
const ApiServiceLety = require("*/cartridge/scripts/jobs/api");
const {
  addLetyCardToCustomer,
} = require("*/cartridge/scripts/helpers/letyCardHelpers");
const Site = require("dw/system/Site");
var BasketMgr = require('dw/order/BasketMgr');

server.append("Begin", (req, res, next) => {
  const viewData = res.getViewData();

  let adjustmentApplied = false;
  /*
    Find price adjustmetn.
    If the browser refreshes, it looks to see if an adjustment already exists.
  */
  try {
    const currentBasket = BasketMgr.getCurrentBasket();
    if(currentBasket.priceAdjustments.length > 0) {
      adjustmentApplied = true;
    }
  } catch (error) {
    adjustmentApplied = false;
  }
  viewData.customer.adjustmentApplied = adjustmentApplied;
  /* end */

  let jsonStoreSchedule =
    Site.getCurrent().getCustomPreferenceValue("jsonStoreSchedule");
  viewData.jsonStoreSchedule = jsonStoreSchedule;

  let Func_DatosMembresia = ApiServiceLety.ApiLety("Func_DatosMembresia", {
    Empresa: 1,
    s_IdMembresia: viewData.customer.LetyCard,
  });

  if (!Func_DatosMembresia.error) {
    let JsonDatosMembresia = JSON.parse(Func_DatosMembresia);
    let SaldoMembresia =
      JsonDatosMembresia.Func_DatosMembresia[0].d_SaldoMembresia;

    viewData.customer.saldo = SaldoMembresia;
  }
  res.setViewData(viewData);

  next();
});

server.get(
  "oAuth",
  consentTracking.consent,
  server.middleware.https,
  csrfProtection.generateToken,
  (req, res, next) => {
    const actionUrl = URLUtils.url("Account-Login", "rurl", 2);
    let rememberMe = false;
    if (req.currentCustomer.credentials) {
      rememberMe = true;
    }

    const isAuth = req.session;

    const profileForm = server.forms.getForm("profile");
    profileForm.clear();

    if (req.session.raw.customer.authenticated) {
      res.redirect(URLUtils.url("Checkout-Begin"));
    } else {
      res.render("checkout/auth", {
        profileForm: profileForm,
        rememberMe: rememberMe,
        actionUrl: actionUrl,
        oAuthReentryEndpoint: 2,
      });
    }
    next();
  }
);

server.post("AddLetyCard", (req, res, next) => {
  addLetyCardToCustomer(req.form);
  res.redirect(URLUtils.url("Checkout-Begin"));
  next();
});

server.post("GenerateLetyCard", (req, res, next) => {
  addLetyCardToCustomer({
    customerNo: req.form.customerNo,
    letyCard: Date.now(),
  });

  res.redirect(URLUtils.url("Checkout-Begin"));
  next();
});

module.exports = server.exports();
