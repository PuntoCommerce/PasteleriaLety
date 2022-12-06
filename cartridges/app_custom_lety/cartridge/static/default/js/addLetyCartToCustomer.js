const addLetyCartToCustomer = document.querySelector("#addLetyCartToCustomer");
const letyCard = document.querySelector("#fgletyCard");
addLetyCartToCustomer.addEventListener("click", async () => {
   const formData = new FormData();
   formData.append("lLetyCard", letyCard.value.trim());
   const response = await fetch(addLetyCartToCustomer.getAttribute("data-action"), {
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