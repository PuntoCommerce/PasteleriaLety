const serviceName = "ERP_PasteleriaLety";
const LocalServiceRegistry = require("dw/svc/LocalServiceRegistry");

var serviceMapRegistry = new dw.util.HashMap();
var WEBeCommerceDB = new webreferences2["WEBeCommerceDB"].ObjectFactory();

const TYPES = {
  test: "test",
};

function getXmlValue(responseSections, value) {
  return responseSections.descendants(value).toString();
}

serviceMapRegistry.put(
  TYPES.test,
  LocalServiceRegistry.createService(serviceName, {
    initServiceClient: function () {
      return webreferences2["WEBeCommerceDB"].getDefaultService();
    },
    createRequest: function (svc, object) {
      var requestObject = WEBeCommerceDB.createCatalogoDeSucursales();
      requestObject.setIdEmpresa(1);
      requestObject.setVUsr("eCommerce");
      requestObject.setVPwd("P@steleri@Lety#");

      // requestObject.setShopLogin(object.shopLogin);
      // requestObject.setAmount(object.amount);
      // requestObject.setUicCode(
      //   object.uicCode || settings.getUicCurrencyCode(object.currency)
      // );
      // requestObject.setShopTransID(object.shopTransactionID);
      // requestObject.setBankTransID(object.bankTransactionID);
      // requestObject.setFullFillment(object.fullFillment);
      // if (settings.getApikey()) {
      //   requestObject.setApikey(settings.getApikey());
      // }

      return requestObject;
    },
    execute: function (svc, requestObject) {
      return svc.serviceClient.catalogoDeSucursales();
    },
    parseResponse: function (svc, responseObject) {
      var responseSections = new XMLList(
        responseObject.callCatalogoDeSucursalesResult.content.toArray()
      );

      return {
        name: getXmlValue(responseSections, "Nombre"),
        // transactionResult: getXmlValue(responseSections, "TransactionResult"),
        // bankTransactionID: getXmlValue(responseSections, "BankTransactionID"),
        // shopTransactionID: getXmlValue(responseSections, "ShopTransactionID"),
        // errorCode: getXmlValue(responseSections, "ErrorCode"),
        // errorDescription: getXmlValue(responseSections, "ErrorDescription"),
      };
    },
  })
);

exports.serviceMapRegistry = serviceMapRegistry;

exports.TYPES = TYPES;
