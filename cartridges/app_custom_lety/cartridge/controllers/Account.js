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
    { 
      Empresa: 1, 
      s_IdMembresia: req.querystring.letyCard 
    }
  );

  /*let Func_DatosMembresia = ApiServiceLety.ApiLety("Func_DatosMembresia", {
    Empresa: 1,
    s_IdMembresia: req.querystring.letyCard ,
  });

  let getLetyClub = ApiServiceLety.ApiLety(
    "getLetyClub",
    { 
      Empresa: 1, 
      s_IdMembresia: req.querystring.letyCard 
    }
  );

  let Func_ActualizaDatosMembresia = ApiServiceLety.ApiLety(
    "Func_ActualizaDatosMembresia",
    { 
      Empresa: 1, 
      s_IdMembresia: req.querystring.letyCard,
      i_IdFolioPersona:"713261001",
      s_Nombre:"dkjdkjfd",
      s_Appaterno:"prueba",
      s_Apmaterno:"prueba",
      s_FechaNacimiento:"02/10/2008",
      s_Sexo:"M",
      i_IdCiudad:"1086",
      s_EdoCivil:"Soltero",
      s_PastelFavorito:"cubano",
      s_Direccion:"sdffdsdf",
      s_Colonia:"sdffdsdf",
      s_Telefono:"9987645673",
      s_Mail:"pruebaprueba" 
    }
  );

  let getLetyClubQuitarPuntos = ApiServiceLety.ApiLety(
    "getLetyClubQuitarPuntos",
    { 
      Empresa: 1, 
      s_IdMembresia: req.querystring.letyCard,
      dMonto:"20",
      dSaldoAnterior:"50",
      sFolioWeb:"22332" 
    }
  );

  let Func_ExisteMembrecia = ApiServiceLety.ApiLety(
    "Func_ExisteMembrecia",
    { 
      Empresa: 1, 
      s_IdMembresia: req.querystring.letyCard 
    }
  );


  let Func_AsignaNuevaMembresia = ApiServiceLety.ApiLety(
    "Func_AsignaNuevaMembresia",
    { 
      Empresa: 1, 
      s_IdMembresia: req.querystring.letyCard,
      s_Nombre:"dkjdkjfd",
      s_Appaterno:"prueba",
      s_Apmaterno:"prueba",
      s_FechaNacimiento:"02/10/2008",
      s_Sexo:"M",
      i_IdCiudad:"1086",
      s_EdoCivil:"Soltero",
      s_PastelFavorito:"cubano",
      s_Direccion:"sdffdsdf",
      s_Colonia:"sdffdsdf",
      s_Telefono:"9987645673",
      s_Mail:"pruebaprueba" 
    }
  );
*/

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

const LetyCard= req.form.letyCard;
const Customer= req.form.customerNo;

  addLetyCardToCustomer(Customer,LetyCard);
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
