'use strict';

var baseAccountHelpers = module.superModule;
const { ApiLety } = require("~/cartridge/scripts/jobs/api");
var CustomerMgr = require('dw/customer/CustomerMgr');
var Transaction = require('dw/system/Transaction');

/**
 * Set content search configuration values
 *
 * @param {Object} params - Provided HTTP query parameters
 * @return {Object} - content search instance
 */
baseAccountHelpers.addUpdateExternalAccount = function (params) {
    try {
        if (!empty(session.custom.JsonFunc_ExisteMembrecia)) {
            var JsonFunc_ExisteMembrecia = JSON.parse(session.custom.JsonFunc_ExisteMembrecia);
            var añadirPerfilCliente = ApiLety("ActualizaPersona", {
                Empresa: 1,
                params: params,
                iIdFolioPersona: JsonFunc_ExisteMembrecia[0].iIdFolioPersona,
                iIdPersona: JsonFunc_ExisteMembrecia[0].iIdPersona,
                dtDateHigh: JsonFunc_ExisteMembrecia[0].dtDateHigh,
                JsonFunc_ExisteMembrecia: JsonFunc_ExisteMembrecia
            });
        } else {
            var actualizarperfildecliente = ApiLety("InsertaPersona", {
                Empresa: 1,
                params: params
            });
        }
    } catch (error) { }
}

baseAccountHelpers.insertFolPerson = (customer) =>{
    const getCustomer = CustomerMgr.getProfile(customer.customerNo);

    var getFolioPerson = ApiLety("GetFolioPersona", {
        Empresa: 1,
        params: customer
    })

    Transaction.wrap(() =>{
        getCustomer.custom.folPerson = getFolioPerson.iIdFolioPersona
    })
}

module.exports = baseAccountHelpers;