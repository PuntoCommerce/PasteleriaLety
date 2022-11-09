const handleChange = ({ lat, lng }, urlSet) => {
  if (lat && lng) {
    let formData = new FormData();
    formData.append("lat", lat);
    formData.append("lng", lng);
    fetch(urlSet, {
      method: "POST",
      body: formData,
    }).then((_) => location.reload());
  } else {
    alert("Hay un problema");
  }
};

const handleClickUserLocation = (urlSet) => {
  const success = ({ coords }) => {
    handleChange({ lat: coords.latitude, lng: coords.longitude }, urlSet);
  };
  const error = (e) => {
    alert("Hay un problema");
  };
  navigator.geolocation.getCurrentPosition(success, error);
};

function initAutocomplete() {
  const input = document.getElementById("session_search");
  const inputModal = document.getElementById("session_search-modal");
  const cleanStore = document.getElementById("cleanStore");
  // const name = document.getElementById("session-store-name");
  const options = {
    componentRestrictions: { country: "MX" },
    types: ["geocode"],
  };

  const urlSet = input.getAttribute("action-url");

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  autocomplete.addListener("place_changed", () => {
    const place = autocompleteModal.getPlace();
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    handleChange({ lat, lng }, urlSet);
  });

  if (inputModal) {
    const autocompleteModal = new google.maps.places.Autocomplete(
      inputModal,
      options
    );
    autocompleteModal.addListener("place_changed", () => {
      const place = autocompleteModal.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      handleChange({ lat, lng }, urlSet);
    });

    const buttonLocation = document.getElementById("session_search-location");
    buttonLocation.addEventListener("click", (e) => {
      e.preventDefault();
      handleClickUserLocation(urlSet);
    });
  }

  if (cleanStore) {
    const urlClen = cleanStore.getAttribute("action-url");
    cleanStore.addEventListener("click", (e) => {
      e.preventDefault();
      fetch(urlClen, { method: "POST" }).then((_) => location.reload());
    });
  }
}