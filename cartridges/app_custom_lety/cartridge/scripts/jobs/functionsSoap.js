"use strict";
const Site = require('dw/system/Site');

const handleEnviroment = () => {
  const isProduction = Site.getCurrent().getCustomPreferenceValue(
    "isProduction"
  );
  const tipoAmbiente = isProduction ? '1' : '0';
  return '<TipoAmbiente>' + tipoAmbiente + '</TipoAmbiente>'
}

const isEspecial = (type) => {
  const especial = type === 'linea' ? 0 : 1;

  return '<bIndEspecial>' + especial + '</bIndEspecial>'
}

function body(data, credential, path) {
  if (path === "ExistenciaPorCentroFecha") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<iIdCentro>' + data.iIdCentro + '</iIdCentro>' +
      '<iIdMaterial>' + data.iIdMaterial + '</iIdMaterial>' +
      '<dtFecha>' + data.dtFecha + '</dtFecha>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
  }
  if (path === 'ExistenciaPorCentroFechaEsp') {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<iIdCentro>' + data.iIdCentro + '</iIdCentro>' + isEspecial(data.productType) +
      '<iIdMaterial>' + data.iIdMaterial + '</iIdMaterial>' +
      '<dtFecha>' + data.dtFecha + '</dtFecha>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
  }
  if (path === "CatalogoCiudades") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<IdEstado>' + data.IdEstado + '</IdEstado>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "CatalogoEstados") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "NewCalculoSD") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body>+<' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<oResumen>' +
      '<Posicion>' + data.Posicion + '</Posicion>' +
      '<IdCentroAlta>' + data.IdCentroAlta + '</IdCentroAlta>' +
      '<IdCentroAfecta>' + data.IdCentroAfecta + '</IdCentroAfecta>' +
      '<CentroAfecta>' + data.CentroAfecta + '</CentroAfecta>' +
      '<bIndEnRango>' + data.bIndEnRango + '</bIndEnRango>' +
      '<Tiempo>' + data.Tiempo + '</Tiempo>' +
      '<IdFolioDireccionSeleccionado>' + data.IdFolioDireccionSeleccionado + '</IdFolioDireccionSeleccionado>' +
      '<IdFolioPersonaSeleccionado>' + data.IdFolioPersonaSeleccionado + '</IdFolioPersonaSeleccionado>' +
      '<dLat>' + data.dLat + '</dLat>' +
      '<dLng>' + data.dLng + '</dLng>' +
      '<IdServicio>' + data.IdServicio + '</IdServicio>' +
      '<Folio>' + data.Folio + '</Folio>' +
      '<NombreCliente>' + data.NombreCliente + '</NombreCliente>' +
      '<Direccion>' + data.Direccion + '</Direccion>' +
      '</oResumen>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "getLetyClub") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<s_IdMembresia>' + data.s_IdMembresia + '</s_IdMembresia>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
  }
  if (path === "ListaClientesFromMembresia") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<sFolioMembresia>' + data.s_IdMembresia + '</sFolioMembresia>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
  }
  if (path === "Func_DatosMembresia") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<s_IdMembresia>' + data.s_IdMembresia + '</s_IdMembresia>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
  }
  if (path === "Func_ActualizaDatosMembresia") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<s_IdMembresia>' + data.s_IdMembresia + '</s_IdMembresia>' +
      '<i_IdFolioPersona>' + data.i_IdFolioPersona + '</i_IdFolioPersona>' +
      '<s_Nombre>' + data.s_Nombre + '</s_Nombre>' +
      '<s_Appaterno>' + data.s_Appaterno + '</s_Appaterno>' +
      '<s_Apmaterno>' + data.s_Apmaterno + '</s_Apmaterno>' +
      '<s_FechaNacimiento>' + data.s_FechaNacimiento + '</s_FechaNacimiento>' +
      '<s_Sexo>' + data.s_Sexo + '</s_Sexo>' +
      '<i_IdCiudad>' + data.i_IdCiudad + '</i_IdCiudad>' +
      '<s_EdoCivil>' + data.s_EdoCivil + '</s_EdoCivil>' +
      '<s_PastelFavorito>' + data.s_PastelFavorito + '</s_PastelFavorito>' +
      '<s_Direccion>' + data.s_Direccion + '</s_Direccion>' +
      '<s_Colonia>' + data.s_Colonia + '</s_Colonia>' +
      '<s_Telefono>' + data.s_Telefono + '</s_Telefono>' +
      '<s_Mail>' + data.s_Mail + '</s_Mail>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
  }
  if (path === "Func_MovimientosMembresia") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<s_IdMembresia>' + data.s_IdMembresia + '</s_IdMembresia>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
  }
  if (path === "getLetyClubQuitarPuntos") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<s_IdMembresia>' + data.s_IdMembresia + '</s_IdMembresia>' +
      '<dMonto>' + data.dMonto + '</dMonto>' +
      '<sFolioWeb>' + data.sFolioWeb + '</sFolioWeb>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "Func_ExisteMembrecia") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<s_IdMembresia>' + data.s_IdMembresia + '</s_IdMembresia>' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "Func_AsignaNuevaMembresia") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<s_Nombre>' + data.s_Nombre + '</s_Nombre>' +
      '<s_Appaterno>' + data.s_Appaterno + '</s_Appaterno>' +
      '<s_Apmaterno>' + data.s_Apmaterno + '</s_Apmaterno>' +
      '<s_FechaNacimiento>' + data.s_FechaNacimiento + '</s_FechaNacimiento>' +
      '<s_Sexo>' + data.s_Sexo + '</s_Sexo>' +
      '<i_IdCiudad>' + data.i_IdCiudad + '</i_IdCiudad>' +
      '<s_EdoCivil>' + data.s_EdoCivil + '</s_EdoCivil>' +
      '<s_PastelFavorito>' + data.s_PastelFavorito + '</s_PastelFavorito>' +
      '<s_Direccion>' + data.s_Direccion + '</s_Direccion>' +
      '<s_Colonia>' + data.s_Colonia + '</s_Colonia>' +
      '<s_Telefono>' + data.s_Telefono + '</s_Telefono>' +
      '<s_Mail>' + data.s_Mail + '</s_Mail>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "InsertaPersonaDireccion") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.IdEmpresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<pPersonaDireccion>' +
      '<iIdFolioPersona>' + data.iIdFolioPersona + '</iIdFolioPersona>' +
      '<iIdCentro>' + data.iIdCentro + '</iIdCentro>' +
      '<iIdDireccion>' + data.iIdDireccion + '</iIdDireccion>' +
      '<iIdFolioDireccion>' + data.iIdFolioDireccion + '</iIdFolioDireccion>' +
      '<sDireccion>' + data.sDireccion + '</sDireccion>' +
      '<sColonia>' + data.sColonia + '</sColonia>' +
      '<sCP>' + data.sCP + '</sCP>' +
      '<sTelefono1>' + data.sTelefono1 + '</sTelefono1>' +
      '<sTelefono2>' + data.sTelefono2 + '</sTelefono2>' +
      '<sEntreCalles>' + data.sEntreCalles + '</sEntreCalles>' +
      '<sObservaciones>' + data.sObservaciones + '</sObservaciones>' +
      '<iIdCiudad>' + data.iIdCiudad + '</iIdCiudad>' +
      '<dLatitud>' + data.dLatitud + '</dLatitud>' +
      '<dLongitud>' + data.dLongitud + '</dLongitud>' +
      '<sNoInterior>' + data.sNoInterior + '</sNoInterior>' +
      '<sNoExterior>' + data.sNoExterior + '</sNoExterior>' +
      '<iIdUsuario>' + data.iIdUsuario + '</iIdUsuario>' +
      '<dtFecha>' + data.dtFecha + '</dtFecha>' +
      '<iTipoDireccion>' + data.iTipoDireccion + '</iTipoDireccion>' +
      '</pPersonaDireccion>' +
      '<address>' + data.address + '</address>' +
      '<latitud>' + data.dLatitud + '</latitud>' +
      '<longitud>' + data.dLongitud + '</longitud>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "RegistraServDom") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.IdEmpresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<pServicioDomicilioH>' +
      '<iIdCentroAlta>' + data.iIdCentroAlta + '</iIdCentroAlta>' +
      '<iIdServDom>' + data.iIdServDom + '</iIdServDom>' +
      '<iIdCentroAfecta>' + data.iIdCentroAfecta + '</iIdCentroAfecta>' +
      '<iIdFolioPersona>' + data.iIdFolioPersona + '</iIdFolioPersona>' +
      '<iIdFolioDireccion>' + data.iIdFolioDireccion + '</iIdFolioDireccion>' +
      '<dtFechaAlta>' + data.dtFechaAlta + '</dtFechaAlta>' +
      '<dtFechaEntrega>' + data.dtFechaEntrega + '</dtFechaEntrega>' +
      '<iIdUsuarioAlta>' + data.iIdUsuarioAlta + '</iIdUsuarioAlta>' +
      '<bIndFactura>' + data.bIndFactura + '</bIndFactura>' +
      '<sObservaciones>' + data.sObservaciones + '</sObservaciones>' +
      '</pServicioDomicilioH>' +
      '<pServicioDomicilioD>' +
      handleItemsServDom(data.items, data.iIdServDom) +
      '</pServicioDomicilioD>' +
      '<pServicioDomicilioPago>' +
      '<iIdCentroAlta>' + data.iIdCentroAlta + '</iIdCentroAlta>' +
      '<iIdServDom>' + data.iIdServDom + '</iIdServDom>' +
      '<iIdFormaDePago>' + data.iIdFormaDePago + '</iIdFormaDePago>' +
      '<dMonto>' + data.dMonto + '</dMonto>' +
      '<TipoDeCambio>' + data.TipoDeCambio + '</TipoDeCambio>' +
      '<dImporte>' + data.dImporte + '</dImporte>' +
      '<sFolioTarjeta>' + data.sFolioTarjeta + '</sFolioTarjeta>' +
      '<dMontoLetyPesos>' + data.dMontoLetyPesos + '</dMontoLetyPesos>' +
      '</pServicioDomicilioPago>' +
      '<NombreCompleto>' + data.NombreCompleto + '</NombreCompleto>' +
      '<Municipio>' + data.Municipio + '</Municipio>' +
      '<Estado>' + data.Estado + '</Estado>' +
      '<deliveryEstimateId>' + data.deliveryEstimateId + '</deliveryEstimateId>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "InsertaDatosVentaWeb") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<pEncabezado>' +
      '<sFolio>' + data.sFolio + '</sFolio>' +
      '<sFolioBanco>' + data.sFolioBanco + '</sFolioBanco>' +
      '<sFolioTarjeta>' + data.sFolioTarjeta + '</sFolioTarjeta>' +
      '<iIdCentro>' + data.iIdCentro + '</iIdCentro>' +
      '<dtFechaColocacion>' + data.dtFechaColocacion + '</dtFechaColocacion>' +
      '<dtFechaAsignacion>' + data.dtFechaAsignacion + '</dtFechaAsignacion>' +
      '<bindImpreso>' + data.bindImpreso + '</bindImpreso>' +
      '</pEncabezado>' +
      '<pDetalle>' +
      handleItemsPickup(data.items, data.sFolio) +
      '</pDetalle>' +
      '<pPago>' +
      '<sFolio>' + data.sFolio + '</sFolio>' +
      '<iIdFormaDePago>' + data.iIdFormaDePago + '</iIdFormaDePago>' +
      '<dMonto>' + data.bdMonto + '</dMonto>' +
      '<dMontoExtranjero>' + data.dMontoExtranjero + '</dMontoExtranjero>' +
      '<iIdMembresia>' + data.iIdMembresia + '</iIdMembresia>' +
      '<sReferencia>' + data.sReferencia + '</sReferencia>' +
      '<dMontoLetyPesos>' + data.dMontoLetyPesos + '</dMontoLetyPesos>' +
      '</pPago>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "ActualizaPersona") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<oPersona>' +
      '<iIdPersona>' + data.iIdPersona + '</iIdPersona>' +
      '<iIdCentro>' + data.JsonFunc_ExisteMembrecia[0].iIdCentro + '</iIdCentro>' +
      '<iIdFolioPersona>' + data.iIdFolioPersona + '</iIdFolioPersona>' +
      '<sNombre>' + data.params.firstName + '</sNombre>' +
      '<sApellidoPaterno>' + data.params.lastName + '</sApellidoPaterno>' +
      '<sTelefono1>' + data.params.phone + '</sTelefono1>' +
      '<sCorreoElectronico>' + data.params.email + '</sCorreoElectronico>' +
      '<dtFechaAlta>' + data.dtDateHigh + '</dtFechaAlta>' +
      '<dtFechaNacimiento>' + data.birthDay + '</dtFechaNacimiento>' +
      '<sApellidoMaterno>' + data.JsonFunc_ExisteMembrecia[0].sMaternalLastName + '</sApellidoMaterno>' +
      '<iIdCiudad>' + data.JsonFunc_ExisteMembrecia[0].iIdCiudad + '</iIdCiudad>' +
      '<sColonia>' + data.JsonFunc_ExisteMembrecia[0].sCologne + '</sColonia>' +
      '<iTipoPersona>' + data.JsonFunc_ExisteMembrecia[0].iTipoPersona + '</iTipoPersona>' +
      '<sEstatus>' + data.JsonFunc_ExisteMembrecia[0].sEstatus + '</sEstatus>' +
      '<dtFechaModificacion>' + data.JsonFunc_ExisteMembrecia[0].dtFechaModificacion + '</dtFechaModificacion>' +
      '</oPersona>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === "InsertaPersona") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<oPersona>' +
      '<iIdPersona>' + 0 + '</iIdPersona>' +
      '<iIdCentro>' + 0 + '</iIdCentro>' +
      '<iIdFolioPersona>' + 0 + '</iIdFolioPersona>' +
      '<sNombre>' + data.params.firstName + '</sNombre>' +
      '<sApellidoPaterno>' + data.params.lastName + '</sApellidoPaterno>' +
      '<sTelefono1>' + data.params.phone + '</sTelefono1>' +
      '<sCorreoElectronico>' + data.params.email + '</sCorreoElectronico>' +
      '<sApellidoMaterno>' + data.params.sLastName + '</sApellidoMaterno>' +
      '<dtFechaNacimiento>' + data.birthDay + '</dtFechaNacimiento>' +

      '</oPersona>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === 'GetFolioPersona') {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<sCorreo>' + data.params.email + '</sCorreo>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === 'ActualizaPerfilPersona') {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<iIdFolioPersona>' + data.iIdFolioPersona + '</iIdFolioPersona>' +
      '<sNombre>' + data.params.firstName + '</sNombre>' +
      '<sApellidoPaterno>' + data.lastName + '</sApellidoPaterno>' +
      '<sApellidoMaterno>' + data.secondLastName + '</sApellidoMaterno>' +
      '<dtFechaNacimiento>' + data.params.birthDay + '</dtFechaNacimiento>' +
      '<sTelefono1>' + data.params.phone + '</sTelefono1>' +
      '<sCorreoElectronico>' + data.params.email + '</sCorreoElectronico>' +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === 'GetDateFromServer') {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
  if (path === 'RegistraPedidoEspecial') {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      handleItemsSpecial(data.items, data.sFolio, data.clientID, data) +
      '</' + path + '>' +
      '</soap:Body></soap:Envelope>';
  }
}

