"use strict";

const server = require("server");
const URLUtils = require("dw/web/URLUtils");
const {
  addLetyCardToCustomer,
} = require("*/cartridge/scripts/helpers/letyCardHelpers");
const ApiServiceLety = require("*/cartridge/scripts/jobs/api");

server.extend(module.superModule);

server.append(
  'Show',
  function (req, res, next) {
      const viewData = res.getViewData();
      let Func_MovimientosMembresia = ApiServiceLety.ApiLety(
        "Func_MovimientosMembresia",
        { Empresa: 1, s_IdMembresia: req.querystring.letyCard }
      );
    
      let bloquearBoton = true;
      if(Array.isArray(Func_MovimientosMembresia)) {
        bloquearBoton = true;
        let JsonMovimientosMembresia = JsonMovimientosMembresia = JSON.parse(Func_MovimientosMembresia);
        let ListaMovimientos =JsonMovimientosMembresia.Func_MovimientosMembresia;
      } else {
        bloquearBoton = false;
        
      }

      res.render('account/accountDashboard', {
        bloquearBoton: bloquearBoton
      });
      next();
  }
);

server.get("Saldo", server.middleware.https, function (req, res, next) {
  let letyCard = req.querystring.letyCard;
  let Func_DatosMembresia = ApiServiceLety.ApiLety("Func_DatosMembresia", {
    Empresa: 1,
    s_IdMembresia: letyCard,
  });
  let SaldoMembresia = 0;
  let FechaAlta = 0;
  let StatusMembresia = 0;
 
  if(typeof(Func_DatosMembresia.d_SaldoMembresia)){
    let JsonDatosMembresia = JSON.parse(Func_DatosMembresia);
    SaldoMembresia =
    JsonDatosMembresia.Func_DatosMembresia[0]["d_SaldoMembresia"];
    FechaAlta = JsonDatosMembresia.Func_DatosMembresia[0]["sdtm_FechaAlta"];
    StatusMembresia = JsonDatosMembresia.Func_DatosMembresia[0]["sc_Status"];
  }

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
  let ListaMovimientos = 0;


 /* let Func_MovimientosMembresia = ApiServiceLety.ApiLety(
    "Func_MovimientosMembresia",
    { Empresa: 1, s_IdMembresia: req.querystring.letyCard }
  );

    let JsonMovimientosMembresia = JSON.parse(Func_MovimientosMembresia);
    ListaMovimientos =JsonMovimientosMembresia.Func_MovimientosMembresia;*/

  //res.render("account/movesLetyClub", { ListaMovimientos: {} });
  res.render("account/movesLetyClub", { ListaMovimientos: ListaMovimientos });
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
