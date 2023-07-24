const { ApiLety } = require("~/cartridge/scripts/jobs/api");

const sendShippingOrderToERP = (payload) => {
  const response = ApiLety("RegistraServDom", payload);

  return response;
}

module.exports = {
  sendShippingOrderToERP: sendShippingOrderToERP,
}