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

  inputAddressOne.addEventListener("change", (e) => {
    clearError();
    let address = e.target.value;
    address = address.toLowerCase();
    if (!address.includes(INT_STRING)) {
      return setError("Debes incluir la palabra 'No.' para separar el numero.");
    }
    try {
      let [street, interior] = address.split(INT_STRING);
      if (!street) {
        return setError("Debes agregar una calle antes de numero.");
      }
      if (!interior) {
        return setError("Debes agregar un numero despues de 'No.'");
      }

      if (interior.includes(EXT_STRING)) {
        let [intNumber, exterior] = interior.split(EXT_STRING);
        if (!exterior) {
          return setError("Debes agregar un numero despues de 'Ext.'");
        }
        if (!intNumber) {
          return setError("Debes agregar una calle antes de numero.");
        }
      }
      button.disabled = false;
    } catch (error) {
      return setError("Error en el formato de la direccion.");
    }
  });
})();
