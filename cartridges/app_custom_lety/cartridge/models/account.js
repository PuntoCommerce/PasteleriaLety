const base = module.superModule;
function account(currentCustomer, addressModel, orderModel) {
  base.call(this, currentCustomer, addressModel, orderModel);
  if(!typeof(currentCustomer.raw.authenticated)){
    if (currentCustomer.raw.profile.custom.hasOwnProperty('letyPuntosCard')) {
      this.LetyCard = currentCustomer.raw.profile.custom.letyPuntosCard;
    } else {
      this.LetyCard = undefined;
    }
    this.customerNo = currentCustomer.profile.customerNo;
  }else{
    this.LetyCard = undefined;
    this.customerNo = undefined;
  } 
  
}

module.exports = account;
