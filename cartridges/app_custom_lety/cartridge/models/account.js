const base = module.superModule;

function account(currentCustomer, addressModel, orderModel) {
  base.call(this, currentCustomer, addressModel, orderModel);
  if (currentCustomer.raw.profile.custom.hasOwnProperty('letyPuntosCard')) {
    this.LetyCard = currentCustomer.raw.profile.custom.letyPuntosCard;
  } else {
    this.LetyCard = undefined;
  }
  this.customerNo = currentCustomer.profile.customerNo;
}

module.exports = account;
