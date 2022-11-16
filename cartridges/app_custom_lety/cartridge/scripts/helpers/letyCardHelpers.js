 const Transaction = require("dw/system/Transaction");
 const CustomerMgr = require("dw/customer/CustomerMgr");

 const ApiServiceLety = require("*/cartridge/scripts/jobs/api");

 const addLetyCardToCustomer = ({ customerNo, letyCard }) => {
    let Func_ExisteMembrecia = ApiServiceLety.ApiLety(
        "Func_ExisteMembrecia",
        { 
          Empresa: 1, 
          s_IdMembresia: letyCard 
        }
      );
      let ExistenciaLetyCart = [];

      if(Func_ExisteMembrecia.ERROR) {
        ExistenciaLetyCart = []
      }else{
        let JsonFunc_ExisteMembrecia = JSON.parse(Func_ExisteMembrecia);
        ExistenciaLetyCart =JsonFunc_ExisteMembrecia.Func_ExisteMembrecia;
        if(ExistenciaLetyCart===1){
            const customer = CustomerMgr.getProfile(customerNo);
            if (customer && letyCard) {
                Transaction.wrap(() => {
                customer.custom.letyPuntosCard = letyCard;
                });
            }
        }else{
            const Hola = "fff";
        }
      }
    
 };

 module.exports = {
   addLetyCardToCustomer: addLetyCardToCustomer,
 };
