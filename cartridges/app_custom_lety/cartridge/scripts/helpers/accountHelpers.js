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

    var getFolioPerson = ApiLety("GetFolioPersona", {
        Empresa: 1,
        params: customer
    })
    session.custom.iIdFolioPersona = JSON.stringify(getFolioPerson.iIdFolioPersona);

    Transaction.wrap(() => {
        getCustomer.custom.folPerson = getFolioPerson.iIdFolioPersona
    })
}

baseAccountHelpers.updateUserInformation = (customer) => {
    const userInfo = customer;

    var getFolioPerson = ApiLety("GetFolioPersona", {
        Empresa: 1,
        params: customer
    })

    if (getFolioPerson.iCode == 1 || getFolioPerson.iCode == '1') {
        const lastName = customer.lastName.split(' ')
        const secondLastName = lastName[1] ? lastName[1] : ''
        const iIdFolioPersona = getFolioPerson.iIdFolioPersona
        
        var getFolioPerson = ApiLety("ActualizaPerfilPersona", {
            Empresa: 1,
            params: customer,
            lastName: lastName[0],
            secondLastName: secondLastName,
            iIdFolioPersona: iIdFolioPersona
        })
    }
    return ''
}

/**
 * Send an email that would notify the user that account was created
 * @param {obj} registeredUser - object that contains user's email address and name information.
 */
baseAccountHelpers.sendNewsletterEmail = function (registeredUser) {
    var emailHelpers = require('*/cartridge/scripts/helpers/emailHelpers');
    var Site = require('dw/system/Site');
    var Resource = require('dw/web/Resource');

    var userObject = {
        firstName: registeredUser,
        lastName: '',
    };

    var emailObj = {
        to: registeredUser,
        subject: Resource.msg('email.subject.new.newsletter', 'registration', null),
        from: Site.current.getCustomPreferenceValue('customerServiceEmail') || 'no-reply@testorganization.com',
        type: emailHelpers.emailTypes.registration
    };

    emailHelpers.sendEmail(emailObj, 'checkout/confirmation/accountRegisteredEmail', userObject);
}

module.exports = baseAccountHelpers;