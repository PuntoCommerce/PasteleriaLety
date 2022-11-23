 
window.onload=function() {
 
    //alert('OK');
  
 }
  
  
 const arrayFields = ["LetyCard", "s_Nombre", "s_ApellidoPat", "s_Apmaterno", "s_Mail", "s_Telefono1", "s_Colonia", "Ciudad", "Estado"];
  
 const accountSaldoForm = document.querySelector("#accountSaldoForm");
 const getDataAccountForm = document.querySelector("#getDataAccountForm");
 const lLetyCard = document.querySelector("#lLetyCard");
 const s_Nombre = document.querySelector("#s_Nombre");
 const s_ApellidoPat = document.querySelector("#s_ApellidoPat");
 const s_Mail = document.querySelector("#s_Mail");
 const s_Telefono1 = document.querySelector("#s_Telefono1");
 const s_Colonia = document.querySelector("#s_Colonia");
 const Ciudad = document.querySelector("#Ciudad");
 const Estado = document.querySelector("#Estado");
 const dtFechaNacimiento = document.querySelector("#dtFechaNacimiento");
 const PreferenciaProducto = document.querySelector("#PreferenciaProducto");
 const modalSuccess = document.querySelector("#modalSuccess");
  
 getDataAccountForm.addEventListener("click", async () => {
  
    formFlag = false;
    const formData = new FormData(accountSaldoForm);
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
        $("#modalError").modal("show");
        return false;
    }
  
    formData.append("lLetyCard", lLetyCard.value.trim());
    formData.append("s_Nombre", s_Nombre.value.trim());
    formData.append("s_ApellidoPat", s_ApellidoPat.value.trim());
    formData.append("s_Apmaterno", s_Apmaterno.value.trim());
    formData.append("s_Mail", s_Mail.value.trim());
    formData.append("s_Telefono1", s_Telefono1.value.trim());
    formData.append("s_Colonia", s_Colonia.value.trim());
    formData.append("Ciudad", Ciudad.value.trim());
    formData.append("Estado", Estado.value.trim());
    formData.append("dtFechaNacimiento", dtFechaNacimiento.value.trim());
    formData.append("PreferenciaProducto", PreferenciaProducto.value.trim());
  
    const response = await fetch(getDataAccountForm.getAttribute("data-action"), {
        method: "POST",
        body: formData
    });
  
    const updateSaldo = await response.json();
  
    if (updateSaldo.error === 0) $("#modalSuccess").modal("show");
  
    else if (updateSaldo.error === 1) $("#modalError").modal("show");
  
 });
  
 const requiredFields = (field, arrayFields) => {
  
    return arrayFields.includes(field) ? true : false
 }
  
 const isEmptyField = (field) => {
  
    if (field === "" || field === null || field === undefined) return true;
    return false;
 }
  
 /* */
  
 /* */
  
 //onkeyup="validateDate(this.value)"
 const validateDate = (value) => {
    console.log(value);
 }
  
  
 
 