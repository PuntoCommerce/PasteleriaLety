var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

if (isFirefox) {
  document.addEventListener('DOMContentLoaded', () => {
    const pickupInput = document.querySelector('input[value="pickup"]');
    const standartInput = document.querySelector('input[value="standart"]');
    const autofillDivs = document.querySelectorAll('.autofill-custompickup');

    // Verificar el estado del input "pickup" al cargar la página
    if (pickupInput.checked) {
      autofillDivs.forEach((div) => {
        div.classList.add('hideFirefox');
      });
    }

    pickupInput.addEventListener('change', (event) => {
      if (event.target.checked) {
        autofillDivs.forEach((div) => {
          div.classList.add('hideFirefox');
        });
      }
    });

    standartInput.addEventListener('change', (event) => {
      if (event.target.checked) {
        autofillDivs.forEach((div) => {
          div.classList.remove('hideFirefox');
        });
      }
    });
  });
}