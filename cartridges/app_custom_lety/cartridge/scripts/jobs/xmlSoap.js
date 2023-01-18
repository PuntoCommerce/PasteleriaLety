"use strict";

  function responseEndPoint(xml,path) {
    if(path==="ExistenciaPorCentroFecha"){
      let json = '{"'+path+'":[';

      const Existencia = XMLList(xml).descendants("Existencia");

      if(Existencia.length()===0){
        json+='{"error":"Error en la respuesta"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<Existencia.length();i++){
          json+='{"Existencia":"'+Existencia[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
      return json;
    }

    if(path==="CatalogoCiudades"){
      let json = '{"'+path+'":[';

      const iIdCi = XMLList(xml).descendants("iIdCiudad");
      const iIdEs = XMLList(xml).descendants("iIdEstado");
      const sAbr = XMLList(xml).descendants("sAbreviacion");
      const sNom = XMLList(xml).descendants("sNombre");
      const dtA = XMLList(xml).descendants("dtAlta");
      const iIdUs = XMLList(xml).descendants("iIdUsrAlta");
      const dtMod = XMLList(xml).descendants("dtModifica");
      const iIdUsrMod = XMLList(xml).descendants("iIdUsrModifica");

      if(iIdCi.length()===0){
        json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<iIdCi.length();i++){
          json+='{"iIdCiudad":"'+iIdCi[i]+'","iIdEstado":"'+iIdEs[i]+'","sAbreviacion":"'+sAbr[i]+'","sNombre":"'+sNom[i]+'","dtAlta":"'+dtA[i]+'","iIdUsrAlta":"'+iIdUs[i]+'","dtModifica":"'+dtMod[i]+'","iIdUsrModifica":"'+iIdUsrMod[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }

      //json = json.slice(0,-1)+']}';
 
      return json;
    }
    if(path==="CatalogoEstados"){
      let json = '{"'+path+'":[';

      const iId = XMLList(xml).descendants("iIdPais");
      const iIdE = XMLList(xml).descendants("iIdEstado");
      const sAb = XMLList(xml).descendants("sAbreviacion");
      const sNo = XMLList(xml).descendants("sNombre");
      const dt = XMLList(xml).descendants("dtAlta");
      const iIdU = XMLList(xml).descendants("iIdUsrAlta");
      const dtMo = XMLList(xml).descendants("dtModifica");
      const iIdUsrMo = XMLList(xml).descendants("iIdUsrModifica");

      if(iId.length()===0){
        json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<iId.length();i++){
          json+='{"iIdPais":"'+iId[i]+'","iIdEstado":"'+iIdE[i]+'","sAbreviacion":"'+sAb[i]+'","sNombre":"'+sNo[i]+'","dtAlta":"'+dt[i]+'","iIdUsrAlta":"'+iIdU[i]+'","dtModifica":"'+dtMo[i]+'","iIdUsrModifica":"'+iIdUsrMo[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }

      //json = json.slice(0,-1)+']}';
 
      return json;
    }
    if(path==="NewCalculoSD"){
      let json = '{"'+path+'":[';
      const bAplica = XMLList(xml).descendants("bAplica");
      const dCosto = XMLList(xml).descendants("dCosto");

      if(bAplica.length() === 0 || dCosto.length() === 0){
        json+='{"error":"Error en la respuesta"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<bAplica.length();i++){
          json+='{"bAplica":"'+bAplica[i]+'","dCosto":"'+dCosto[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
      return json;
    }

    if(path==="getLetyClub"){
      let json = '{"'+path+'":[';
      const dtFechaUltMov = XMLList(xml).descendants("dtFechaUltMov");
      const iIdMembresia = XMLList(xml).descendants("iIdMembresia");
      const bExiste = XMLList(xml).descendants("bExiste");
      const bVigente = XMLList(xml).descendants("bVigente");
      const dSaldo = XMLList(xml).descendants("dSaldo");
      if(bExiste.length() === 0 || bVigente.length() === 0 || dtFechaUltMov.length() === 0 || dSaldo.length() === 0 || iIdMembresia.length() === 0 ){
        json+='{"error":"Error en la respuesta"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<bExiste.length();i++){
          json+='{"bExiste":"'+bExiste[i]+'","bVigente":"'+bVigente[i]+'","dtFechaUltMov":"'+dtFechaUltMov[i]+'","dSaldo":"'+dSaldo[i]+'","iIdMembresia":"'+iIdMembresia[i]+'"},';
        }
        //"'+encodeURIComponent(dtFechaUltMov[i])+'"
        json = json.slice(0,-1)+']}';
      }
      return json;
    }

    if(path==="Func_DatosMembresia"){
      let json = '{"'+path+'":[';
      const iIdFolioPersona = XMLList(xml).descendants("iIdFolioPersona");
      const s_Nombre = XMLList(xml).descendants("s_Nombre");
      const s_ApellidoPat = XMLList(xml).descendants("s_ApellidoPat");
      const s_ApellidoMat = XMLList(xml).descendants("s_ApellidoMat");
      const s_Direccion = XMLList(xml).descendants("s_Direccion");
      const s_Telefono1 = XMLList(xml).descendants("s_Telefono1");
      const s_Mail = XMLList(xml).descendants("s_Mail");
      const d_SaldoMembresia = XMLList(xml).descendants("d_SaldoMembresia");
      const sdtm_FechaAlta = XMLList(xml).descendants("sdtm_FechaAlta");
      const s_Colonia = XMLList(xml).descendants("s_Colonia");
      const iIdC = XMLList(xml).descendants("iIdCiudad");
      const Ciudad = XMLList(xml).descendants("Ciudad");
      const iIdEstado = XMLList(xml).descendants("iIdEstado");
      const Estado = XMLList(xml).descendants("Estado");
      const s_Sexo = XMLList(xml).descendants("s_Sexo");
      const s_EstadoCivil = XMLList(xml).descendants("s_EstadoCivil");
      const PreferenciaProducto = XMLList(xml).descendants("PreferenciaProducto");
      const dtFechaNacimiento = XMLList(xml).descendants("dtFechaNacimiento");
      const sc_Status = XMLList(xml).descendants("sc_Status");

      if(d_SaldoMembresia.length() ===0 || sdtm_FechaAlta.length() === 0 || sc_Status.length() === 0 || s_Nombre.length() === 0 || s_ApellidoPat.length() === 0 || s_ApellidoMat.length() === 0 || s_Mail.length() === 0 || s_Telefono1.length() === 0 || s_Colonia.length() === 0 || Ciudad.length() === 0 || Estado.length() === 0){
        json+='{"error":"Error en la respuesta"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<d_SaldoMembresia.length();i++){
          json+='{"d_SaldoMembresia":"'+d_SaldoMembresia[i]+
          '","sdtm_FechaAlta":"'+sdtm_FechaAlta[i]+
          '","sc_Status":"'+sc_Status[i]+
          '","s_Nombre":"'+s_Nombre[i]+
          '","s_ApellidoPat":"'+s_ApellidoPat[i]+
          '","s_ApellidoMat":"'+s_ApellidoMat[i]+
          '","s_Direccion":"'+s_Direccion[i]+
          '","s_Mail":"'+s_Mail[i]+
          '","s_Telefono1":"'+s_Telefono1[i]+
          '","s_Colonia":"'+s_Colonia[i]+
          '","Ciudad":"'+Ciudad[i]+
          '","Estado":"'+Estado[i]+
          '","s_Sexo":"'+s_Sexo[i]+
          '","s_EstadoCivil":"'+s_EstadoCivil[i]+
          '","PreferenciaProducto":"'+PreferenciaProducto[i]+
          '","dtFechaNacimiento":"'+dtFechaNacimiento[i]+
          '","iIdCiudad":"'+iIdC[i]+
          '","iIdEstado":"'+iIdEstado[i]+
          '","iIdFolioPersona":"'+iIdFolioPersona[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
      return json;
    }
    if(path==="Func_ActualizaDatosMembresia"){
      let json = '{"'+path+'":[';
      const Cod = XMLList(xml).descendants("iCode");
      const sMe = XMLList(xml).descendants("sMensaje");

      if(Cod.length()===0){
        json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<Cod.length();i++){
          json+='{"iCode":"'+Cod[i]+'","sMensaje":"'+sMe[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }

      json = json.slice(0,-1)+']}';
 
      return json;
    }
    if(path==="InsertaDatosVentaWeb"){
      // let json = '{"'+path+'":[';
      const Co = XMLList(xml).descendants("iCode");
      const sM = XMLList(xml).descendants("sMensaje");

      // if(Co.length()===0){
      //   json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
      //   json = json.slice(0,-1)+']}';
      // }else{
      //   for(let i =0; i<Co.length();i++){
      //     json+='{"iCode":"'+Co[i]+'","sMensaje":"'+sM[i]+'"},';
      //   }
      //   json = json.slice(0,-1)+']}';
      // }

      // json = json.slice(0,-1)+']}';
 
      return {iCode: Co.toString(), sMensaje: sM.toString()};
    }

    if(path==="InsertaPersonaDireccion"){
      // let json = '{"'+path+'":[';
      // const Codd = XMLList(xml).descendants("iCode");
      // const sMenss = XMLList(xml).descendants("sMensaje");
      // const idFol = XMLList(xml).descendants("iIdFolioPersona");
      // const idC = XMLList(xml).descendants("iIdCentro");
      // const idDi = XMLList(xml).descendants("iIdDireccion");
      // const iIdFolioDire = XMLList(xml).descendants("iIdFolioDireccion");
      // const sDirec = XMLList(xml).descendants("sDireccion");
      // const sCol = XMLList(xml).descendants("sColonia");
      // const sCP = XMLList(xml).descendants("sCP");
      // const sTel1 = XMLList(xml).descendants("sTelefono1");
      // const sTel2 = XMLList(xml).descendants("sTelefono2");
      // const sEntreCa = XMLList(xml).descendants("sEntreCalles");
      // const sObserva = XMLList(xml).descendants("sObservaciones");
      // const iIdCiu = XMLList(xml).descendants("iIdCiudad");
      // const dLat = XMLList(xml).descendants("dLatitud");
      // const dLong = XMLList(xml).descendants("dLongitud");
      // const sMenssajee = XMLList(xml).descendants("sMensaje");
      // const sNoInterior = XMLList(xml).descendants("sNoInterior");
      // const sNoExterior = XMLList(xml).descendants("sNoExterior");
      // const iIdUsuario = XMLList(xml).descendants("iIdUsuario");
      // const dtFecha = XMLList(xml).descendants("dtFecha");
      // const iTipoDireccion = XMLList(xml).descendants("iTipoDireccion");
      // const dCost = XMLList(xml).descendants("dCosto");

      // if(Codd.length()===0){
      //   json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
      //   json = json.slice(0,-1)+']}';
      // }else{
      //   for(let i =0; i<Codd.length();i++){
      //     json+='{"iCode":"'+Codd[i]+'","sMensaje":"'+sMenssajee[i]+'","iIdFolioPersona":"'+idFol[i]+'","iIdCentro":"'+idC[i]+'","iIdDireccion":"'+idDi[i]+'","iIdFolioDireccion":"'+iIdFolioDire[i]+'","sDireccion":"'+sDirec[i]+'","sColonia":"'+sCol[i]+'","sCP":"'+sCP[i]+'","sTelefono1":"'+sTel1[i]+'","sTelefono2":"'+sTel2[i]+'","sEntreCalles":"'+sEntreCa[i]+'","sObservaciones":"'+sObserva[i]+'","iIdCiudad":"'+iIdCiu[i]+'","dLatitud":"'+dLat[i]+'","dLongitud":"'+dLong[i]+'","oRequest2sMensaje":"'+sMenss[i]+'","sNoInterior":"'+sNoInterior[i]+'","sNoExterior":"'+sNoExterior[i]+'","iIdUsuario":"'+iIdUsuario[i]+'","dtFecha":"'+dtFecha[i]+'","iTipoDireccion":"'+iTipoDireccion[i]+'","oRequest2dCosto":"'+dCost[i]+'"},';
      //   }
      //   json = json.slice(0,-1)+']}';
      // }

      // json = json.slice(0,-1)+']}';
 
      // return json;
      const oRequest = XMLList(xml).descendants("oRequest");
      const iIdFolioDireccion = oRequest.descendants("iIdFolioDireccion");

      const oRequest2 = XMLList(xml).descendants("oRequest2");
      const sMensaje2 = oRequest2.descendants("sMensaje");
      const bAplica2 = oRequest2.descendants("bAplica");
      const dCosto2 = oRequest2.descendants("dCosto");
      const iCode = oRequest.descendants("iCode");

      return {
        iIdFolioDireccion: iIdFolioDireccion.toString(),
        sMensaje: sMensaje2.toString(),
        bAplica: bAplica2.toString(),
        dCost: dCosto2.toString(),
        iCode: iCode.toString(),
      };
    }

    if(path==="RegistraServDom"){
      let json = '{"'+path+'":[';
      const Codeee = XMLList(xml).descendants("iCode");
      const sMeee = XMLList(xml).descendants("sMensaje");

      if(Codeee.length()===0){
        json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<Codeee.length();i++){
          json+='{"iCode":"'+Codeee[i]+'","sMensaje":"'+sMeee[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }

      json = json.slice(0,-1)+']}';
 
      return json;
    }

    if(path==="Func_MovimientosMembresia"){
      let json = '{"'+path+'":[';

      const dtFechaAplica = XMLList(xml).descendants("dtFechaAplica");
      const Centro = XMLList(xml).descendants("Centro");
      const TipoMovimiento = XMLList(xml).descendants("TipoMovimiento");
      const Cargo = XMLList(xml).descendants("Cargo");
      const Abono = XMLList(xml).descendants("Abono");
      const dSaldoAnterior = XMLList(xml).descendants("dSaldoAnterior");

      if(dtFechaAplica.length()===0){
        json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<dtFechaAplica.length();i++){
          json+='{"dtFechaAplica":"'+dtFechaAplica[i]+'","Centro":"'+Centro[i]+'","TipoMovimiento":"'+TipoMovimiento[i]+'","Cargo":"'+Cargo[i]+'","Abono":"'+Abono[i]+'","dSaldoAnterior":"'+dSaldoAnterior[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
      return json;
    }

    if(path==="getLetyClubQuitarPuntos"){
      let json = '{"'+path+'":[';

      const Code = XMLList(xml).descendants("iCode");
      const Mens = XMLList(xml).descendants("sMensaje");


      if(Code.length()===0){
        json+='{"error":"Error en la respuesta o No hay datos de membresia"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<Code.length();i++){
          json+='{"iCode":"'+Code[i]+'","sMensaje":"'+Mens[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
      
      json = json.slice(0,-1)+']}';
 
      return json;
    }

    if(path==="Func_ExisteMembrecia"){
      let json = '{"'+path+'":[';

      const Column1 = XMLList(xml).descendants("Column1");

      if(Column1.length() === 0){
        json+='{"error":"Error de la respuesta o Fue Eliminado correctamente"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<Column1.length();i++){
          json+='{"Column1":"'+Column1[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
      return json;
    }

    if(path==="Func_AsignaNuevaMembresia"){
      let json = '{"'+path+'":[';

      const iIdMem = XMLList(xml).descendants("iIdMembresia");
      const iIdFol = XMLList(xml).descendants("iIdFolioPersona");
      const sIdFol = XMLList(xml).descendants("sIdFolioTarjeta");

      if(iIdMem.length() === 0){
        json+='{"error":"Error de la respuesta"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<iIdMem.length();i++){
          json+='{"iIdMembresia":"'+iIdMem[i]+'","iIdFolioPersona":"'+iIdFol[i]+'","sIdFolioTarjeta":"'+sIdFol[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }

      return json;
    }
  }

  module.exports = {
    responseEndPoint: responseEndPoint,
  };