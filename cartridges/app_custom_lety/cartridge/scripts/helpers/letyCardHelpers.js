/* const Transaction = require("dw/system/Transaction");
 const CustomerMgr = require("dw/customer/CustomerMgr");

 const addLetyCardToCustomer = ({ customerNo, letyCard }) => {
   const customer = CustomerMgr.getProfile(customerNo);
   if (customer && letyCard) {
     Transaction.wrap(() => {
       customer.custom.letyPuntosCard = letyCard;
     });
   }
 };

 module.exports = {
   addLetyCardToCustomer: addLetyCardToCustomer,
 };*/
