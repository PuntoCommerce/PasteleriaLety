const rest = require("*/cartridge/scripts/jobs/service");

const requestSoap = (path,method,body) => {
  return rest.call({
      path: path ,
      method: method,
      body:  body
  });
};

module.exports = {
  ExistenciaPorCentroFecha: (data) => requestSoap("ExistenciaPorCentroFecha", "POST", data),
  getLetyClub: (data) => requestSoap("getLetyClub", "POST", data),
};