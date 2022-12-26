const getDataAddLetyCard = document.querySelector("#getDataAddLetyCard");
const letyCard = document.querySelector("#tletyCard");
console.log(letyCard);

getDataAddLetyCard.addEventListener("click", async() => {
    const formData = new FormData();
    formData.append("letyCard", letyCard.value.trim());
    const response = await fetch(getDataAddLetyCard.getAttribute("data-action"), {
      method: "POST",
      body: formData
    });
    const addedCart = await response.json();
    console.log(addedCart);
    if (addedCart.code === 0) { $("#modalSuccess").modal("show"); }
    else if (addedCart.code === 1) {
        msgError.textContent = addedCart.error;
       $("#modalError").modal("show");
    }
});