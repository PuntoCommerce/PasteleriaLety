const mMale = document.querySelector("#mMale");
const fFemale = document.querySelector("#fFemale");
//const cCities = document.querySelector("#cCities");
var dateRegex = /^\d{2}[./-]\d{2}[./-]\d{4}$/;
let gender = "";
window.onload = function () {
   const dS_Sexo = document.querySelector("#dS_Sexo").getAttribute("data-tipo");
   if (!isEmptyField(dS_Sexo)) {
       if (dS_Sexo === "Masculino") {
           mMale.checked = true;
           fFemale.checked = false;
           gender = "Masculino";
       } else if (dS_Sexo === "Femenino") {
           mMale.checked = false;
           fFemale.checked = true;
           gender = "Femenino";
       }
   }
 
   const cCiudad = document.querySelector("#cCiudad");
   const dateBirth = document.querySelector("#dtFechaNacimiento").getAttribute("data-datebirth").split("/");
   $("#dtFechaNacimiento").val(dateBirth[2]+"-"+dateBirth[1]+"-"+dateBirth[0]);
   const ids = cCiudad.getAttribute("data-city").split("!");
 
   let idCity = "";
 
   setTimeout(() => {
       $("#cCiudad option").each(function(i) {
          
           idCity = $(this).val().split("!");
           if(Number(idCity[0]) === Number(ids[0])) {
               cCiudad.options[i].selected = true
           }
       });
   },500);
}
const arrayFields = ["LetyCard", "s_Nombre", "s_ApellidoPat", "s_Apmaterno", "s_Mail", "s_Telefono1", "s_Colonia", "Ciudad", "Estado"];
const accountSaldoForm = document.querySelector("#accountSaldoForm");
const getDataAccountForm = document.querySelector("#getDataAccountForm");
const lLetyCard = document.querySelector("#lLetyCard");
const s_Nombre = document.querySelector("#s_Nombre");
const s_ApellidoPat = document.querySelector("#s_ApellidoPat");
const s_Apmaterno = document.querySelector("#s_Apmaterno");
const s_Mail = document.querySelector("#s_Mail");
const s_Telefono1 = document.querySelector("#s_Telefono1");
const s_Colonia = document.querySelector("#s_Colonia");
const eEstado = document.querySelector("#Estado");
const dtFechaNacimiento = document.querySelector("#dtFechaNacimiento");
const PreferenciaProducto = document.querySelector("#PreferenciaProducto");
const cCiudad = document.querySelector("#cCiudad");
const msgError = document.querySelector("#msgError");
 
let ciudad = "";
mMale.addEventListener('change', function() {
  if (this.checked) {
      fFemale.checked = false;
      gender = "Masculino";console.log(gender);
    
  }
});
fFemale.addEventListener('change', function() {
  if (this.checked) {
      mMale.checked = false;
      gender = "Femenino";console.log(gender);
  }
});
 
/* get selected city */
 
const getCity = async (tagHtml) => {
 
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
 
}
getDataAccountForm.addEventListener("click", async () => {
  msgError.textContent = "";
   formFlag = false;
   const formData = new FormData(); //accountSaldoForm
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
   if(!isEmptyField(dtFechaNacimiento.value.trim())) {
 
      if(dateRegex.test(dtFechaNacimiento.value.trim())) {
      } else {
          $("#modalError").modal("show");
          msgError.textContent = "La fecha debe de coincidir con este formato dd/mm/yyyy ej: 01/05/1995.";
          return false;
      }
   }
   console.log(ciudad);
   formData.append("lLetyCard", lLetyCard.value.trim());
   formData.append("s_Nombre", s_Nombre.value.trim());
   formData.append("s_ApellidoPat", s_ApellidoPat.value.trim());
   formData.append("s_Apmaterno", s_Apmaterno.value.trim());
   formData.append("s_Sexo", gender);
   formData.append("s_Mail", s_Mail.value.trim());
   formData.append("s_Telefono1", s_Telefono1.value.trim());
   formData.append("s_Colonia", s_Colonia.value.trim());
   formData.append("cCiudad", ciudad);
   formData.append("Estado", eEstado.value.trim());
   formData.append("dtFechaNacimiento", dtFechaNacimiento.value.trim());
   formData.append("PreferenciaProducto", PreferenciaProducto.value.trim());
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
const validateDate = (value) => {
  var format = /\//;
  alert(format.test(value));
}