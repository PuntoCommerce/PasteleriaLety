const { TYPES } = require("~/cartridge/scripts/pasteleriaLety/service");
const {
  configureAndCallService,
} = require("~/cartridge/scripts/pasteleriaLety/helper");

module.exports = {
  CatalogoDeSucursales: () => configureAndCallService(TYPES.test, {}),
};
