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
    const date = new Date(params.birthDay);
    const birthDay = date.toISOString();
    try {
        if (!empty(session.custom.JsonFunc_ExisteMembrecia)) {
            var JsonFunc_ExisteMembrecia = JSON.parse(session.custom.JsonFunc_ExisteMembrecia);

            var actualizarperfildecliente = ApiLety("ActualizaPersona", {
                Empresa: 1,
                params: params,
                birthDay: birthDay,
                iIdFolioPersona: JsonFunc_ExisteMembrecia[0].iIdFolioPersona,
                iIdPersona: JsonFunc_ExisteMembrecia[0].iIdPersona,
                dtDateHigh: JsonFunc_ExisteMembrecia[0].dtDateHigh,
                JsonFunc_ExisteMembrecia: JsonFunc_ExisteMembrecia
            });
        } else {
            var añadirPerfilCliente = ApiLety("InsertaPersona", {
                Empresa: 1,
                params: params,
                birthDay: birthDay
            });
        }
    } catch (error) { }
}

baseAccountHelpers.insertFolPerson = (customer) => {
    const getCustomer = CustomerMgr.getProfile(customer.customerNo);

    if (customer.birthDay) {
        const date = new Date(customer.birthDay);
        const birthDay = date.toISOString();
    }
    var getFolioPerson = ApiLety("GetFolioPersona", {
        Empresa: 1,
        params: customer,
        birthDay: birthDay
    })

    Transaction.wrap(() => {
        getCustomer.custom.folPerson = getFolioPerson.iIdFolioPersona
    })
}

module.exports = baseAccountHelpers;