/* tags checkbox */
const mMale = document.querySelector("#mMale");
const fFemale = document.querySelector("#fFemale");
const kOtro = document.querySelector("#kOtro");
/* vars */
var dateRegex = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
let gender = "";
let ciudad = "";
 
window.onload = function () {
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
   const cCiudad = document.querySelector("#cCiudad");
   //const dateBirth = document.querySelector("#dtFechaNacimiento").getAttribute("data-datebirth").split("/");
   //$("#dtFechaNacimiento").val(dateBirth[2] + "-" + dateBirth[1] + "-" + dateBirth[0]);
   const ids = cCiudad.getAttribute("data-city").split("!");
   ciudad = ids[0];
   let idCity = "";
   setTimeout(() => {
       $("#cCiudad option").each(function (i) {
            idCity = $(this).val().split("!");
           if (Number(idCity[0]) === Number(ids[0])) {
               cCiudad.options[i].selected = true
           }
       });
   }, 500);
}
/* tags inputs */
const arrayFields = ["s_Nombre", "s_ApellidoPat", "s_Apmaterno", "s_Mail", "s_EstadoCivil", "f_Adreess", "s_Telefono1", "s_Colonia", "Ciudad", "Estado", "PreferenciaProducto"];
const accountSaldoForm = document.querySelector("#accountSaldoForm");
const getDataAccountForm = document.querySelector("#getDataAccountForm");
 
const s_Nombre = document.querySelector("#s_Nombre");
const s_ApellidoPat = document.querySelector("#s_ApellidoPat");
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
/* get selected city */
const getCity = async (tagHtml) => {
    console.log("entro...");
 //ciudad = document.querySelector('#cCiudad option:checked').value;
 let idEstado = tagHtml.split("!");
 ciudad = idEstado[0];
 
 const response = await fetch("Account-getState", {
     method: "POST",
     body: JSON.stringify({
         idEstado: Number(idEstado[1])
     })
 });
 const result = await response.json();
 let estado = result.JsonDatosEstados.find(item => item.iIdEstado === String(idEstado[1]));
 eEstado.value = estado.sNombre;
 console.log(eEstado);
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
 formData.append("Estado", eEstado.value.trim());
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