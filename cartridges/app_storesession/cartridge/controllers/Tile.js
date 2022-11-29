const server = require("server");
server.extend(module.superModule);
const storeInventory = require("*/cartridge/scripts/middlewares/storeInventory");

server.append("Show", storeInventory.checkInventory);

module.exports = server.exports();
