((window) => {
  const QS = (query) => document.querySelector(query);
  const QSA = (query) => document.querySelectorAll(query);

  const handleStoreHours = (shippingMethodId = undefined) => {
    let timeForm = QS("#custom-store-hours");
    let allSM = JSON.parse(timeForm.getAttribute("data-store-hours"));
    let activeSM;
    if (shippingMethodId) {
      activeSM = { value: shippingMethodId };
    } else {
      activeSM = QS(".shipping-item-container input[type='radio'][checked]");
    }
    return allSM[activeSM.value] || allSM.default;
  };

  const handleStoreCities = () => {
    const jsonCities = QS('#custom-store-cities');
    const citiesOptions = QS('.shippingAddressCity');
    const statesOptions = QS('#shippingStatedefault');
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
  }

  const handleForm = () => {
    let dateForm = QS("#custom-checkout-date");
    let dateFormFW = QS(".form-control.shippingDate");
    let shippingMethods = QSA(".shipping-item-container input[type='radio']");

    let currentDate = new Date();

    let formatedCurrentDate = formatDate(currentDate);
    let { days, daysToOrderAfterCurrentDay } = handleStoreHours();
    handleStoreCities();


    dateForm.value = formatedCurrentDate;
    dateForm.min = formatedCurrentDate;
    dateFormFW.value = formatedCurrentDate;
    updateStoreDay(currentDate, days);

    currentDate.setDate(currentDate.getDate() + daysToOrderAfterCurrentDay);
    dateForm.max = formatDate(currentDate);

    //Buttons Dates
    var minDate = dateForm.getAttribute('min').split('-');
    var maxDate = dateForm.getAttribute('max').split('-');
    var totalDys = (maxDate[2] - minDate[2]) + 1;

    updateButtonsDate(totalDys, dateForm.min, dateForm.max)

    shippingMethods.forEach((sm) =>
      sm.addEventListener("change", (e) => {
        e.preventDefault();
        let newValues = handleStoreHours(e.target.value);
        days = newValues.days;

        let currentDate = new Date();
        let formatedCurrentDate = formatDate(currentDate);
        dateForm.value = formatedCurrentDate;
        dateForm.min = formatedCurrentDate;
        dateFormFW.value = formatedCurrentDate;
        updateStoreDay(currentDate, days);

        currentDate.setDate(
          currentDate.getDate() + newValues.daysToOrderAfterCurrentDay
        );
        dateForm.max = formatDate(currentDate);

        var minDate = dateForm.getAttribute('min').split('-');
        var maxDate = dateForm.getAttribute('max').split('-');
        var totalDys = (maxDate[2] - minDate[2]) + 1

        updateButtonsDate(totalDys, dateForm.min, dateForm.max)

        let changeButtonsDate = QSA('#changeDateValue')

        changeButtonsDate.forEach((item, idx) => {
          item.addEventListener('click', (e) => {
            const dateValue = e.target.getAttribute('data-value')
            let date = new Date(dateValue)
            date.setDate(date.getDate() + 1);
            dateForm.value = formatDate(date);
            updateStoreDay(date, days)
            dateFormFW.value = dateValue;

            changeButtonsDate.forEach((btn, index) => { if (index !== idx) { btn.classList.remove('active') } })

            e.target.classList.add('active')
          })
        })
      })
    );

    let changeButtonsDate = QSA('#changeDateValue')

    changeButtonsDate.forEach((item, idx) => {
      item.addEventListener('click', (e) => {
        const dateValue = e.target.getAttribute('data-value')
        let date = new Date(dateValue)
        date.setDate(date.getDate() + 1);
        dateForm.value = formatDate(date);
        updateStoreDay(date, days)
        dateFormFW.value = dateValue;

        changeButtonsDate.forEach((btn, index) => { if (index !== idx) { btn.classList.remove('active') } })

        e.target.classList.add('active')
      })
    })

    dateForm.addEventListener("change", (e) => {
      e.preventDefault();
      let date = new Date(e.target.value);
      date.setDate(date.getDate() + 1);
      dateFormFW.value = formatDate(date);
      updateStoreDay(date, days);
    });
  };

  const updateButtonsDate = (idx, min, max) => {
    //Buttons Dates

    var buttonsDate = QS('#buttonDates')
    var dates = [min, max]
    let buttons = ``;

    for (let i = 0; i < idx; i++) {
      buttons += `<button type='button' 
      class='${i === 0 && 'active'}'
      data-idx='${i}' 
      data-value='${dates[i]}' 
      id='changeDateValue'>${dates[i]}</button>`
    }

    buttonsDate.innerHTML = buttons
    ////////////////////////////////
  }

  const updateStoreDay = (date, weekSchedule) => {
    let container = QS("#custom-store-hours");
    let text = QS('#custom-store-text')
    let today = new Date();
    let todayWeekDay = today
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase();
    let day = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .toLowerCase();
    if (!weekSchedule[day]) {
      // null = No service.
      container.innerHTML = container.getAttribute("error-no-hours");
      return;
    }
    let inner = ``;
    let innerText = ``
    let { openHours, closeHours, after } = weekSchedule[day];
    let timeFormFW = QS(".form-control.shippingTime");

    if (openHours < today.getHours() && todayWeekDay == day) {
      openHours = today.getHours();
    }

    if (today.getHours() >= openHours) {
      for (let i = openHours; i < closeHours; i++) {
        let { label, id } = formatHours(i);
        if (i === openHours) setStoreHour({ target: { value: i } });
        inner += `
        <div>
          <input type="radio" class="radio-schedule-custom" id="${id}" name="time" ${i === openHours ? "checked" : ""
          } value="${i}" />
          <label for="${id}">${label}</label>
        </div>`;
      }
    }


    if (after === true && today.getHours() < closeHours && today.getHours() >= openHours) {
      innerText = `
        <span class='store-hour-notice'>
          Su pedido sera entregado dentro de las 2 horas posteriores a la confirmacion de su compra
        </span>
      `
    }

    container.innerHTML = inner || [container.getAttribute("error-no-hours"), timeFormFW.value = ''];
    text.innerHTML = innerText;
    let radioSchedules = QSA(".radio-schedule-custom");
    radioSchedules.forEach((rs) => rs.addEventListener("change", setStoreHour));
  };

  const setStoreHour = (event) => {
    let timeFormFW = QS(".form-control.shippingTime");
    timeFormFW.value = event.target.value;
  };

  const formatHours = (i) => {
    let open = i;
    let close = i + 1;
    let label = `De ${open > 12 ? open - 12 : open}:00 ${open < 12 ? "AM" : "PM"
      } a ${close > 12 ? close - 12 : close}:00 ${close < 12 ? "AM" : "PM"}`;

    return { label, id: `choice${i}` };
  };

  const formatDate = (date) => {
    let year = date.toLocaleString("default", { year: "numeric" });
    let month = date.toLocaleString("default", { month: "2-digit" });
    let day = date.toLocaleString("default", { day: "2-digit" });

    return `${year}-${month}-${day}`;
  };

  window.addEventListener("load", handleForm);
})(window);
