const server = require("server");
server.extend(module.superModule);

server.append("AddProduct", (req, res, next) => {
    const viewData = res.getViewData();
    const querystring = req.querystring;
    next();
});

module.exports = server.exports();