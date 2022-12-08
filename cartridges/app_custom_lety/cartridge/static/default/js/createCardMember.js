/* tags checkbox */
const mMale = document.querySelector("#mMale");
const fFemale = document.querySelector("#fFemale");
const kOtro = document.querySelector("#kOtro");
/* inputs */
const s_ApellidoPat = document.querySelector("#s_ApellidoPat");
/* tags inputs */
const arrayFields = ["s_Nombre", "s_ApellidoPat", "s_Apmaterno", "s_Mail", "s_EstadoCivil", "f_Adreess", "s_Telefono1", "s_Colonia", "Ciudad", "Estado", "PreferenciaProducto"];
const accountSaldoForm = document.querySelector("#accountSaldoForm");
const getDataAccountForm = document.querySelector("#getDataAccountForm");
const s_Nombre = document.querySelector("#s_Nombre");
const s_Apmaterno = document.querySelector("#s_Apmaterno");
const dtFechaNacimiento = document.querySelector("#dtFechaNacimiento");
const s_Mail = document.querySelector("#s_Mail");
const s_EstadoCivil = document.querySelector("#s_EstadoCivil");
const f_Adreess = document.querySelector("#f_Adreess");
const s_Telefono1 = document.querySelector("#s_Telefono1");
const s_Colonia = document.querySelector("#s_Colonia");
const eEstado = document.querySelector("#Estado");
const PreferenciaProducto = document.querySelector("#PreferenciaProducto");
const cCiudad = document.querySelector("#cCiudad");
/* tag p */
const infoSuccess = document.querySelector("#infoSuccess");
const msgError = document.querySelector("#msgError");
/* vars */
var dateRegex = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
let gender = "";
let ciudad = "";
let idEstado = "1";
$("#modalLoading").modal('show');
window.onload = async () => {
   let lastnameSplit = [];
   const lastname = s_ApellidoPat_ApellidoPat.getAttribute("data-qlastname");
   if(!isEmptyField(lastname)) {console.log("Entro");
       if (/\s/.test(lastname)) {console.log("Entro.");
           lastnameSplit = lastname.split(" ");
           document.querySelector("#s_ApellidoPat").value = lastnameSplit[0];
           lastnameSplit.shift();
           document.querySelector("#s_Apmaterno").value = lastnameSplit.toString().replace(/,/g," ");
       } else {
           lastnameSplit[0] = lastname;
           document.querySelector("#s_ApellidoPat").innerHTML = lastname
       }
   }
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
}
 
mMale.addEventListener('change', function () {
  if (this.checked) {
      fFemale.checked = false;
      kOtro.checked = false;
      gender = "Masculino";
  }
});
fFemale.addEventListener('change', function () {
  if (this.checked) {
      mMale.checked = false;
      kOtro.checked = false;
      gender = "Femenino";
      console.log(gender);
  }
});
kOtro.addEventListener('change', function () {
  if (this.checked) {
      mMale.checked = false;
      fFemale.checked = false;
      gender = "Otro";
      console.log(gender);
  }
});
 
const populateListCities = async (idState) => {
   $("#modalLoading").modal('show');
   idEstado = idState;
   cCiudad.innerHTML = "";
   let listCities = [];
   let cities = "";
   /* populate states list */
   $("#modalLoading").modal('show');
   const response = await fetch("Account-getCities", {
       method: "POST",
       body: JSON.stringify({})
   });
   const result = await response.json();
   if(result.code === 1) {
       // lanzar alerta y bloquear botones.
   } else {}
   listCities = result.JsonDatosCiudades;
   $("#modalLoading").modal('hide');
   // validar que contenga informacion y no sea un objecto vacio.
   for (const item of listCities) {
       if(item.iIdEstado == idState) {
           cities += `<option value="${item.iIdCiudad}">${item.sNombre}</option>`;
       }
   }
   $("#modalLoading").modal('hide');
   cCiudad.innerHTML = cities;
}
 
/* get selected city */
const getCity = async (idCity) => {
   ciudad = idCity;
 
}
getDataAccountForm.addEventListener("click", async () => {
msgError.textContent = "";
infoSuccess.textContent = "";
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
let date = dtFechaNacimiento.value.trim().split("-");
let newDate = date[2]+"/"+date[1]+"/"+date[0];
 if(!isEmptyField(newDate)) {
   if(dateRegex.test(newDate)) {
   } else {
       $("#modalError").modal("show");
       msgError.textContent = "La fecha debe de coincidir con este formato dd/mm/yyyy ej: 01/05/1995.";
       return false;
   }
}
formData.append("s_Nombre", s_Nombre.value.trim());
formData.append("s_ApellidoPat", s_ApellidoPat.value.trim());
formData.append("s_Apmaterno", s_Apmaterno.value.trim());
formData.append("s_Sexo", gender);
formData.append("s_Mail", s_Mail.value.trim());
formData.append("f_Adreess", f_Adreess.value.trim());
formData.append("s_EstadoCivil", s_EstadoCivil.value.trim());
formData.append("s_Telefono1", s_Telefono1.value.trim());
formData.append("s_Colonia", s_Colonia.value.trim());
formData.append("cCiudad", ciudad);
formData.append("Estado", idEstado);
formData.append("dtFechaNacimiento", newDate);
formData.append("PreferenciaProducto", PreferenciaProducto.value.trim());
 
const response = await fetch(getDataAccountForm.getAttribute("data-action"), {
    method: "POST",
    body: formData
});
const updateSaldo = await response.json();
 
if (updateSaldo.code === 0) {
   infoSuccess.textContent = "Tus datos se guardaron con éxito.";
   $("#modalSuccess").modal("show"); }
else if (updateSaldo.code === 1) {
   msgError.textContent = "Lo sentimos, algo paso, por favor intenta más tarde.";
   $("#modalError").modal("show");
}
});
const requiredFields = (field, arrayFields) => {
return arrayFields.includes(field) ? true : false
}
const isEmptyField = (field) => {
if (field === "" || field === null || field === "null" || field === undefined) return true;
return false;
}