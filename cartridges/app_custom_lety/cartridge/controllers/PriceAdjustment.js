const server = require("server");
 
 
var BasketMgr = require('dw/order/BasketMgr');
var Transaction = require('dw/system/Transaction');
var AmountDiscount = require('dw/campaign/AmountDiscount');
var ProductLineItem = require('dw/order/ProductLineItem');
 
// const currentBasket = BasketMgr.getCurrentBasket();
 
server.post("LetyPuntos", (req, res, next) => {
  
   const currentBasket = BasketMgr.getCurrentBasket();
 
   const {toAjustment, member} = req.form;
 
   let result;
   let code;
   let err;
  
   try {
 
       Transaction.wrap( function (params) {
           currentBasket.createPriceAdjustment("promoprueba", AmountDiscount(Number(toAjustment)));
       });
 
       code = 0;
       err = "Sin error";
      
   } catch (error) {
       err = error;
       code = 1;
       result = "";
   }
 
   res.json({
       body: toAjustment,
       err,
       code
   })
 
   next();
});
 
server.post("RemoveLetyPuntos", (req, res, next) => {
 
   /*
       Si se intenta remover el ajuste de precio si haber agregado antes, lanzara una excepcion.
       validar que solo aplique si existe.
   */
 
   const currentBasket = BasketMgr.getCurrentBasket();
 
   let result;
   let code;
   let err;
 
   try {
 
       Transaction.wrap( function (params) {
           result = currentBasket.removePriceAdjustment(currentBasket.priceAdjustments[0]);
       });
 
       code = 0;
       err = "Sin error";
 
   } catch (error) {
       err = error;
       code = 1;
       result = "";
   }
 
   res.json({
       err,
       code,
       response: result
     });
 
   next();
});
 
module.exports = server.exports();