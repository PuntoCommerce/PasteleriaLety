const base = module.superModule;

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

base.closestStore = (stores, clientLocation) => {
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

const addDistanceToStores = (stores, clientLocation) => {
  let s = undefined;
  let finalStores = [];
  let distance;

  while (stores.hasNext()) {
    s = stores.next();
    distance = calDistance(
      clientLocation.lat,
      clientLocation.lng,
      s.latitude,
      s.longitude
    );
    finalStores.push({
      store: s,
      distance: distance,
    });
  }
  return finalStores;
};

base.sortStoresByDistance = (stores, clientLocation) => {
  let storesWDistance = addDistanceToStores(stores, clientLocation);
  let sortedStores = storesWDistance.sort((a, b) => a.distance - b.distance);
  return sortedStores;
};

module.exports = base;
