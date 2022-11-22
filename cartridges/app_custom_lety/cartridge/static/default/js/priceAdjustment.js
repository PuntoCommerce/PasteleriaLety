console.log("working...");
 
const letyPuntosriceAdjustment = document.querySelector("#letyPuntosriceAdjustment");
 
letyPuntosriceAdjustment.addEventListener("click", async() => {
 
   const formData = new FormData();
 
   formData.append("toAjustment", "100");
   formData.append("member", "23456"); // tomar de la vista.
 
   const response = await fetch(letyPuntosriceAdjustment.getAttribute("data-action"), {
       method: "POST",
       body: formData
   });
 
   const json = await response.json();
 
   console.log(json);
 
});