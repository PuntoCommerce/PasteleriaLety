// Tags <p> how do you spell, What number isit
const checkoutSubTotal = document.querySelector("#checkoutSubTotal");
const checkoutGranTotal = document.querySelector("#checkoutGranTotal");
// Tags <input>
const checkoutSaldoLetyClcub = document.querySelector("#checkoutSaldoLetyClcub");
const checkaoutLetyPuntos = document.querySelector("#checkaoutLetyPuntos");
const msgError = document.querySelector("#msgError");
// Tags <button>
const letyPuntosAddpriceAdjustment = document.querySelector("#letyPuntosAddpriceAdjustment");
const letyPuntosRemovePriceAdjustment = document.querySelector("#letyPuntosRemovePriceAdjustment");
// Tags Divs
const hideDivCancelCange = document.querySelector("#hideDivCancelCange");
const orderDiscount = document.querySelector("#orderDiscount");
const replaceOrderSummary = document.getElementById("replaceOrderSummary");
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
    console.log(letyPuntosAddpriceAdjustment.getAttribute("data-action"));
    msgError.textContent = "";
    if (isEmptyField(checkaoutLetyPuntos.value.trim())) {
        console.log(1);
        msgError.textContent = "El canje no debe de ser vacío o contener espacios en blanco.";
        $("#modalError").modal("show");
        return false;
    }
    let letyPuntos = converToNumber(checkaoutLetyPuntos.value);
    if (isNaN(letyPuntos)) {
        console.log(2);
        msgError.textContent = "El canje debe de ser numérico.";
        $("#modalError").modal("show");
        return false;
    }
    let saldo = converToNumber(checkoutSaldoLetyClcub.value);
    /* para probar esto manipular el dom y mandarlo vacio o con valor no numerico. */
    if (isEmptyField(saldo) && isNaN(saldo)) {
        console.log(3);
        msgError.textContent = "Actualmente hay un conflicto para proceder con el descuento, por favor revisa tus lety puntos.";
        $("#modalError").modal("show");
        return false;
    }
    /* Validar que cange o (lety puntos) no sea mayor al saldo */
    if (letyPuntos > saldo) {
        console.log(4);
        msgError.textContent = "Los lety puntos para el canje no puede ser mayor al saldo.";
        $("#modalError").modal("show");
        return false;
    }
    let total = converToNumber(checkoutGranTotal.innerHTML);

    /* para probar esto manipular el dom y mandarlo vacio o con valor no numerico. */
    if (isEmptyField(total) && isNaN(total)) {
        console.log(5);
        msgError.textContent = "Actualmente hay un conflicto para proceder con el descuento, por favor revisa el total de la orden.";
        $("#modalError").modal("show");
        return false;
    }

    /* Validar que cange o (lety puntos) no sea mayor al total de la orden */
    if (letyPuntos > total) {
        console.log(6);
        msgError.textContent = "Los lety puntos para el canje no puede ser mayor al total de la orden.";
        $("#modalError").modal("show");
        return false;
    }
    $("#modalLoading").modal("show");
    const formData = new FormData();
    formData.append("toAjustment", letyPuntos);

    const response = await fetch(letyPuntosAddpriceAdjustment.getAttribute("data-action"), {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    let string = result.renderedTotas;
    try {
        replaceOrderSummary.innerHTML = string;
    } catch (error) {
        console.log(error);
    }

    if (result.code === 0) {
        letyPuntosAddpriceAdjustment.disabled = true;
        checkaoutLetyPuntos.disabled = true;


        setTimeout(() => {
            $("#modalLoading").modal("hide");
            hideDivCancelCange.classList.remove("d-none");

            /*$.ajax({
           url:letyPuntosAddpriceAdjustment.getAttribute("data-action"),
           method: 'POST',
           dataType: 'json',
           success: function (response) {
               console.log(response);
               console.log("Entro");
               orderDiscount.classList.remove("hide-order-discount");
           },
           error: function (err) {
               console.log(err);
               console.log("Salio");
           }
       });*/

        }, 1000);
    } else {
        console.log("Entro al else...");
        $("#modalError").modal("show");
    }
});
//hide-order-discount
/* Remove the price adjustment */
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
        }, 1000)
    } else {
        $("#modalError").modal("show");
    }
});
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