# Endpoints #

### Table of contents ###

1. [Function Soap](#function-soap)
2. [Service](#service)
3. [XML Soap](#xml-soap)

Endpoints play a crucial role in the LETY Project, enabling communication between systems to exchange order summaries, new user registrations, account information updates for EVO synchronization, and delivery service range queries.
To manage endpoints effectively, the project utilizes three main files: 
  
  ### Function Soap ###
  This file contains the XML body used in requests. 
  As EVO requires XML format for requests and responses, this file is responsible for constructing the request structure. 
  The file is located at _`app_custom_lety > cartridge > scripts > jobs`_. 

  ```javascript
    if (path === "getLetyClub") {
    return '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
      '<soap:Body><' + path + ' xmlns="http://localhost/">' +
      '<IdEmpresa>' + data.Empresa + '</IdEmpresa>' +
      '<vUsr>' + credential.user + '</vUsr>' +
      '<vPwd>' + credential.password + '</vPwd>' + handleEnviroment() +
      '<s_IdMembresia>' + data.s_IdMembresia + '</s_IdMembresia>' +
      '</' + path + '>' +
      '</soap:Body>' +
      '</soap:Envelope>';
    }
  ```
  
  If we need to add a new endpoint in our function soap, we need to add a conditional according to the name of the xml body. We can use the data to get the params in our endpoint, we can see the structure:

  ```javascript
  module.exports = {
    ApiLety: (path,data) => requestSoap(path, "POST", data)
  };
  ```

  First we get the path of the endpoint, second one we use the method post, Pasteleria Lety has this method for all the consults in his endpoints, 
  if we want to get a data, user, Id membership we use the method post even if we want to insert information. The third one is the data, 
  we can have a Json object with the information that we want to send, and we can access on it from data.

  ```javascript
  let Func_DatosMembresia = ApiServiceLety.ApiLety('Func_DatosMembresia', {
    Empresa: 1,
    s_IdMembresia letyCard
  });
  ```

  ### Service ###
  Responsible for establishing the connection and interacting with the service endpoint. 
  The createRequest function within this file handles the transmission of headers and request body. 
  Refer to [Salesforce Commerce B2C Web Services documentation](https://developer.salesforce.com/docs/commerce/b2c-commerce/guide/b2c-webservices.html#create-a-service-instance) 
  for further details on using services in Salesforce. 

  ```javascript
  LocalServiceRegistry.createService(serviceName, {
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
  ```

In the service.js we can get the response that the endpoint returns, 
if the response is wrong or success, if we have an error in the information that we send previously we can see that using the debugger. 
In the button of the service, we have the responses that we can return if all is okay or not, you can put a break point in the error response or in the result.isOk() to see the information. 

```javascript
return {
        call: function (data) {
            let result;
            try {
                result = restService.setThrowOnError().call(data);
            } catch (error) {
                let err = error;
                return error;
            }
           if (result.isOk()) {
                return restService.response;
            } else {
                return result;
            }
        },
    };
```

### XML Soap ###

This file is involved in parsing the response from the endpoint. 
It contains logic to deconstruct the XML response using **XMLList** and retrieve specific elements using the **descendants** method. 
The extracted values are then converted to JSON for further use. 

```javascript
if (path === "ActualizaPerfilPersona") {
    let Co = XMLList(xml).descendants("iCode");
    let sM = XMLList(xml).descendants("sMensaje");

    return { iCode: Co.toString(), sMensaje: sM.toString() };
  }
```

Finaly we have the xml soap where we can deconstruct the XML response to get the information that we want, 
we get the `iCode` and the `sMensaje` that we receive, is important always get these two params, according to the iCode we can know if we have an error or not and we can see the message in the error, 
even we can get another params for example if we can try to get a _`user information`_ from evo we can call even the `userID`, `name` or `email` according to the information that the client returns. 

You can know the name of all these params using the **debugger**, if you do hover on the xml into the `XMLList()` you can see the information about the response and know what params contain.