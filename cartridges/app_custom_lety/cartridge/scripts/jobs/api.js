const rest = require("*/cartridge/scripts/jobs/service");

const requestSoap = (path,method,body) => {
  return rest.call({
      path: path ,
      method: method,
      body:  body
  });
};

module.exports = {
  ApiLety: (path,data) => requestSoap(path, "POST", data),
};