const handleItemsServDom = (items, folio) => {
  let itemsString = '';
  let item;
  for (let i = 0; i < items.length; i++) {
    item = items[i];
    itemsString += '<cServicioDomicilioDWeb>' +
      '<iIdCentroAlta>' + 0 + '</iIdCentroAlta>' +
      '<iIdServDom>' + folio + '</iIdServDom>' +
      '<iIdMaterial>' + item.iIdMaterial + '</iIdMaterial>' +
      '<dPrecio>' + item.dPrecio + '</dPrecio>' +
      '<dPrecioBase>' + item.dPrecioBase + '</dPrecioBase>' +
      '<dCantidad>' + item.dCantidad + '</dCantidad>' +
      '<dCantidadBase>' + item.dCantidadBase + '</dCantidadBase>' +
      '<iIdUnidad>' + item.iIdUnidad + '</iIdUnidad>' +
      '<iIdUnidadBase>' + item.iIdUnidadBase + '</iIdUnidadBase>' +
      '<dPorcDescuento>' + item.dPorcDescuento + '</dPorcDescuento>' +
      '<dMontoDescuento>' + item.dMontoDescuento + '</dMontoDescuento>' +
      '<dPorcIVA>' + item.dPorcIVA + '</dPorcIVA>' +
      '<dMontoIVA>' + item.dMontoIVA + '</dMontoIVA>' +
      '<dPorcIEPS>' + item.dPorcIEPS + '</dPorcIEPS>' +
      '<dMontoIEPS>' + item.dMontoIEPS + '</dMontoIEPS>' +
      '<iIdCombo>' + item.iIdCombo + '</iIdCombo>' +
      '</cServicioDomicilioDWeb>';
  }

  return itemsString

}

