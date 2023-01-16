const service = require("*/cartridge/scripts/googleMaps/service");

const call = (path, method, params) => {
  return service.call({
    path: path,
    method: method,
    params: params,
  });
};

module.exports = {
  getGeocode: (address) => call("maps/api/geocode/json", "GET", address),
};
