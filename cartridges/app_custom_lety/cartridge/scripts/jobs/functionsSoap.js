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
          </${path}>
          </soap:Body>
          </soap:Envelope>`;
    }
    if(path==="NewCalculoSD"){
        return `<?xml version="1.0" encoding="utf-8"?>
          <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body><${path} xmlns="http://localhost/">
          <IdEmpresa>${data.Empresa}</IdEmpresa>
          <vUsr>${credential.user}</vUsr>
          <vPwd>${credential.password}</vPwd>
          <oResumen>
          <Posicion>${data.Posicion}</Posicion>
          <IdCentroAlta>${data.IdCentroAlta}</IdCentroAlta>
          <IdCentroAfecta>${data.IdCentroAfecta}</IdCentroAfecta>
          <CentroAfecta>${data.CentroAfecta}</CentroAfecta>
          <bIndEnRango>${data.bIndEnRango}</bIndEnRango>
          <Tiempo>${data.Tiempo}</Tiempo>
          <IdFolioDireccionSeleccionado>${data.IdFolioDireccionSeleccionado}</IdFolioDireccionSeleccionado> 
          <IdFolioPersonaSeleccionado>${data.IdFolioPersonaSeleccionado}</IdFolioPersonaSeleccionado>
          <dLat>${data.dLat}</dLat>
          <dLng>${data.dLng}</dLng>
          <IdServicio>${data.IdServicio}</IdServicio>
          <Folio>${data.Folio}</Folio>
          <NombreCliente>${data.NombreCliente}</NombreCliente>
          <Direccion>${data.Direccion}</Direccion>
          </oResumen>
          </${path}>
          </soap:Body></soap:Envelope>`;
    }
    if(path==="getLetyClub"){
      return `<?xml version="1.0" encoding="utf-8"?> 
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><${path} xmlns="http://localhost/">
        <IdEmpresa>${data.Empresa}</IdEmpresa>  
        <vUsr>${credential.user}</vUsr>     
        <vPwd>${credential.password}</vPwd>  
        <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>  
        </${path}> 
        </soap:Body> 
        </soap:Envelope>`;
    }
    if(path==="Func_DatosMembresia"){
      return `<?xml version="1.0" encoding="utf-8"?> 
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><${path} xmlns="http://localhost/">
        <IdEmpresa>${data.Empresa}</IdEmpresa>  
        <vUsr>${credential.user}</vUsr>     
        <vPwd>${credential.password}</vPwd>  
        <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>  
        </${path}> 
        </soap:Body> 
        </soap:Envelope>`;
    }
    if(path==="Func_MovimientosMembresia"){
      return `<?xml version="1.0" encoding="utf-8"?> 
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><${path} xmlns="http://localhost/">
        <IdEmpresa>${data.Empresa}</IdEmpresa>  
        <vUsr>${credential.user}</vUsr>     
        <vPwd>${credential.password}</vPwd>  
        <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>  
        </${path}> 
        </soap:Body> 
        </soap:Envelope>`;
    }
    if(path==="getLetyClubQuitarPuntos"){
      return `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><${path} xmlns="http://localhost/">
        <IdEmpresa>${data.Empresa}</IdEmpresa>
        <vUsr>${credential.user}</vUsr>
        <vPwd>${credential.password}</vPwd>
        <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>
        <dMonto>${data.dMonto}</dMonto>
        <dSaldoAnterior>${data.dSaldoAnterior}</dSaldoAnterior>
        <sFolioWeb>${data.sFolioWeb}</sFolioWeb>
        </${path}>
        </soap:Body></soap:Envelope>`;
    }
}


module.exports = { body: body};
