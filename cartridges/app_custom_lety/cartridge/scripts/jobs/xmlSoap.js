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

      const d_SaldoMembresia = XMLList(xml).descendants("d_SaldoMembresia");
      const sdtm_FechaAlta = XMLList(xml).descendants("sdtm_FechaAlta");
      const sc_Status = XMLList(xml).descendants("sc_Status");

      if(d_SaldoMembresia.length() ===0 || sdtm_FechaAlta.length() === 0 || sc_Status.length() === 0){
        json+='{"error":"Error en la respuesta"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<d_SaldoMembresia.length();i++){
          json+='{"d_SaldoMembresia":"'+d_SaldoMembresia[i]+'","sdtm_FechaAlta":"'+sdtm_FechaAlta[i]+'","sc_Status":"'+sc_Status[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
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

      const getLetyClubQuitarPuntosResult = XMLList(xml).descendants("getLetyClubQuitarPuntosResult");

      if(getLetyClubQuitarPuntosResult.length() === 0){
        json+='{"error":"Error de la respuesta o Fue Eliminado correctamente"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<getLetyClubQuitarPuntosResult.length();i++){
          json+='{"getLetyClubQuitarPuntosResult":"'+getLetyClubQuitarPuntosResult[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
      return json;
    }
  }

  module.exports = {
    responseEndPoint: responseEndPoint,
  };