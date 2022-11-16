 const Transaction = require("dw/system/Transaction");
 const CustomerMgr = require("dw/customer/CustomerMgr");

 const ApiServiceLety = require("*/cartridge/scripts/jobs/api");

 function addLetyCardToCustomer(customerNo, letyCard){
    let Func_ExisteMembrecia = ApiServiceLety.ApiLety(
        "Func_ExisteMembrecia",
        { 
          Empresa: 1, 
          s_IdMembresia: letyCard 
        }
      );
      let ExistenciaLetyCart = [];
      let Exis = {};

      if(Func_ExisteMembrecia.ERROR) {
        ExistenciaLetyCart = []
      }else{
        let JsonFunc_ExisteMembrecia = JSON.parse(Func_ExisteMembrecia);
        ExistenciaLetyCart =JsonFunc_ExisteMembrecia.Func_ExisteMembrecia;
        Exis = ExistenciaLetyCart[0].Column1;
        if(Exis=='1'){
            const customer = CustomerMgr.getProfile(customerNo);
            if (customer && letyCard) {
                Transaction.wrap(() => {
                customer.custom.letyPuntosCard = letyCard;
                });
            }
        }else{
        }
      }
    
 };

 module.exports = {
   addLetyCardToCustomer: addLetyCardToCustomer,
 };
