window.jQuery = window.$ = require('jquery');
var processInclude = require('./util');

$(document).ready(function () {
    processInclude(require('./components/footer'));
});

require('./thirdParty/bootstrap');