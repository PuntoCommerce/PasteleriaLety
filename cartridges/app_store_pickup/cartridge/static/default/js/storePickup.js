async function setStores(lat, long, search) {
  const url = search.getAttribute("data-url");
  const results = document.getElementById("custom-pickup-results");
  const formData = new FormData();
  formData.append("lat", lat);
  formData.append("long", long);
  formData.append("products", []);

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });
  const json = await res.json();
  if (!json.error) {
    results.innerHTML = json.renderedStores;
  }
}

function useUserLocation(search) {
  const success = ({ coords }) => {
    setStores(coords.latitude, coords.longitude, search);
    search.value = coords.latitude + ", " + coords.longitude;
  };

  const error = () => {
    alert("Imposible obtener la ubicacion");
    setStores(undefined, undefined, search);
  };

  navigator.geolocation.getCurrentPosition(success, error);
}

function initAutocomplete() {
  const search = document.getElementById("search-store-custom");
  const clearSearch = document.getElementById("clear-search-store");
  const userLocationSearch = document.getElementById(
    "user-location-search-store"
  );

  const options = {
    componentRestrictions: { country: "MX" },
    types: ["geocode"],
  };
  clearSearch.addEventListener("click", (e) => {
    e.preventDefault();
    search.value = "";
    setStores(undefined, undefined, search);
  });

  userLocationSearch.addEventListener("click", (e) => {
    e.preventDefault();
    useUserLocation(search);
  });

  const autocomplete = new google.maps.places.Autocomplete(search, options);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    setStores(lat, lng, search);
  });
}

function getSummary(store) {
  let inner = `
    <input type="hidden" name="store" value="${store.ID}">
    <p>${store.name}</p>
    <p>${store.address1}</p>
  `;
  return inner;
}

function setSummaryStore(storeJson) {
  $(".custom-pickup-form").addClass("d-none");
  $(".custom-pickup-summary").addClass("d-flex");
  $(".custom-pickup-summary").removeClass("d-none");
  let store = JSON.parse(storeJson);
  const summaryStore = document.getElementById("custom-pickup-summary-store");
  summaryStore.innerHTML = getSummary(store);
}

function onLoadsetSummaryStore(storeJson) {
  let store = JSON.parse(storeJson);
  const summaryStore = document.getElementById("custom-pickup-summary-store");
  if (store) {
    summaryStore.innerHTML = getSummary(store);
    $('#custom-pickup-clear-store').removeClass('d-none')
  }
}

function clearStore() {
  const search = document.getElementById("search-store-custom");
  const summaryStore = document.getElementById("custom-pickup-summary-store");
  $(".custom-pickup-form").removeClass("d-none");
  $(".custom-pickup-summary").removeClass("d-flex");
  $(".custom-pickup-summary").addClass("d-none");
  summaryStore.innerHTML = "";
  search.value = "";
}

const clearButton = document.getElementById("custom-pickup-clear-store");
clearButton.addEventListener("click", clearStore);

window.addEventListener("load", () => {
  const summary = document.getElementById("custom-pickup-summary");
  let defaultStore = summary.getAttribute("default-store");
  if (defaultStore != "null") {
    onLoadsetSummaryStore(defaultStore);
  }
});
