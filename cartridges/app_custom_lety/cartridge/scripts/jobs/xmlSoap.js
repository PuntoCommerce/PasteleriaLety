"use strict";

  function responseEndPoint(xml,path) {
    if(path==="ExistenciaPorCentroFecha"){
      let json = '{"'+path+'":[';

      const Existencia = XMLList(xml).descendants("Existencia");

      if(Existencia.length()===0){
        json+='{"Existencia":"0.00"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<Existencia.length();i++){
          json+='{"Existencia":"'+Existencia[i]+'"},';
        }
        json = json.slice(0,-1)+']}';
      }
    
      return json;
    }

    if(path==="getLetyClub"){
      let json = '{"'+path+'":[';
      //Completo
      const dtFechaUltMov = XMLList(xml).descendants("dtFechaUltMov");
      const iTipo = XMLList(xml).descendants("iTipo");
      const sTipo = XMLList(xml).descendants("sTipo");
      const iIdMembresia = XMLList(xml).descendants("iIdMembresia");
  
      //Diferente
      const bExiste = XMLList(xml).descendants("bExiste");
      const bVigente = XMLList(xml).descendants("bVigente");
      const dPorcentajeAcumula = XMLList(xml).descendants("dPorcentajeAcumula");
      const dDescuento = XMLList(xml).descendants("dDescuento");
      const dSaldo = XMLList(xml).descendants("dSaldo");
      const bIndEmpleado = XMLList(xml).descendants("bIndEmpleado");
     
      if(bExiste.length() === 0 || bVigente.length() === 0 || dtFechaUltMov.length() === 0 || dPorcentajeAcumula.length() === 0 || dDescuento.length() === 0 || dSaldo.length() === 0 || iTipo.length() === 0 || sTipo.length() === 0 || iIdMembresia.length() === 0 || bIndEmpleado.length() === 0){
        json += '{"bExiste":"0.00","bVigente":"0.00","dtFechaUltMov":0.00,"dPorcentajeAcumula":0.00,"dDescuento":0.00,"dSaldo":0.00,"iTipo":0.00,"sTipo":"0.00","iIdMembresia":0.00,"bIndEmpleado":"0.00"},';
        json = json.slice(0,-1)+']}';
      }else{
        for(let i =0; i<bExiste.length();i++){
          json+='{"bExiste":"'+bExiste[i]+'","bVigente":"'+bVigente[i]+'","dtFechaUltMov":"'+dtFechaUltMov[i]+'","dPorcentajeAcumula":'+dPorcentajeAcumula[i]+',"dDescuento":'+dDescuento[i]+',"dSaldo":'+dSaldo[i]+',"iTipo":'+iTipo[i]+',"sTipo":"'+sTipo[i]+'","iIdMembresia":'+iIdMembresia[i]+',"bIndEmpleado":"'+bIndEmpleado[i]+'"},';
        }
        //"'+encodeURIComponent(dtFechaUltMov[i])+'"
        json = json.slice(0,-1)+']}';
      }
      return json;
    }
  }

  module.exports = {
    responseEndPoint: responseEndPoint,
  };