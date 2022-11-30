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
  
  /* Woring */
  
  let CatalogoCiudades = ApiServiceLety.ApiLety(
    "CatalogoCiudades",
    {
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
    "CatalogoEstados",
    {
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
      s_Nombre:"",
      s_Appaterno:"",
      s_Apmaterno:"",
      s_FechaNacimiento:"",
      s_Sexo:"",
      i_IdCiudad:"",
      s_EdoCivil:"",
      s_PastelFavorito:"",
      s_Direccion:"",
      s_Colonia:"",
      s_Telefono:"",
      s_Mail:"" 
    }
  );

let CatalogoCiudades = ApiServiceLety.ApiLety(
  "CatalogoCiudades",
  { 
    Empresa: 1, 
    IdEstado: "0" 
  }
);

let CatalogoEstados = ApiServiceLety.ApiLety(
  "CatalogoEstados",
  { 
    Empresa: 1
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
);

let RegistraServDom = ApiServiceLety.ApiLety(
  "RegistraServDom",
  { 
    IdEmpresa: 1, 
    iIdCentroAlta:"201",
    iIdServDom:"0",
    iIdCentroAfecta:"3",
    iIdFolioPersona:"90000",
    iIdFolioDireccion:"9201",
    dtFechaAlta:"2022-11-11T05:10:55.555",
    dtFechaEntrega:"2022-11-11T05:10:55.555",
    iIdUsuarioAlta:"1",
    bIndFactura:"0",
    sObservaciones:"RegistroPrueba",
    iIdCentroAlta:"201",
    iIdServDom:"0",
    iIdMaterial:"51",
    dPrecio:"100",
    dPrecioBase:"100",
    dCantidad:"1",
    dCantidadBase:"1",
    iIdUnidad:"1",
    iIdUnidadBase:"1",
    dPorcDescuento:"0",
    dMontoDescuento:"0",
    dPorcIVA:"0",
    dMontoIVA:"0",
    dPorcIEPS:"0",
    dMontoIEPS:"0",
    iIdCombo:"0",
    iIdCentroAlta:"201",
    iIdServDom:"0",
    iIdFormaDePago:"3",
    dMonto:"100",
    TipoDeCambio:"1",
    dImporte:"100",
    sFolioTarjeta:"30120013178",
    dMontoLetyPesos:"0",
    NombreCompleto:"Nombre de prueba",
    Municipio:"Prueba",
    Estado:"Prueba"
  }
);

let InsertaPersonaDireccion = ApiServiceLety.ApiLety(
  "InsertaPersonaDireccion",
  { 
    IdEmpresa: 1, 
    iIdFolioPersona:"10501",
    iIdCentro:"617",
    iIdDireccion:"0",
    iIdFolioDireccion:"0",
    sDireccion:"Prueba",
    sColonia:"Prueba",
    sCP:"66350",
    sTelefono1:"1234567890",
    sTelefono2:"7894561320",
    sEntreCalles:"calles test",
    sObservaciones:"test",
    iIdCiudad:"1086",
    dLatitud:"0.0",
    dLongitud:"0.0",
    sNoInterior:"520",
    sNoExterior:"520",
    iIdUsuario:"1",
    dtFecha:"2022-11-25T10:11:00",
    iTipoDireccion:"0",
    address:"Av Juan Pablo II 551, Sin Nombre de Col 35, 66490 San Nicolás de los Garza, N.L"
  }
);
*/

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
      let s_Sexo = data.s_Sexo;
       if(dtFechaNacimiento == undefined || dtFechaNacimiento == null) dtFechaNacimiento = "";
       if(PreferenciaProducto == undefined || PreferenciaProducto == null) PreferenciaProducto = "";
       if(s_Sexo == undefined || s_Sexo == null) s_Sexo = "";
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
  
 server.post("getState", (req, res, next) => {
  
  const {idEstado} = JSON.parse(req.body);
  
  let CatalogoEstados = ApiServiceLety.ApiLety(
    "CatalogoEstados",
    {
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
    JsonDatosEstados:JsonDatosEstados
  });
  
  next();
 });
 
 
 
module.exports = server.exports();