((window) => {
  const QS = (query) => document.querySelector(query);
  const QSA = (query) => document.querySelectorAll(query);

  window.addEventListener("load", () => {
    handleForm();
  });

  const handleForm = () => {
    let dateForm = QS("#custom-checkout-date");
    let dateFormFW = QS(".form-control.shippingDate");
    let timeForm = QS("#custom-store-hours");

    let currentDate = new Date();

    let formatedCurrentDate = formatDate(currentDate);
    let dataStoreHours = JSON.parse(timeForm.getAttribute("data-store-hours"));

    dateForm.value = formatedCurrentDate;
    dateForm.min = formatedCurrentDate;
    dateFormFW.value = formatedCurrentDate;
    updateStoreDay(
      currentDate
        .toLocaleDateString("en-US", { weekday: "short" })
        .toLowerCase(),
      dataStoreHours,
      timeForm
    );
    currentDate.setDate(currentDate.getDate() + 30);

    dateForm.max = formatDate(currentDate);

    dateForm.addEventListener("change", (e) => {
      e.preventDefault();
      let date = new Date(e.target.value);
      date.setDate(date.getDate() + 1);
      dateFormFW.value = formatDate(date);
      updateStoreDay(
        date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase(),
        dataStoreHours,
        timeForm
      );
    });
  };

  const updateStoreDay = (day, weekSchedule, container) => {
    let inner = ``;
    let { openHours, closeHours } = weekSchedule[day];
    for (let i = openHours; i < closeHours; i++) {
      let { label, id } = formatHours(i);
      if (i === openHours) setStoreHour({ target: { value: label } });
      inner += `
    <div>
      <input type="radio" class="radio-schedule-custom" id="${id}" name="time" ${
        i === openHours ? "checked" : ""
      } value="${label}" />
      <label for="${id}">${label}</label>
    </div>
    `;
    }
    container.innerHTML = inner;
    let radioSchedules = QSA(".radio-schedule-custom");
    radioSchedules.forEach((rs) => rs.addEventListener("change", setStoreHour));
  };

  const setStoreHour = (event) => {
    console.log(event.target.value);
    let timeFormFW = QS(".form-control.shippingTime");
    timeFormFW.value = event.target.value;
  };

  const formatHours = (i) => {
    let open = i;
    let close = i + 1;
    let label = `De ${open > 12 ? open - 12 : open}:00 ${
      open < 12 ? "AM" : "PM"
    } a ${close > 12 ? close - 12 : close}:00 ${close < 12 ? "AM" : "PM"}`;

    return { label, id: `choice${i}` };
  };

  const formatDate = (date) => {
    let year = date.toLocaleString("default", { year: "numeric" });
    let month = date.toLocaleString("default", { month: "2-digit" });
    let day = date.toLocaleString("default", { day: "2-digit" });

    return `${year}-${month}-${day}`;
  };
})(window);
