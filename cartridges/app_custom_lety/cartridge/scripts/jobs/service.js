"use strict";

const serviceName = "ERP_PasteleriaLety";
const ServiceCredential = require("dw/svc/ServiceCredential");
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");
const Resource = require("dw/web/Resource");
const functionsSoap = require("*/cartridge/scripts/jobs/functionsSoap");
const xmlSoap = require("*/cartridge/scripts/jobs/xmlSoap");
let pathJson;

/** createRequest callback for a service
 * @param  {dw.svc.Service} service service instance
 * @param  {Object} data call data with path, method, body for a call or createToken in case of recursive call
 * @returns {string} request body
 */
function createRequest(service, data) {
    const credential = service.configuration.credential;
    const { path, method, body, token } = data;
    pathJson=path
    service.setURL(credential.URL);
    service.addHeader("Content-Type", "text/xml; charset=utf-8");
    service.addHeader("SOAPAction", "http://localhost/"+path);
    service.setRequestMethod(method);
    const bodyXML = functionsSoap.body(body,credential,path);
    return bodyXML;
}


module.exports = (function () {
    let restService;
    try {
        restService = LocalServiceRegistry.createService(serviceName, {
            createRequest: createRequest,
            parseResponse: function (_, httpClient) {
                let requestXML = XML(httpClient.getText());
                let xmlString = requestXML.toXMLString();
                let ResponseEndPoint= xmlSoap.responseEndPoint(xmlString,pathJson);
                return ResponseEndPoint;
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
        return error;
        throw new Error();
    }

    return {
        call: function (data) {
            let result;
            try {
                result = restService.setThrowOnError().call(data);
            } catch (error) {
                return error;
            }
           if (result.isOk()) {
                return restService.response;
            } else {
                return result;
            }
        },
    };
})();