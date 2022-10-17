"use strict";

function body(data,credential,path) {
    if(path==="ExistenciaPorCentroFecha"){
        return `<?xml version="1.0" encoding="utf-8"?> 
          <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body><${path} xmlns="http://localhost/">  
          <IdEmpresa>${data.Empresa}</IdEmpresa>  
          <vUsr>${credential.user}</vUsr>     
          <vPwd>${credential.password}</vPwd>  
          <iIdCentro>${data.iIdCentro}</iIdCentro>  
          <iIdMaterial>${data.iIdMaterial}</iIdMaterial>  
          <dtFecha>${data.dtFecha}</dtFecha>
          </${path}> </soap:Body> </soap:Envelope>`;
    }
    if(path==="getLetyClub"){
        return `<?xml version="1.0" encoding="utf-8"?> 
          <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body><${path} xmlns="http://localhost/">
          <IdEmpresa>${data.Empresa}</IdEmpresa>  
          <vUsr>${credential.user}</vUsr>     
          <vPwd>${credential.password}</vPwd>  
          <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>  
          </${path}> </soap:Body> </soap:Envelope>`;
    }
}


module.exports = { body: body};
