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

  if (Func_DatosMembresia.ERROR) {
    JsonDatosMembresia = {};
  } else {
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
    "Func_MovimientosMembresia", {
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

let CatalogoCiudades = ApiServiceLety.ApiLety(
  "CatalogoCiudades",
  { 
    Empresa: 1, 
    IdEstado: "0" 
  }
);

let InsertaDatosVentaWeb = ApiServiceLety.ApiLety(
  "InsertaDatosVentaWeb",
  { 
    Empresa: 1, 
    sFolio: "1300",
    sFolioBanco:"500",
    sFolioTarjeta:"200",
    iIdCentro:"201",
    dtFechaColocacion:"2022-11-15T22:00:00.228Z",
    dtFechaAsignacion:"2022-11-15T22:00:00.228Z",
    bindImpreso:"true",
    iIdMaterial:"51",
    dPrecio:"1000",
    iCantidad:"1",
    iIdFormaDePago:"3",
    bdMonto:"100",
    dMontoExtranjero:"0",
    iIdMembresia:"30120013178",
    sReferencia:"test",
    dMontoLetyPesos:"0"
  }
);*/

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

  const LetyCard = req.form.letyCard;
  const Customer = req.form.customerNo;

  addLetyCardToCustomer(Customer, LetyCard);
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

server.post("SaveSaldoForm", (req, res, next) => {

  const josnData = JSON.stringify(req.form);

  const data = JSON.parse(josnData);

  const lastNames = data.s_ApellidoPat.trim().split(" ");

  let Func_ActualizaDatosMembresia = ApiServiceLety.ApiLety(
    "Func_ActualizaDatosMembresia", {
      Empresa: 1,
      s_IdMembresia: data.lLetyCard,
      i_IdFolioPersona: data.iIdFolioPersona,
      s_Nombre: data.s_Nombre,
      s_Appaterno: lastNames[0],
      s_Apmaterno: lastNames[1],
      s_FechaNacimiento: data.dtFechaNacimiento,
      s_Sexo: "Masculino",
      i_IdCiudad: "1086",
      s_EdoCivil: "Soltero",
      s_PastelFavorito: data.PreferenciaProducto,
      s_Direccion: "Avenina 12",
      s_Colonia: data.s_Colonia,
      s_Telefono: data.s_Telefono1,
      s_Mail: data.s_Mail
    }
  );


  let JsonDatosMembresia;

  JsonDatosMembresia = Func_ActualizaDatosMembresia;

  if (JsonDatosMembresia.ERROR) {

    res.json({
      error: 1
    });

  } else {
    res.json({
      error: 0
    })
  }


  next();
});

module.exports = server.exports();