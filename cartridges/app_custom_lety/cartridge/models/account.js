const base = module.superModule;
function account(currentCustomer, addressModel, orderModel) {
  base.call(this, currentCustomer, addressModel, orderModel);
  if(currentCustomer.raw.authenticated===true){
    if (currentCustomer.raw.profile.custom.hasOwnProperty('letyPuntosCard')) {
      this.LetyCard = currentCustomer.raw.profile.custom.letyPuntosCard;
    } else {
      this.LetyCard = undefined;
    }
    this.customerNo = currentCustomer.profile.customerNo;
  }else{
    this.LetyCard = undefined;
  } 
  
}

module.exports = account;
