"use strict";

function responseEndPoint(xml, path) {
  if (path === "ExistenciaPorCentroFecha") {
    let json = '{"' + path + '":[';

    let Existencia = XMLList(xml).descendants("Existencia");

    if (Existencia.length() === 0) {
      json += '{"error":"Error en la respuesta"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < Existencia.length(); i++) {
        json += '{"Existencia":"' + Existencia[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    return json;
  }

  if (path === "CatalogoCiudades") {
    let json = '{"' + path + '":[';

    let iIdCi = XMLList(xml).descendants("iIdCiudad");
    let iIdEs = XMLList(xml).descendants("iIdEstado");
    let sAbr = XMLList(xml).descendants("sAbreviacion");
    let sNom = XMLList(xml).descendants("sNombre");
    let dtA = XMLList(xml).descendants("dtAlta");
    let iIdUs = XMLList(xml).descendants("iIdUsrAlta");
    let dtMod = XMLList(xml).descendants("dtModifica");
    let iIdUsrMod = XMLList(xml).descendants("iIdUsrModifica");

    if (iIdCi.length() === 0) {
      json += '{"error":"Error en la respuesta o No hay datos de membresia"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < iIdCi.length(); i++) {
        json += '{"iIdCiudad":"' + iIdCi[i] + '","iIdEstado":"' + iIdEs[i] + '","sAbreviacion":"' + sAbr[i] + '","sNombre":"' + sNom[i] + '","dtAlta":"' + dtA[i] + '","iIdUsrAlta":"' + iIdUs[i] + '","dtModifica":"' + dtMod[i] + '","iIdUsrModifica":"' + iIdUsrMod[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    //json = json.slice(0,-1)+']}';

    return json;
  }
  if (path === "CatalogoEstados") {
    let json = '{"' + path + '":[';

    let iId = XMLList(xml).descendants("iIdPais");
    let iIdE = XMLList(xml).descendants("iIdEstado");
    let sAb = XMLList(xml).descendants("sAbreviacion");
    let sNo = XMLList(xml).descendants("sNombre");
    let dt = XMLList(xml).descendants("dtAlta");
    let iIdU = XMLList(xml).descendants("iIdUsrAlta");
    let dtMo = XMLList(xml).descendants("dtModifica");
    let iIdUsrMo = XMLList(xml).descendants("iIdUsrModifica");

    if (iId.length() === 0) {
      json += '{"error":"Error en la respuesta o No hay datos de membresia"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < iId.length(); i++) {
        json += '{"iIdPais":"' + iId[i] + '","iIdEstado":"' + iIdE[i] + '","sAbreviacion":"' + sAb[i] + '","sNombre":"' + sNo[i] + '","dtAlta":"' + dt[i] + '","iIdUsrAlta":"' + iIdU[i] + '","dtModifica":"' + dtMo[i] + '","iIdUsrModifica":"' + iIdUsrMo[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    //json = json.slice(0,-1)+']}';

    return json;
  }
  if (path === "NewCalculoSD") {
    let json = '{"' + path + '":[';
    let bAplica = XMLList(xml).descendants("bAplica");
    let dCosto = XMLList(xml).descendants("dCosto");

    if (bAplica.length() === 0 || dCosto.length() === 0) {
      json += '{"error":"Error en la respuesta"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < bAplica.length(); i++) {
        json += '{"bAplica":"' + bAplica[i] + '","dCosto":"' + dCosto[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    return json;
  }

  if (path === "getLetyClub") {
    let json = '{"' + path + '":[';
    let dtFechaUltMov = XMLList(xml).descendants("dtFechaUltMov");
    let iIdMembresia = XMLList(xml).descendants("iIdMembresia");
    let bExiste = XMLList(xml).descendants("bExiste");
    let bVigente = XMLList(xml).descendants("bVigente");
    let dSaldo = XMLList(xml).descendants("dSaldo");
    if (bExiste.length() === 0 || bVigente.length() === 0 || dtFechaUltMov.length() === 0 || dSaldo.length() === 0 || iIdMembresia.length() === 0) {
      json += '{"error":"Error en la respuesta"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < bExiste.length(); i++) {
        json += '{"bExiste":"' + bExiste[i] + '","bVigente":"' + bVigente[i] + '","dtFechaUltMov":"' + dtFechaUltMov[i] + '","dSaldo":"' + dSaldo[i] + '","iIdMembresia":"' + iIdMembresia[i] + '"},';
      }
      //"'+encodeURIComponent(dtFechaUltMov[i])+'"
      json = json.slice(0, -1) + ']}';
    }
    return json;
  }

  if (path === "Func_DatosMembresia") {
    let json = '{"' + path + '":[';
    let iIdFolioPersona = XMLList(xml).descendants("iIdFolioPersona");
    let s_Nombre = XMLList(xml).descendants("s_Nombre");
    let s_ApellidoPat = XMLList(xml).descendants("s_ApellidoPat");
    let s_ApellidoMat = XMLList(xml).descendants("s_ApellidoMat");
    let s_Direccion = XMLList(xml).descendants("s_Direccion");
    let s_Telefono1 = XMLList(xml).descendants("s_Telefono1");
    let s_Mail = XMLList(xml).descendants("s_Mail");
    let d_SaldoMembresia = XMLList(xml).descendants("d_SaldoMembresia");
    let sdtm_FechaAlta = XMLList(xml).descendants("sdtm_FechaAlta");
    let s_Colonia = XMLList(xml).descendants("s_Colonia");
    let iIdC = XMLList(xml).descendants("iIdCiudad");
    let Ciudad = XMLList(xml).descendants("Ciudad");
    let iIdEstado = XMLList(xml).descendants("iIdEstado");
    let Estado = XMLList(xml).descendants("Estado");
    let s_Sexo = XMLList(xml).descendants("s_Sexo");
    let s_EstadoCivil = XMLList(xml).descendants("s_EstadoCivil");
    let PreferenciaProducto = XMLList(xml).descendants("PreferenciaProducto");
    let dtFechaNacimiento = XMLList(xml).descendants("dtFechaNacimiento");
    let sc_Status = XMLList(xml).descendants("sc_Status");

    if (d_SaldoMembresia.length() === 0 || sdtm_FechaAlta.length() === 0 || sc_Status.length() === 0 || s_Nombre.length() === 0 || s_ApellidoPat.length() === 0 || s_ApellidoMat.length() === 0 || s_Mail.length() === 0 || s_Telefono1.length() === 0 || s_Colonia.length() === 0 || Ciudad.length() === 0 || Estado.length() === 0) {
      json += '{"error":"Error en la respuesta"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < d_SaldoMembresia.length(); i++) {
        json += '{"d_SaldoMembresia":"' + d_SaldoMembresia[i] +
          '","sdtm_FechaAlta":"' + sdtm_FechaAlta[i] +
          '","sc_Status":"' + sc_Status[i] +
          '","s_Nombre":"' + s_Nombre[i] +
          '","s_ApellidoPat":"' + s_ApellidoPat[i] +
          '","s_ApellidoMat":"' + s_ApellidoMat[i] +
          '","s_Direccion":"' + s_Direccion[i] +
          '","s_Mail":"' + s_Mail[i] +
          '","s_Telefono1":"' + s_Telefono1[i] +
          '","s_Colonia":"' + s_Colonia[i] +
          '","Ciudad":"' + Ciudad[i] +
          '","Estado":"' + Estado[i] +
          '","s_Sexo":"' + s_Sexo[i] +
          '","s_EstadoCivil":"' + s_EstadoCivil[i] +
          '","PreferenciaProducto":"' + PreferenciaProducto[i] +
          '","dtFechaNacimiento":"' + dtFechaNacimiento[i] +
          '","iIdCiudad":"' + iIdC[i] +
          '","iIdEstado":"' + iIdEstado[i] +
          '","iIdFolioPersona":"' + iIdFolioPersona[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    return json;
  }
  if (path === "Func_ActualizaDatosMembresia") {
    let json = '{"' + path + '":[';
    let Cod = XMLList(xml).descendants("iCode");
    let sMe = XMLList(xml).descendants("sMensaje");

    if (Cod.length() === 0) {
      json += '{"error":"Error en la respuesta o No hay datos de membresia"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < Cod.length(); i++) {
        json += '{"iCode":"' + Cod[i] + '","sMensaje":"' + sMe[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    json = json.slice(0, -1) + ']}';

    return json;
  }
  if (path === "InsertaDatosVentaWeb") {
    // let json = '{"'+path+'":[';
    let Co = XMLList(xml).descendants("iCode");
    let sM = XMLList(xml).descendants("sMensaje");

    return { iCode: Co.toString(), sMensaje: sM.toString() };
  }

  if (path === "InsertaPersonaDireccion") {
    let oRequest = XMLList(xml).descendants("oRequest");
    let iIdFolioDireccion = oRequest.descendants("iIdFolioDireccion");
    let tableResponse = XMLList(xml).descendants("TableResponse");
    let firstICode = tableResponse.descendants("iCode")[0];
    let firstMessage = tableResponse.descendants("sMensaje")[0];

    let oRequest2 = XMLList(xml).descendants("oRequest2");
    let sMensaje2 = oRequest2.descendants("sMensaje");
    let bAplica2 = oRequest2.descendants("bAplica");
    let dCosto2 = oRequest2.descendants("dCosto");
    let iCode = oRequest2.descendants("iCode");

    return {
      iIdFolioDireccion: iIdFolioDireccion.toString(),
      sMensaje: sMensaje2.toString(),
      bAplica: bAplica2.toString(),
      dCost: dCosto2.toString(),
      iCode: iCode.toString(),
      firstICode: firstICode.toString(),
      firstMessage: firstMessage.toString()
    };
  }

  if (path === "RegistraServDom") {
    let tableResponse = XMLList(xml).descendants("TableResponse");
    let firstICode = tableResponse.descendants("iCode")[0];
    let firstMessage = tableResponse.descendants("sMensaje")[0];
    let secondICode = tableResponse.descendants("iCode")[1];
    let secondMessage = tableResponse.descendants("sMensaje")[1];
    return {
      firstICode: firstICode.toString(),
      firstMessage: firstMessage.toString(),
      secondICode: secondICode.toString(),
      secondMessage: secondMessage.toString()
    };
  }

  if (path === "Func_MovimientosMembresia") {
    let json = '{"' + path + '":[';

    let dtFechaAplica = XMLList(xml).descendants("dtFechaAplica");
    let Centro = XMLList(xml).descendants("Centro");
    let TipoMovimiento = XMLList(xml).descendants("TipoMovimiento");
    let Cargo = XMLList(xml).descendants("Cargo");
    let Abono = XMLList(xml).descendants("Abono");
    let dSaldoAnterior = XMLList(xml).descendants("dSaldoAnterior");

    if (dtFechaAplica.length() === 0) {
      json += '{"error":"Error en la respuesta o No hay datos de membresia"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < dtFechaAplica.length(); i++) {
        json += '{"dtFechaAplica":"' + dtFechaAplica[i] + '","Centro":"' + Centro[i] + '","TipoMovimiento":"' + TipoMovimiento[i] + '","Cargo":"' + Cargo[i] + '","Abono":"' + Abono[i] + '","dSaldoAnterior":"' + dSaldoAnterior[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    return json;
  }

  if (path === "getLetyClubQuitarPuntos") {
    let json = '{"' + path + '":[';

    let Code = XMLList(xml).descendants("iCode");
    let Mens = XMLList(xml).descendants("sMensaje");


    if (Code.length() === 0) {
      json += '{"error":"Error en la respuesta o No hay datos de membresia"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < Code.length(); i++) {
        json += '{"iCode":"' + Code[i] + '","sMensaje":"' + Mens[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    json = json.slice(0, -1) + ']}';

    return json;
  }

  if (path === "Func_ExisteMembrecia") {
    let json = '{"' + path + '":[';

    let Column1 = XMLList(xml).descendants("Column1");

    if (Column1.length() === 0) {
      json += '{"error":"Error de la respuesta o Fue Eliminado correctamente"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < Column1.length(); i++) {
        json += '{"Column1":"' + Column1[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    return json;
  }

  if (path === "Func_AsignaNuevaMembresia") {
    let json = '{"' + path + '":[';

    let iIdMem = XMLList(xml).descendants("iIdMembresia");
    let iIdFol = XMLList(xml).descendants("iIdFolioPersona");
    let sIdFol = XMLList(xml).descendants("sIdFolioTarjeta");

    if (iIdMem.length() === 0) {
      json += '{"error":"Error de la respuesta"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < iIdMem.length(); i++) {
        json += '{"iIdMembresia":"' + iIdMem[i] + '","iIdFolioPersona":"' + iIdFol[i] + '","sIdFolioTarjeta":"' + sIdFol[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }

    return json;
  }
  if (path === "ListaClientesFromMembresia") {
    let json = '{"' + path + '":[';

    let codeResponse = XMLList(xml).descendants("iCode");
    let iIdFolioPersona = XMLList(xml).descendants("iIdFolioPersona");
    let iIdPersona = XMLList(xml).descendants("iIdPersona");
    let s_Direccion = XMLList(xml).descendants("s_Direccion");
    let sIdFolioTarjeta = XMLList(xml).descendants("sIdFolioTarjeta");
    let sIdEstatus = XMLList(xml).descendants("sIdEstatus");
    let dtFechaAlta = XMLList(xml).descendants("dtFechaAlta");
    let iIdCentroAlta = XMLList(xml).descendants("iIdCentroAlta");
    let sNombre = XMLList(xml).descendants("sNombre");
    let sApellidoPaterno = XMLList(xml).descendants("sApellidoPaterno");
    let sApellidoMaterno = XMLList(xml).descendants("sApellidoMaterno");
    let sTelefono1 = XMLList(xml).descendants("sTelefono1");
    let sColonia = XMLList(xml).descendants("sColonia");
    let sCorreoElectronico = XMLList(xml).descendants("sCorreoElectronico");
    let iIdCentro = XMLList(xml).descendants("iIdCentro");
    let iIdCiudad = XMLList(xml).descendants("iIdCiudad");
    let dtFechaNacimiento = XMLList(xml).descendants("dtFechaNacimiento");
    let dLatitud = XMLList(xml).descendants("dLatitud");
    let dLongitud = XMLList(xml).descendants("dLongitud");
    let sEstatus = XMLList(xml).descendants("sEstatus");
    let dtFechaModificacion = XMLList(xml).descendants("dtFechaModificacion");
    let iTipoPersona = XMLList(xml).descendants("iTipoPersona");

    if (sCorreoElectronico.length() === 0) {
      json += '{"error":"Error en la respuesta o No hay datos de membresia"},';
      json = json.slice(0, -1) + ']}';
    } else {
      for (let i = 0; i < sIdFolioTarjeta.length(); i++) {
        json += '{"iTipoPersona":"' + iTipoPersona[i] + '","dtFechaModificacion":"' + dtFechaModificacion[i] + '","sEstatus":"' + sEstatus[i] + '","dLongitud":"' + dLongitud[i] + '","dLatitud":"' + dLatitud[i] + '","dtFechaNacimiento":"' + dtFechaNacimiento[i] + '","iIdCiudad":"' + iIdCiudad[i] + '","iIdCentro":"' + iIdCentro[i] + '","iIdFolioPersona":"' + iIdFolioPersona[i] + '","iIdPersona":"' + iIdPersona[i] + '","sIdFolioCard":"' + sIdFolioTarjeta[i] + '","sIdStatus":"' + sIdEstatus[i] + '","dtDateHigh":"' + dtFechaAlta[i] + '","iIdCentroAlta":"' + iIdCentroAlta[i] + '","Name":"' + sNombre[i] + '","sPaternalLastName":"' + sApellidoPaterno[i] + '","sMaternalLastName":"' + sApellidoMaterno[i] + '","sPhone1":"' + sTelefono1[i] + '","sCologne":"' + sColonia[i] + '","sEmail":"' + sCorreoElectronico[i] + '","sDireccion":"' + s_Direccion[i] + '"},';
      }
      json = json.slice(0, -1) + ']}';
    }
    return json;
  }
  if (path === "ActualizaPersona" || path === "InsertaPersona") {
    var Logger = require('dw/system/Logger');
    let logger = Logger.getLogger("ERP_Member", "ERP_Member")
    logger.warn("Type: {0} payload {1}", 'INFO', xml);

    let Co = XMLList(xml).descendants("iCode");
    let sM = XMLList(xml).descendants("sMensaje");

    return { iCode: Co.toString(), sMensaje: sM.toString() };
  }
  if (path === 'GetFolioPersona') {
    let Co = XMLList(xml).descendants("iCode");
    let sM = XMLList(xml).descendants("sMensaje");
    let iIdFolioPersona = XMLList(xml).descendants("iIdFolioPersona");

    return {
      iIdFolioPersona: iIdFolioPersona,
      iCode: Co,
      sMessaje: sM
    }
  }
}

module.exports = {
  responseEndPoint: responseEndPoint,
};