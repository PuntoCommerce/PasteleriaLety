const calDistance = (lat1, lon1, lat2, lon2) => {
  const rad = (x) => {
    return (x * Math.PI) / 180;
  };
  const R = 6378.137; //Earth radius in km
  const dLat = rad(lat2 - lat1);
  const dLong = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

const closestStore = (stores, clientLocation) => {
  let store = undefined;
  let minDistance = undefined;

  while (stores.hasNext()) {
    let s = stores.next();
    let newDistance = calDistance(
      clientLocation.lat,
      clientLocation.lng,
      s.latitude,
      s.longitude
    );

    if (!minDistance || minDistance > newDistance) {
      minDistance = newDistance;
      store = s.ID;
    }
  }

  return store;
};

module.exports = { closestStore: closestStore };
