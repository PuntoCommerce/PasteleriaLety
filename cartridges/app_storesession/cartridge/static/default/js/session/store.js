const handleChange = ({ lat, lng }, urlSet) => {
  if (lat && lng) {
    let formData = new FormData();
    formData.append("lat", lat);
    formData.append("lng", lng);
    fetch(urlSet, {
      method: "POST",
      body: formData,
    }).then((response) =>
      response.json().then((json) => {
        if (json.redirectUrl) {
          location.href = json.redirectUrl;
        } else {
          location.reload();
        }
      })
    );
  } else {
    alert("Acceso a ubicación denegado. Verifica los permisos de ubicación en tu navegador y vuelve a intentar.");
  }
};

const handleClickUserLocationDesk = (urlSet) => {
  const success = ({ coords }) => {
    handleChange({ lat: coords.latitude, lng: coords.longitude }, urlSet);
  };
  const error = (e) => {
    alert("Acceso a ubicación denegado. Verifica los permisos de ubicación en tu navegador y vuelve a intentar.");
  };
  navigator.geolocation.getCurrentPosition(success, error);
};

function initAutocompleteDesk() {
  const input = document.getElementById("session_search");
  const inputModal = document.getElementById("session_search-modal");
  const cleanStore = document.getElementById("cleanStore");
  const confirmButton = document.getElementById('session_search-confirm')
  // const name = document.getElementById("session-store-name");
  const options = {
    componentRestrictions: { country: "MX" },
    types: ["geocode"],
  };

  const urlSet = input.getAttribute("action-url");


  if (inputModal) {

    confirmButton.addEventListener('click', () => {
      const geocoder = new google.maps.Geocoder();
      const addressModal = inputModal.value;

      geocoder.geocode({ address: addressModal }, (results, status) => {
        if (status === 'OK') {
          const place = results[0].geometry.location;
          const lat = place.lat()
          const lng = place.lng()
          handleChange({ lat, lng }, urlSet);
        }
      })
    })

    const buttonLocation = document.getElementById("session_search-location");
    buttonLocation.addEventListener("click", (e) => {
      e.preventDefault();
      handleClickUserLocationDesk(urlSet);
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
const handleChangeM = ({ lat, lng }, urlSet) => {
  if (lat && lng) {
    let formData = new FormData();
    formData.append("lat", lat);
    formData.append("lng", lng);
    fetch(urlSet, {
      method: "POST",
      body: formData,
    }).then((response) =>
      response.json().then((json) => {
        if (json.redirectUrl) {
          location.href = json.redirectUrl;
        } else {
          location.reload();
        }
      })
    );
  } else {
    alert("Acceso a ubicación denegado. Verifica los permisos de ubicación en tu navegador y vuelve a intentar.a");
  }
};

const handleClickUserLocationM = (urlSet) => {
  const success = ({ coords }) => {
    handleChangeM({ lat: coords.latitude, lng: coords.longitude }, urlSet);
  };
  const error = (e) => {
    alert("Acceso a ubicación denegado. Verifica los permisos de ubicación en tu navegador y vuelve a intentar.");
  };
  navigator.geolocation.getCurrentPosition(success, error);
};

function initAutocompleteM() {
  const input = document.getElementById("session_searchMobile");
  const inputModal = document.getElementById("session_search-modalMobile");
  const cleanStore = document.getElementById("cleanStoreMobile");
  const confirmButton = document.getElementById('session_search-confirmMobile')
  // const name = document.getElementById("session-store-name");
  const options = {
    componentRestrictions: { country: "MX" },
    types: ["geocode"],
  };

  const urlSet = input.getAttribute("action-url");

  if (inputModal) {

    confirmButton.addEventListener('click', () => {
      const geocoder = new google.maps.Geocoder();
      const addressModal = inputModal.value;
      console.log(addressModal);
  
      geocoder.geocode({ address: addressModal }, (results, status) => {
  
        if (status === 'OK') {
          const place = results[0].geometry.location;
          const lat = place.lat()
          const lng = place.lng()
          handleChangeM({ lat, lng }, urlSet);
        }
      })
    })

    const buttonLocation = document.getElementById(
      "session_search-locationMobile"
    );
    buttonLocation.addEventListener("click", (e) => {
      e.preventDefault();
      handleClickUserLocationM(urlSet);
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

function initBothAutocomplete() {
  initAutocompleteDesk();
  initAutocompleteM();
}
