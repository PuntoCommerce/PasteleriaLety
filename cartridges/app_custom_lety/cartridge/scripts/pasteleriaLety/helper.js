"use strict";
/**
 * Utility for configure service and set url before soap call
 */
var Request = function () {
  let self = this;
  /** @type {dw.svc.Service} */
  let service;
  let requestData;

  self.configureService = function (name) {
    try {
      // let utils = require('int_gestpay/cartridge/scripts/utils/utils');
      let PLservice = require("~/cartridge/scripts/pasteleriaLety/service");
      service = PLservice.serviceMapRegistry.get(name);
      service.setURL(
        "http://acceso.pastelerialety.com/WEBeCommerceDB.asmx?WSDL"
      );
      return self;
    } catch (e) {
      var error = e;
      throw new Error(e);
    }
  };

  self.call = function (args) {
    return service.call(args);
  };
};

function configureService(serviceName) {
  var request = new Request();

  return request.configureService(serviceName);
}

/**
 * @param {string} serviceName
 * @param {{ isEnabledGestPayIframeToken: any; }} obj
 * @param {boolean} [createOrderDetail]
 * @returns {dw.svc.Result}
 */

function configureAndCallService(serviceName, obj) {
  var result;
  try {
    var service = configureService(serviceName);
    result = service.call(obj);
  } catch (e) {
    result = { error: true, e: e };
  }

  return result;
}

module.exports = { configureAndCallService: configureAndCallService };
