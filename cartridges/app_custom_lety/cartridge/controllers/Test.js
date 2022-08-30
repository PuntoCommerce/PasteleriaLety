const server = require("server");
const {
  CatalogoDeSucursales,
} = require("~/cartridge/scripts/pasteleriaLety/api");

server.get("Test", (req, res, next) => {
  const s = CatalogoDeSucursales();

  res.json({ s: s });

  next();
});

module.exports = server.exports();
