'use strict';

var baseAccountHelpers = module.superModule;
const { ApiLety } = require("~/cartridge/scripts/jobs/api");

/**
 * Set content search configuration values
 *
 * @param {Object} params - Provided HTTP query parameters
 * @return {Object} - content search instance
 */
baseAccountHelpers.addUpdateExternalAccount = function(params) {
    if (!empty(session.custom.JsonFunc_ExisteMembrecia)) {
        var añadirPerfilCliente = ApiLety("ActualizaPersona", {
            Empresa: 1,
            params: params
          });
    } else {
        var actualizarperfildecliente = ApiLety("InsertaPersona", {
            Empresa: 1,
            params: params
          });
    }
}

module.exports = baseAccountHelpers;