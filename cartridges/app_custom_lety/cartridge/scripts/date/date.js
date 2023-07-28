var ServiceCredential = require('dw/svc/ServiceCredential');
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Resource = require('dw/web/Resource');
var Site = require('dw/system/Site');

function createRequest(service) {
  const credential = service.configuration.credential;
  const preferences = Site.getCurrent().getPreferences();
  if (!(credential instanceof ServiceCredential)) {
    var { msgf } = Resource;
    throw new Error(
      msgf("service.nocredentials", "pruebaerrors", null, serviceName)
    );
  }

    service.URL = credential.URL;
    service.setRequestMethod("GET");
    
    return '';
}

module.exports = (function () {
  var { msgf } = Resource;
  var restService;
  try {
    restService = LocalServiceRegistry.createService("getTime", {
      createRequest: createRequest,
      parseResponse: function (_, httpClient) {
        return JSON.parse(httpClient.getText());
      },
      filterLogMessage: function (msg) {
        return msg;
      },
      getRequestLogMessage: function (request) {
        return request;
      },
      getResponseLogMessage: function (response) {
        return response.text;
      },
    });
  } catch (error) {
    let err = error;
    return error;
    throw new Error();
  }

  return {
    call: function (data) {
      var result;
      try {
        result = restService.setThrowOnError().call(data);
      } catch (error) {
        var erores = error;
        return error;
        throw new Error();
      }
      if (result.isOk()) {
        return restService.response;
      } else {
        return result;
      }
    },
  };
})()