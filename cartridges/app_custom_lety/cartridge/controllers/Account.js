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

    let JsonDatosMembresia;

    if(Func_DatosMembresia.ERROR){
      JsonDatosMembresia = {};
    }else{
      JsonDatosMembresia = JSON.parse(Func_DatosMembresia);
      /*SaldoMembresia = JsonDatosMembresia.Func_DatosMembresia[0]["d_SaldoMembresia"];
      FechaAlta = JsonDatosMembresia.Func_DatosMembresia[0]["sdtm_FechaAlta"];
      StatusMembresia = JsonDatosMembresia.Func_DatosMembresia[0]["sc_Status"];*/
    }
 
    
  res.render("account/saldoLetyClub", {
    Account: {
      LetyCard: letyCard,
      JsonDatosMembresia: JsonDatosMembresia,
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
    "Func_MovimientosMembresia",
    { Empresa: 1, s_IdMembresia: req.querystring.letyCard }
  );

  if(Func_MovimientosMembresia.ERROR) {
    ListaMovimientos = []
  }else{
    let JsonMovimientosMembresia = JSON.parse(Func_MovimientosMembresia);
    ListaMovimientos =JsonMovimientosMembresia.Func_MovimientosMembresia;
  }

  res.render("account/movesLetyClub", { ListaMovimientos: ListaMovimientos, arrayMovimientos: JSON.stringify(ListaMovimientos ) });
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
