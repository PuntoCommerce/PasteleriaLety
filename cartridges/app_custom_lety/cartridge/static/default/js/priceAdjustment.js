// Tags <p> how do you spell, What number isit
const checkoutSubTotal = document.querySelector("#checkoutSubTotal");
// Tags <input>
const checkoutSaldoLetyClcub = document.querySelector("#checkoutSaldoLetyClcub");
const checkaoutLetyPuntos = document.querySelector("#checkaoutLetyPuntos");
const msgError = document.querySelector("#msgError");
// Tags <button>
const letyPuntosAddpriceAdjustment = document.querySelector("#letyPuntosAddpriceAdjustment");
const letyPuntosRemovePriceAdjustment = document.querySelector("#letyPuntosRemovePriceAdjustment");
// Tags Divs
const hideDivCancelCange = document.querySelector("#hideDivCancelCange");
const replaceOrderSummary = document.getElementById("replaceOrderSummary");
 
window.onload = function () {
   if(hideDivCancelCange.getAttribute("data-adjustmentapplied") === "true") {
       hideDivCancelCange.classList.remove("d-none");
       letyPuntosAddpriceAdjustment.disabled = true;
       checkaoutLetyPuntos.disabled = true
   }
}
 
if(letyPuntosAddpriceAdjustment){

    letyPuntosAddpriceAdjustment.addEventListener("click", async () => {
    /* =============================================================================
        Condiciones.
        * Validar que Subtotal y total sean numericos y no estan vacios.
        * Que no sea vacio.
        * Validar que los lety puntos sean numericos y no estan vacios.
        * Validar que los el cange de lety puntos sean numericos y no estan vacios.
        * Validar que el cange de lety puntos no sea mayor al total.
        * Retornar respuesta de error si no se cumplen las condiciones.
    ============================================================================= */
    
    let letyPuntos = converToNumber(checkaoutLetyPuntos.value);
    msgError.textContent = "";
    if (isEmptyField(letyPuntos)) {
        msgError.textContent = "El canje no debe de ser vacío o contener espacios en blanco.";
        $("#modalError").modal("show");
        return false;
    }
    
    if (isNaN(letyPuntos)) {
        msgError.textContent = "El canje debe de ser numérico.";
        $("#modalError").modal("show");
        return false;
    }
    /* Validar que cange o (lety puntos) no sea mayor al saldo */
    if (letyPuntos < 0) {
        msgError.textContent = "No es posible aplicar un descuento con una cantidad negativa..";
        $("#modalError").modal("show");
        return false;
    }
    
    let saldo = converToNumber(checkoutSaldoLetyClcub.value);
    
    /* para probar esto manipular el dom y mandarlo vacio o con valor no numerico. */
    if (isEmptyField(saldo) && isNaN(saldo)) {
        msgError.textContent = "Actualmente hay un conflicto para proceder con el descuento, por favor revisa tus lety puntos.";
        $("#modalError").modal("show");
        return false;
    }
    /* Validar que cange o (lety puntos) no sea mayor al saldo */
    if (letyPuntos > saldo) {
        msgError.textContent = "Los lety puntos para el canje no puede ser mayor al saldo.";
        $("#modalError").modal("show");
        return false;
    }
    
    let total = converToNumber(checkoutSubTotal.innerHTML);// no se aceptan negativos.
    let totalAplcable = converToNumber(checkoutSubTotal.getAttribute("total-avaiable-letypuntos"));// no se aceptan negativos.
    
    /* para probar esto manipular el dom y mandarlo vacio o con valor no numerico. */
    if (isEmptyField(total) && isNaN(total)) {
        msgError.textContent = "Actualmente hay un conflicto para proceder con el descuento, por favor revisa el total de la orden.";
        $("#modalError").modal("show");
        return false;
    }
    
    /* Validar que cange o (lety puntos) no sea mayor al total de la orden */
    if (letyPuntos > totalAplcable) {
        //    msgError.textContent = "Los lety puntos para el canje no puede ser mayor al total de los productos aplicables ( $" + totalAplcable +" ).";
        msgError.textContent = "Recuerda que los lety puntos son aplicables a productos de línea";
        $("#modalError").modal("show");
        return false;
    }

    /* */
    if (total - letyPuntos < 5) {
        msgError.textContent = "El total no puede ser 0, debe contener al menos 5.";
        $("#modalError").modal("show");
        return false;
    }

    let member = document.getElementById("letyPuntocCard-form");

    $("#modalLoading").modal("show");
    const formData = new FormData();
    formData.append("toAjustment", letyPuntos);
    formData.append("member", member.value);
    
    const response = await fetch(letyPuntosAddpriceAdjustment.getAttribute("data-action"), {
        method: "POST",
        body: formData
    });
    
    const result = await response.json();
    
    if (result.code === 0) {
        letyPuntosAddpriceAdjustment.disabled = true;
        checkaoutLetyPuntos.disabled = true;
        setTimeout(() => {
            $("#modalLoading").modal("hide");
            hideDivCancelCange.classList.remove("d-none");
            replaceOrderSummary.innerHTML =  result.renderedTotas;
        }, 1000);
    } else {
        setTimeout(() => {
            msgError.textContent = result.err;
            $("#modalError").modal("show");
        });
    }
    });
}
//hide-order-discount
/* Remove the price adjustment */
if(letyPuntosRemovePriceAdjustment){

    letyPuntosRemovePriceAdjustment.addEventListener("click", async () => {
    const response = await fetch(letyPuntosRemovePriceAdjustment.getAttribute("data-action"), {
        method: "POST",
        body: {}
    });
    const result = await response.json();
    $("#modalLoading").modal("show");
    if (result.code === 0) {
        letyPuntosAddpriceAdjustment.disabled = false;
        checkaoutLetyPuntos.disabled = false
        setTimeout(() => {
            $("#modalLoading").modal("hide");
            hideDivCancelCange.classList.add("d-none");
            replaceOrderSummary.innerHTML =  result.renderedTotas;;
        }, 1000)
    } else {
        setTimeout(() => {
            msgError.textContent = result.err;
            $("#modalError").modal("show");
        });
    }
    });
}
const isEmptyField = (field) => {
   if (field === "" || field === null || field === undefined) return true;
   return false;
}
 
const isANumber = (number) => {
   if (!isNaN(number)) return true;
   return false;
}
 
const converToNumber = (string) => {
   let number = string.replace(/,/g, "");
   number = number.replace("$", "");
   number = number.trim();
   number = parseFloat(number);
   return number;
   // pendinete dividir a dos decimales.
}