const handleItemsSpecial = (items, folio, clientID, data) => {
  let itemsString = '';
  let item;
  var sTexto = data.sTexto || ''

  for (let i = 0; i < items.length; i++) {
    item = items[i];
    itemsString += '<cPedidoEspecial>' +
      '<iIdMaterialEspecial>' + item.iIdMaterial + '</iIdMaterialEspecial>' +
      '<iIdFolioPersona>' + clientID + '</iIdFolioPersona>' +
      '<dtFechaEntrega>' + data.dtFechaAsignacion + '</dtFechaEntrega>' +
      '<iIdCentroEntrega>' + data.iIdCentro + '</iIdCentroEntrega>' +
      '<dMonto>' + data.bdMonto + '</dMonto>' +
      '<sTexto>' + sTexto + '</sTexto>' +
      '<sReferenciaPago>' + '' + '</sReferenciaPago>' +
      '</cPedidoEspecial>';
  }

  return itemsString
}

const handleItemsPickup = (items, folio) => {
  let itemsString = '';
  let item;
  for (let i = 0; i < items.length; i++) {
    item = items[i];
    itemsString += '<cVentaWebD>' +
      '<iIdFolioPersona>' + folio + '</iIdFolioPersona>' +
      '<iIdMaterial>' + item.iIdMaterial + '</iIdMaterial>' +
      '<dPrecio>' + item.dPrecio + '</dPrecio>' +
      '<iCantidad>' + item.iCantidad + '</iCantidad>' +
      '</cVentaWebD>';
  }
  return itemsString;
}

module.exports = {
  body: body,
};