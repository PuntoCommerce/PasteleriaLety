'use strict';

module.exports = {
    updateForm: function (registrationForm, successMessage) {
        var results = {};
        var form = registrationForm.customer;
        Object.keys(form).forEach(function (key) {
            if (form[key] && Object.prototype.hasOwnProperty.call(form[key], 'formType')) {
                if (form[key].formType === 'formField') {
                    results[form[key].htmlName] = form[key].htmlValue;
                }
            }
        });
        Object.keys(results).forEach(function (innerKey) {
            $('input[name="'+innerKey+'"]').val(results[innerKey]);
        });
        $('#form-membershipId-confirm-error').append(successMessage);
        $('#form-membershipId-confirm-error').removeClass('invalid-feedback');
    }
};