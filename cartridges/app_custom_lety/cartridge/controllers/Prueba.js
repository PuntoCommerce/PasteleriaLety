const server = require("server");
const mapsApi = require("*/cartridge/scripts/googleMaps/api");

server.get("Maps", (req, res, next) => {
  const response = mapsApi.getGeocode([
    { key: "new_forward_geocoder", value: "true" },
    {
      key: "address",
      value: "Puerto la paz 515, Circunvalacion Belisario, 44330",
    },
  ]);

  res.json({ hola: "Mundo", response: response });
  next();
});

module.exports = server.exports();
