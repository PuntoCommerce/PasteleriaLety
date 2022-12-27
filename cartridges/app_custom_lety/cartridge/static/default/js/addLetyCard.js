const getDataAddLetyCard = document.querySelector("#getDataAddLetyCard");
const formAddLetyCard = document.querySelector("#formAddLetyCard");
const letyCard = document.querySelector("#tletyCard");

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

formAddLetyCard.keypress(function(e) {
  if (e.which == 13) {
    return false;
  }
});