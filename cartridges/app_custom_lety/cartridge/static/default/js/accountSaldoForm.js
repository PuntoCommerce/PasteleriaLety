/* vars */
var dateRegex = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
let gender = "";
let ciudadId = "";
let dataIdCity = "";
let dataIdState = "";
let listStates = [];
/* Require fileds list */
const arrayFields = ["LetyCard", "s_Nombre", "s_ApellidoPat", "s_Apmaterno", "s_Mail", "s_Telefono1", "s_Colonia", "Ciudad"];
/* tags checkbox */
const mMale = document.querySelector("#mMale");
const fFemale = document.querySelector("#fFemale");
const kOtro = document.querySelector("#kOtro");
/* Selects */
const kEstadosList = document.querySelector("#kEstadosList");
const cCiudad = document.querySelector("#cCiudad");
/* inputs  */
const accountSaldoForm = document.querySelector("#accountSaldoForm");
const getDataAccountForm = document.querySelector("#getDataAccountForm");
const lLetyCard = document.querySelector("#lLetyCard");
const s_Nombre = document.querySelector("#s_Nombre");
const s_ApellidoPat = document.querySelector("#s_ApellidoPat");
const s_Apmaterno = document.querySelector("#s_Apmaterno");
const s_Mail = document.querySelector("#s_Mail");
const s_EstadoCivil = document.querySelector("#s_EstadoCivil");
const s_Telefono1 = document.querySelector("#s_Telefono1");
const s_Colonia = document.querySelector("#s_Colonia");
const dtFechaNacimiento = document.querySelector("#dtFechaNacimiento");
const PreferenciaProducto = document.querySelector("#PreferenciaProducto");
const f_Adreess = document.querySelector("#f_Adreess");
/* alerts */
const info = document.querySelector("#msgError");
window.onload = async function () {
   $("#modalLoading").modal('show');
   /* retrieve the city id and state id from the data properties, if the id exist initialize the selectors with the information if not initialize them with default values. */
   dataIdCity = cCiudad.getAttribute("data-lcity");
   dataIdState = kEstadosList.getAttribute("data-dstate");
   let cities = "";
   if(!isEmptyField(dataIdCity) && !isEmptyField(dataIdState)) {
       let index = 0;
       let indexCity = 0;
       for (const item of kEstadosList) {
           if(item.value == dataIdState) {
               kEstadosList.selectedIndex = index;
           }
           index++;
       }
       for (const item of cCiudad) {
           if(item.value == dataIdState) {
               cities += `<option value="${item.value}" data-icity="${item.getAttribute("data-icity")}">${item.textContent}</option>`;
           }
       }
       cCiudad.innerHTML = cities;
       index = 0;
 
       for (const item of cCiudad) {
           if(item.getAttribute("data-icity") == dataIdCity) {
               indexCity = index;
           }
           index++;
       }
       cCiudad.selectedIndex = indexCity;
   }
   setTimeout(() => {
       $("#modalLoading").modal('hide');
   }, 1000);
   /* end */
   const dS_Sexo = document.querySelector("#dS_Sexo").getAttribute("data-tipo");
   if (!isEmptyField(dS_Sexo)) {
       if (dS_Sexo === "Masculino") {
           mMale.checked = true;
           fFemale.checked = false;
           kOtro.checked = false;
           gender = "Masculino";
       } else if (dS_Sexo === "Femenino") {
           fFemale.checked = true;
           mMale.checked = false;
           kOtro.checked = false;
           gender = "Femenino";
       }
       else if (dS_Sexo === "Otro") {
           kOtro.checked = true;
           mMale.checked = false;
           fFemale.checked = false;
           gender = "Otro";
       }
   }
   const dateBirth = document.querySelector("#dtFechaNacimiento").getAttribute("data-datebirth").split("/");
   $("#dtFechaNacimiento").val(dateBirth[2] + "-" + dateBirth[1] + "-" + dateBirth[0]);
}
const populateListCities = async(idState) => {
  /*
  Every time the state selector changes, the city selector is initialized only with the cities belonging to the state id.
  The firstCity variable is to initialize the initial value of the city selector for the first time, this is in case a state is not selected, by default the first city is the first of the state.
  */
  cCiudad.innerHTML = "";
   /* populate states list */
   $("#modalLoading").modal('show');
   const response = await fetch("Account-getCities", {
       method: "POST",
       body: JSON.stringify({})
   });
   const result = await response.json();
   if(result.code === 1) {
       // launch alert and block buttons.
   } else {}
   $("#modalLoading").modal('hide');
   // Validate that it contains information and is not an empty object.
  cCiudad.innerHTML = ""; // Delete the previous cities.
  let listStates = result.JsonDatosCiudades;
  let cities = "";
  let firstCity = true;
  for (const item of listStates) {
       if(item.iIdEstado == idState) {
           cities += `<option value="${item.iIdCiudad}">${item.sNombre}</option>`;
           if(firstCity) {
               dataIdCity = item.iIdCiudad;
               firstCity = false;
           }
       }
  }
  cCiudad.innerHTML = cities;
}
 
