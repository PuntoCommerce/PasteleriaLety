const server = require("server");
server.extend(module.superModule);

server.append("AddProduct", (req, res, next) => {
    const viewData = res.getViewData();
    const querystring = req.querystring;
    next();
}); 

server.get("Prueba", (req, res, next)=>{
    var productMgr = require('dw/catalog/ProductMgr');
    var product = productMgr.getProduct("dragonballz1-1");
    res.print("algo");
    //product.custom.
    //personalizado
    next();
})

module.exports = server.exports();