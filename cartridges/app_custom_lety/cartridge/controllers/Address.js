'use strict';

/**
 * @namespace Address
 */

var server = require('server');
server.extend(module.superModule);

var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var userLoggedIn = require('*/cartridge/scripts/middleware/userLoggedIn');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var Site = require('dw/system/Site');

server.replace(
    'AddAddress',
    csrfProtection.generateToken,
    consentTracking.consent,
    userLoggedIn.validateLoggedIn,
    function (req, res, next) {
        var addressForm = server.forms.getForm('address');
        addressForm.clear();
        let cityStoresStates = Site.getCurrent().getCustomPreferenceValue("cityStoresStates");

        res.render('account/editAddAddress', {
            addressForm: addressForm,
            cityStoresStates: cityStoresStates,
            breadcrumbs: [
                {
                    htmlValue: Resource.msg('global.home', 'common', null),
                    url: URLUtils.home().toString()
                },
                {
                    htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                    url: URLUtils.url('Account-Show').toString()
                },
                {
                    htmlValue: Resource.msg('label.addressbook', 'account', null),
                    url: URLUtils.url('Address-List').toString()
                }
            ]
        });
        next();
    }
);

server.replace(
    'EditAddress',
    csrfProtection.generateToken,
    userLoggedIn.validateLoggedIn,
    consentTracking.consent,
    function (req, res, next) {
        var CustomerMgr = require('dw/customer/CustomerMgr');
        var AddressModel = require('*/cartridge/models/address');

        var addressId = req.querystring.addressId;
        var customer = CustomerMgr.getCustomerByCustomerNumber(
            req.currentCustomer.profile.customerNo
        );
        var addressBook = customer.getProfile().getAddressBook();
        var rawAddress = addressBook.getAddress(addressId);
        var addressModel = new AddressModel(rawAddress);
        var addressForm = server.forms.getForm('address');
        addressForm.clear();

        addressForm.copyFrom(addressModel.address);
        let cityStoresStates = Site.getCurrent().getCustomPreferenceValue("cityStoresStates");

        res.render('account/editAddAddress', {
            addressForm: addressForm,
            addressId: addressId,
            cityStoresStates: cityStoresStates,
            breadcrumbs: [
                {
                    htmlValue: Resource.msg('global.home', 'common', null),
                    url: URLUtils.home().toString()
                },
                {
                    htmlValue: Resource.msg('page.title.myaccount', 'account', null),
                    url: URLUtils.url('Account-Show').toString()
                },
                {
                    htmlValue: Resource.msg('label.addressbook', 'account', null),
                    url: URLUtils.url('Address-List').toString()
                }
            ]
        });

        next();
    }
);

server.replace('SaveAddress', csrfProtection.validateAjaxRequest, function (req, res, next) {
    var CustomerMgr = require('dw/customer/CustomerMgr');
    var Transaction = require('dw/system/Transaction');
    var formErrors = require('*/cartridge/scripts/formErrors');
    var accountHelpers = require('*/cartridge/scripts/helpers/accountHelpers');
    var addressHelpers = require('*/cartridge/scripts/helpers/addressHelpers');

    var addressForm = server.forms.getForm('address');
    var addressFormObj = addressForm.toObject();
    addressFormObj.addressForm = addressForm;
    var customer = CustomerMgr.getCustomerByCustomerNumber(
        req.currentCustomer.profile.customerNo
    );
    var addressBook = customer.getProfile().getAddressBook();
    if (addressForm.valid) {
        res.setViewData(addressFormObj);
        this.on('route:BeforeComplete', function () { // eslint-disable-line no-shadow
            var formInfo = res.getViewData();
            Transaction.wrap(function () {
                var address = null;
                if (formInfo.addressId.equals(req.querystring.addressId) || !addressBook.getAddress(formInfo.addressId)) {
                    address = req.querystring.addressId
                        ? addressBook.getAddress(req.querystring.addressId)
                        : addressBook.createAddress(formInfo.addressId);
                }

                if (address) {
                    if (req.querystring.addressId) {
                        address.setID(formInfo.addressId);
                    }

                    // Save form's address
                    addressHelpers.updateAddressFields(address, formInfo);

                    // Send account edited email
                    accountHelpers.sendAccountEditedEmail(customer.profile);

                    res.json({
                        success: true,
                        redirectUrl: URLUtils.url('Address-List').toString()
                    });
                } else {
                    formInfo.addressForm.valid = false;
                    formInfo.addressForm.addressId.valid = false;
                    formInfo.addressForm.addressId.error =
                        Resource.msg('error.message.idalreadyexists', 'forms', null);
                    res.json({
                        success: false,
                        fields: formErrors.getFormErrors(addressForm)
                    });
                }
            });
        });
    } else {
        res.json({
            success: false,
            fields: formErrors.getFormErrors(addressForm)
        });
    }
    return next();
});

module.exports = server.exports();
