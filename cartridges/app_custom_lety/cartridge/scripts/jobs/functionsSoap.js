// "use strict";

/*function body(data,credential,path) {
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
    if(path==="Func_ActualizaDatosMembresia"){
      return `<?xml version="1.0" encoding="utf-8"?> 
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><${path} xmlns="http://localhost/">
        <IdEmpresa>${data.Empresa}</IdEmpresa>  
        <vUsr>${credential.user}</vUsr>     
        <vPwd>${credential.password}</vPwd>  
        <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>
        <i_IdFolioPersona>${data.i_IdFolioPersona}</i_IdFolioPersona>
        <s_Nombre>${data.s_Nombre}</s_Nombre>
        <s_Appaterno>${data.s_Appaterno}</s_Appaterno>
        <s_Apmaterno>${data.s_Apmaterno}</s_Apmaterno>
        <s_FechaNacimiento>${data.FechaNacimiento}</s_FechaNacimiento>
        <s_Sexo>${data.s_Sexo}</s_Sexo>
        <i_IdCiudad>${data.i_IdCiudad}</i_IdCiudad>
        <s_EdoCivil>${data.s_EdoCivil}</s_EdoCivil>
        <s_PastelFavorito>${data.s_PastelFavorito}</s_PastelFavorito>
        <s_Direccion>${data.s_Direccion}</s_Direccion>
        <s_Colonia>${data.s_Colonia}</s_Colonia>
        <s_Telefono>${data.s_Telefono}</s_Telefono>
        <s_Mail>${data.s_Mail}</s_Mail>  
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
    if(path==="Func_ExisteMembrecia"){
      return `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><${path} xmlns="http://localhost/">
        <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>
        <IdEmpresa>${data.Empresa}</IdEmpresa>
        <vUsr>${credential.user}</vUsr>
        <vPwd>${credential.password}</vPwd>
        </${path}>
        </soap:Body></soap:Envelope>`;
    }
    if(path==="Func_AsignaNuevaMembresia"){
      return `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body><${path} xmlns="http://localhost/">
        <IdEmpresa>${data.Empresa}</IdEmpresa>
        <vUsr>${credential.user}</vUsr>
        <vPwd>${credential.password}</vPwd>
        <s_IdMembresia>${data.s_IdMembresia}</s_IdMembresia>
        <s_Nombre>${data.s_Nombre}</s_Nombre>
        <s_Appaterno>${data.s_Appaterno}</s_Appaterno>
        <s_Apmaterno>${data.s_Apmaterno}</s_Apmaterno>
        <s_FechaNacimiento>${data.s_FechaNacimiento}</s_FechaNacimiento>
        <s_Sexo>${data.s_Sexo}</s_Sexo>
        <i_IdCiudad>${data.i_IdCiudad}</i_IdCiudad>
        <s_EdoCivil>${data.s_EdoCivil}</s_EdoCivil>
        <s_PastelFavorito>${data.s_PastelFavorito}</s_PastelFavorito>
        <s_Direccion>${data.s_Direccion}</s_Direccion>
        <s_Colonia>${data.s_Colonia}</s_Colonia>
        <s_Telefono>${data.s_Telefono}</s_Telefono>
        <s_Mail>${data.s_Mail}</s_Mail>
        </${path}>
        </soap:Body></soap:Envelope>`;
    }
}*/
