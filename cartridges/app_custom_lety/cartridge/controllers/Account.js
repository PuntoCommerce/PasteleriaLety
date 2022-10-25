"use strict";

const server = require("server");
const URLUtils = require("dw/web/URLUtils");
const {
  addLetyCardToCustomer,
} = require("*/cartridge/scripts/helpers/letyCardHelpers");
const ApiServiceLety = require("*/cartridge/scripts/jobs/api");

server.extend(module.superModule);

server.get("Saldo", server.middleware.https, function (req, res, next) {
  let letyCard = req.querystring.letyCard;

  let Func_DatosMembresia = ApiServiceLety.ApiLety("Func_DatosMembresia", {
    Empresa: 1,
    s_IdMembresia: letyCard,
  });
  let JsonDatosMembresia = JSON.parse(Func_DatosMembresia);
  let SaldoMembresia =
    JsonDatosMembresia.Func_DatosMembresia[0]["d_SaldoMembresia"];
  let FechaAlta = JsonDatosMembresia.Func_DatosMembresia[0]["sdtm_FechaAlta"];
  let StatusMembresia = JsonDatosMembresia.Func_DatosMembresia[0]["sc_Status"];

  res.render("account/saldoLetyClub", {
    Account: {
      LetyCard: letyCard,
      SaldoMembresia: SaldoMembresia,
      FechaAlta: FechaAlta,
      StatusMembresia: StatusMembresia,
    },
  });
  next();
});

server.get("Movimientos", server.middleware.https, function (req, res, next) {
  var Site = require("dw/system/Site");
  var PageMgr = require("dw/experience/PageMgr");
  var pageMetaHelper = require("*/cartridge/scripts/helpers/pageMetaHelper");
  var accountHelpers = require("*/cartridge/scripts/account/accountHelpers");

  let Func_MovimientosMembresia = ApiServiceLety.ApiLety(
    "Func_MovimientosMembresia",
    { Empresa: 1, s_IdMembresia: req.querystring.letyCard }
  );

  let datos = [
    { num: 1, dato: "Este es el 1" },
    { num: 2, dato: "Este es el 2" },
    { num: 3, dato: "Este es el 3" },
    { num: 4, dato: "Este es el 4 tambien diferente" },
    { num: 5, dato: "Este es el 5" },
    { num: 6, dato: "Este es el 6" },
    { num: 7, dato: "Este es el 7" },
    { num: 8, dato: "Este es el 8 Diferente" },
  ];
  res.render("account/movesLetyClub", { datos: datos });
  next();
});

server.post("AddLetyCard", (req, res, next) => {
  addLetyCardToCustomer(req.form);
  res.redirect(URLUtils.url("Account-Show"));
  next();
});

server.post("GenerateLetyCard", (req, res, next) => {
  addLetyCardToCustomer({
    customerNo: req.form.customerNo,
    letyCard: Date.now(),
  });

  res.redirect(URLUtils.url("Account-Show"));
  next();
});

module.exports = server.exports();
