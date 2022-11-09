"use strict";

/**
 * @namespace Checkout
 */

const server = require("server");
server.extend(module.superModule);

const URLUtils = require("dw/web/URLUtils");
const csrfProtection = require("*/cartridge/scripts/middleware/csrf");
const consentTracking = require("*/cartridge/scripts/middleware/consentTracking");

const {
  addLetyCardToCustomer,
} = require("*/cartridge/scripts/helpers/letyCardHelpers");


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