// Gets the id of the selected city.
const getCitySelected = (idCity) => {
   dataIdCity = idCity;
}
 
// initializes the var gender to male if it detects a change in the checkbox from male.
mMale.addEventListener('change', function () {
   if (this.checked) {
       fFemale.checked = false;
       kOtro.checked = false;
       gender = "Masculino";
   }
});
// initializes the var gender to male if it detects a change in the checkbox from female.
fFemale.addEventListener('change', function () {
   if (this.checked) {
       mMale.checked = false;
       kOtro.checked = false;
       gender = "Femenino";
   }
});
// initializes the var gender to male if it detects a change in the checkbox from other.
kOtro.addEventListener('change', function () {
   if (this.checked) {
       mMale.checked = false;
       fFemale.checked = false;
       gender = "Otro";
   }
});
 
getDataAccountForm.addEventListener("click", async () => {
msgError.textContent = "";
 formFlag = false;
 const formData = new FormData();
 for (var i = 0, element; element = accountSaldoForm.elements[i++];) {
     if (requiredFields(element.id, arrayFields)) {
         if (isEmptyField(element.value.replaceAll(" ", ""))) {
             document.querySelector(`#${element.id}Span`).classList.remove("d-none");
             formFlag = true;
         } else {
             document.querySelector(`#${element.id}Span`).classList.add("d-none");
         }
     }
 }
 if (formFlag) {
    msgError.textContent = "Algunos campos del formulario son obligatorios.";
     $("#modalError").modal("show");
     return false;
 }
 let splitDate = dtFechaNacimiento.value;
 let birthDay = new Date(splitDate).toISOString()
 
 formData.append("lLetyCard", lLetyCard.value.trim());
 formData.append("s_Nombre", s_Nombre.value.trim());
 formData.append("s_ApellidoPat", s_ApellidoPat.value.trim());
 formData.append("s_Apmaterno", s_Apmaterno.value.trim());
 formData.append("s_Sexo", gender);
 formData.append("s_Mail", s_Mail.value.trim());
 formData.append("s_EstadoCivil", s_EstadoCivil.value.trim());
 formData.append("s_Telefono1", s_Telefono1.value.trim());
 formData.append("s_Colonia", s_Colonia.value.trim());
 formData.append("cCiudad", cCiudad.value);
 formData.append("dtFechaNacimiento", birthDay);
 formData.append("PreferenciaProducto", PreferenciaProducto.value.trim());
 formData.append("f_Adreess", f_Adreess.value.trim());

 const response = await fetch(getDataAccountForm.getAttribute("data-action"), {
     method: "POST",
     body: formData
 });
 const updateSaldo = await response.json();
 if (updateSaldo.error === 0) { $("#modalSuccess").modal("show"); }
 else if (updateSaldo.error === 1) {
    msgError.textContent = "Ocurrió un error";
    $("#modalError").modal("show");
}
});
const requiredFields = (field, arrayFields) => {
 return arrayFields.includes(field) ? true : false
}
const isEmptyField = (field) => {
 if (field === "" || field === null || field === undefined) return true;
 return false;
}