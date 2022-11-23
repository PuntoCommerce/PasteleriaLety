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
  
    if (iIdFolioPersona != "" || iIdFolioPersona != undefined != null) {// suele llegar con comillas.
  
      let dtFechaNacimiento = data.dtFechaNacimiento;
      let PreferenciaProducto = data.PreferenciaProducto;
      //let s_Sexo = data.PreferenciaProducto;
  
      if(dtFechaNacimiento == undefined || dtFechaNacimiento == null) dtFechaNacimiento = "";
  
      if(PreferenciaProducto == undefined || PreferenciaProducto == null) PreferenciaProducto = "";
  
      let Func_ActualizaDatosMembresia = ApiServiceLety.ApiLety(
        "Func_ActualizaDatosMembresia", {
          Empresa: 1,
          s_IdMembresia: data.lLetyCard,
          i_IdFolioPersona: iIdFolioPersona,
          s_Nombre: data.s_Nombre,
          s_Appaterno: data.s_ApellidoPat,
          s_Apmaterno: data.s_Apmaterno,
          s_FechaNacimiento: dtFechaNacimiento,
          s_Sexo: "Masculino",
          i_IdCiudad: "1086",
          s_EdoCivil: "Soltero",
          s_PastelFavorito: PreferenciaProducto,
          s_Direccion: "Avenina 12",
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
 

module.exports = server.exports();