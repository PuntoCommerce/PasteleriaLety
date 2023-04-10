(() => {
  const INT_STRING = "no.";
  const EXT_STRING = "ext.";
  const inputAddressOne = document.querySelector("input.shippingAddressOne");
  const button = document.querySelector("button.submit-shipping");
  const feedBack = document.querySelector('div[id*="AddressLine1"]');

  const setError = (message) => {
    button.disabled = true;
    inputAddressOne.classList.add("is-invalid");
    feedBack.innerHTML = message;
  };

  const clearError = () => {
    inputAddressOne.classList.remove("is-invalid");
    feedBack.innerHTML = "";
  };

  // inputAddressOne.addEventListener("change", (e) => {
  //   clearError();
  //   let address = e.target.value;
  //   address = address.toLowerCase();
  //   if (!address.includes(INT_STRING)) {
  //     return setError("Debes incluir la palabra 'No.' para separar el numero.");
  //   }
  //   try {
  //     let [street, interior] = address.split(INT_STRING);
  //     if (!street) {
  //       return setError("Debes agregar una calle antes de numero.");
  //     }
  //     if (!interior) {
  //       return setError("Debes agregar un numero despues de 'No.'");
  //     }

  //     if (interior.includes(EXT_STRING)) {
  //       let [intNumber, exterior] = interior.split(EXT_STRING);
  //       if (!exterior) {
  //         return setError("Debes agregar un numero despues de 'Ext.'");
  //       }
  //       if (!intNumber) {
  //         return setError("Debes agregar una calle antes de numero.");
  //       }
  //     }
  //     button.disabled = false;
  //   } catch (error) {
  //     return setError("Error en el formato de la direccion.");
  //   }
  // });
})();

(() => {
  const QS = (query) => document.querySelector(query);
  const QSA = (query) => document.querySelectorAll(query);

  const jsonCities = QS('#custom-store-cities');
  const citiesOptions = QS('.shippingAddressCity');
  const statesOptions = QS('#state');
  const parseInfo = JSON.parse(jsonCities.getAttribute('data-city-stores'));
  const storeState = localStorage.getItem('selectedState')
  const storeCity = sessionStorage.getItem('selectedCity')

  if (storeState) {
    statesOptions.value = storeState;
    const cities = parseInfo[storeState] || []

    citiesOptions.innerHTML = "";

    if (cities.length === 0) {
      const option = document.createElement('option');
      option.innerText = 'No hay sucursales para este estado';
      citiesOptions.appendChild(option)
    }

    cities.forEach((city, idx) => {
      const option = document.createElement('option');
      option.value = city;
      option.innerText = city;
      citiesOptions.appendChild(option);
    })
  }

  if (storeCity) { citiesOptions.value = storeCity };

  statesOptions.addEventListener('change', (e) => {
    const stateCode = e.target.value
    const cities = parseInfo[stateCode] || []
    localStorage.setItem('selectedState', stateCode)

    citiesOptions.innerHTML = "";

    if (cities.length === 0) {
      const option = document.createElement('option');
      option.innerText = 'No hay sucursales para este estado';
      citiesOptions.appendChild(option)
    }

    cities.forEach((city, idx) => {
      const option = document.createElement('option');
      option.value = city;
      option.innerText = city;
      citiesOptions.appendChild(option);
    })
  })

  citiesOptions.addEventListener('change', (e) => {
    const cityCode = e.target.value
    sessionStorage.setItem('selectedCity', cityCode)
  })
})()
