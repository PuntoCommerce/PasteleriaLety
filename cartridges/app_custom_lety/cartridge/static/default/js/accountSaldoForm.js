const server = require("server");

server.extend(module.superModule);

const ApiServiceLety = require("~/cartridge/scripts/jobs/api");

const accountSaldoForm = document.querySelector("#accountSaldoForm");
const getDataAccountForm = document.querySelector("#getDataAccountForm");

getDataAccountForm.addEventListener("click", e => {
    
    let formFlag = true;

    for (const element of accountSaldoForm.elements) {
        if(requiredFields(element.name, arrayFields)) {
            if(isEmptyField(element.value.replaceAll(" ", ""))) {
                document.querySelector(`#${element.name}Span`).classList.remove("d-none");
                formFlag = false;
            } else {
                document.querySelector(`#${element.name}Span`).classList.add("d-none");
            }
        }
    }

    if(formFlag) {
        //makeCallEndpoint();
    }
});

const makeCallEndpoint = () => {

    let Func_ActualizaDatosMembresia = ApiServiceLety.ApiLety(" Func_ActualizaDatosMembresia", {
        Empresa: 1,
        s_IdMembresia: letyCard,
    });

    alert(Func_ActualizaDatosMembresia);

}

const requiredFields = (field, arrayFields) => {
    
    return arrayFields.includes(field) ? true : false
}

const arrayFields = ["firstName", "lastName", "email", "address", "city", "state"];


const isEmptyField = (field) => {
   
    if(field === "" || field === null || field === undefined) return true;
    return false;

}


/*


Eliminar el null de tarjeta
revisar que de tarjeta cuando este logueado.

Home

*/