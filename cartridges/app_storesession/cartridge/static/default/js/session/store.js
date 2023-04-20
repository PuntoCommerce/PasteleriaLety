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
    alert("Hay un problema");
  }
};

const handleClickUserLocationD = (urlSet) => {
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
  const confirmButton = document.getElementById('session_search-confirm')
  // const name = document.getElementById("session-store-name");
  const options = {
    componentRestrictions: { country: "MX" },
    types: ["geocode"],
  };

  const urlSet = input.getAttribute("action-url");

  // const autocomplete = new google.maps.places.Autocomplete(input, options);

  // autocomplete.addListener("place_changed", () => {
  //   const place = autocompleteModal.getPlace();
  //   const lat = place.geometry.location.lat();
  //   const lng = place.geometry.location.lng();
  //   handleChange({ lat, lng }, urlSet);
  // });

  // if (confirmButton) {
  //   confirmButton.addEventListener('click', () => {
  //     const geocoder = new google.maps.Geocoder();
  //     const address = input.value;

  //     geocoder.geocode({ address: address }, (results, status) => {
  //       const place = results[0].geometry.location;
  //       const lat = place.lat()
  //       const lng = place.lng()
  //       handleChange({ lat, lng }, urlSet);
  //     })
  //   })
  // }

  if (inputModal) {
    // const autocompleteModal = new google.maps.places.Autocomplete(
    //   inputModal,
    //   options
    // );

    // autocompleteModal.addListener("place_changed", () => {
    //   const place = autocompleteModal.getPlace();
    //   const lat = place.geometry.location.lat();
    //   const lng = place.geometry.location.lng();
    //   handleChange({ lat, lng }, urlSet);
    // });

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
        console.log(status);
      })
    })

    const buttonLocation = document.getElementById("session_search-location");
    buttonLocation.addEventListener("click", (e) => {
      e.preventDefault();
      handleClickUserLocationD(urlSet);
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
    alert("Hay un problema");
  }
};

const handleClickUserLocationM = (urlSet) => {
  const success = ({ coords }) => {
    handleChangeM({ lat: coords.latitude, lng: coords.longitude }, urlSet);
  };
  const error = (e) => {
    alert("Hay un problema");
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

  // const autocomplete = new google.maps.places.Autocomplete(input, options);

  // autocomplete.addListener("place_changed", () => {
  //   const place = autocompleteModal.getPlace();
  //   const lat = place.geometry.location.lat();
  //   const lng = place.geometry.location.lng();
  //   handleChangeM({ lat, lng }, urlSet);
  // });

  // if (confirmButton) {
  //   confirmButton.addEventListener('click', () => {
  //     const geocoder = new google.maps.Geocoder();
  //     const address = input.value;

  //     geocoder.geocode({ address: address }, (results, status) => {
  //       const place = results[0].geometry.location;
  //       const lat = place.lat()
  //       const lng = place.lng()
  //       handleChangeM({ lat, lng }, urlSet);
  //     })
  //   })
  // }

  if (inputModal) {
    // const autocompleteModal = new google.maps.places.Autocomplete(
    //   inputModal,
    //   options
    // );
    // autocompleteModal.addListener("place_changed", () => {
    //   const place = autocompleteModal.getPlace();
    //   const lat = place.geometry.location.lat();
    //   const lng = place.geometry.location.lng();
    //   handleChangeM({ lat, lng }, urlSet);
    // });

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
  initAutocomplete();
  initAutocompleteM();
}
