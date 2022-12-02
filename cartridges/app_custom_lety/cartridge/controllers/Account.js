"use strict";

const server = require("server");
const URLUtils = require("dw/web/URLUtils");
const {
  addLetyCardToCustomer,
  crearLetyCard,
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

  const LetyCard = req.form.letyCard;
  const Customer = req.form.customerNo;

  addLetyCardToCustomer(Customer, LetyCard);
  res.redirect(URLUtils.url("Account-Show"));
  next();
});

server.post("GenerateLetyCard", (req, res, next) => {
  const Custom = req.form.customerNo;
  const letyCardNew = crearLetyCard(Custom);
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
    if (iIdFolioPersona != "" || iIdFolioPersona != undefined != null) { // suele llegar con comillas.
      let dtFechaNacimiento = data.dtFechaNacimiento;
      let PreferenciaProducto = data.PreferenciaProducto;
      let s_Sexo = data.s_Sexo;
      let s_EstadoCivil = data.s_EstadoCivil;
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

server.post("getState", (req, res, next) => {

  const {
    idEstado
  } = JSON.parse(req.body);

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

  //let { sNombre } = JsonDatosEstados.find(item => item.iIdEstado === stringify(idEstado));

  res.json({
    JsonDatosEstados: JsonDatosEstados
  });

  next();
});


/* working create card... */
server.post("AddLetyCardMember", server.middleware.https, function (req, res, next) {
  res.render("account/cardLetyClub", {
    /*Account: {
      LetyCard: letyCard,
      JsonDatosMembresia: JsonDatosMembresia,
      JsonDatosCiudades: JsonDatosCiudades,
      JsonDatosEstados: JsonDatosEstados
    }*/
  });
  next();
});
/* working create card... */


module.exports = server.exports();