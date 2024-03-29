const $C = (el) => document.querySelector(el);
const $$C = (el) => document.querySelectorAll(el);

// #####Buscador########


openSearch = () => {
  const searchContainer = document.getElementById("searchContainer");

  if (searchContainer.style.display == "none") {
    searchContainer.style.display = "block";
  } else {
    searchContainer.style.display = "block"
  }
}

closeSearch = () => {
  const searchContainer = document.getElementById("searchContainer");

  if (searchContainer.style.display == "block") {
    searchContainer.style.display = "none";
  } else {
    searchContainer.style.display = "none"
  }
}

// #####Buscador########

//Minicart
closeMinicart = () => {
  const minicartContainer = document.getElementById("minicartPopover");
  const miniCart = document.querySelectorAll('.popover.popover-bottom')

  miniCart.forEach((item) => {
    if (item.classList.contains('show')) {
      item.classList.remove('show')
    }
  })
}
//Minicart

//Filters

filterIcon = () => {

}
//Filters

// window.addEventListener("scroll", () => {
//   changeSubMenuItem();
// });

// window.addEventListener("load", () => {
//   changeSubMenuItem();
// });

// const changeSubMenuItem = () => {
//   const menu = $C(".menu-group");
//   const subMenu = $$C(".dropdown-menu");
//   const menuHeight = 100;
//   let rectMenu = menu.getBoundingClientRect();

//   subMenu.forEach((sub) => {
//     sub.style.top = rectMenu.y + menuHeight + "px";
//   });
// };



const toggleSubCategories = $$C(".toggle-subcategories");

toggleSubCategories.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    const idAttribute = toggle.getAttribute("item-target");
    const subCategory = $C(`#submenu-${idAttribute}`);
    if (subCategory) {
      subCategory.classList.toggle("hidden");
    }
  });
});

const customMenuResponsive = $C("#customMenuResponsive");
const page = $C(".page");

const openCustomMenu = () => {
  customMenuResponsive.classList.remove("closeMenu");
  customMenuResponsive.classList.remove("hidden");
  customMenuResponsive.classList.add("viewMenu");
  page.classList.add("filter-blur");
  console.log("f")
};

const closeCustomMenu = () => {
  customMenuResponsive.classList.add("closeMenu");
  setTimeout(() => {
    customMenuResponsive.classList.add("hidden");
  }, 180);
  customMenuResponsive.classList.remove("viewMenu");
  page.classList.remove("filter-blur");
};

const toggleSubMenu = (category, back = false) => {
  $C(`#submenu-${category}`).classList.toggle("viewMenu");
  $C(`#submenu-${category}`).classList.toggle("viewMenuOut");
  if (back) {
    setTimeout(() => {
      $C(`#submenu-${category}`).classList.toggle("hidden");
    }, 180);
  } else {
    $C(`#submenu-${category}`).classList.toggle("hidden");
  }
};

/* ########################################## ⬆️ Btn Back to top & Sticky Nav Bar⬆️ ####################################################### */
// Listen on scroll event to show/hide btn back to top & add sticky nav
// const backToTopBtn = $C(".goToUp");

// window.addEventListener("scroll", () => {
//   if (window.scrollY > 700) {
//     backToTopBtn.classList.remove("hidden");
//   } else {
//     backToTopBtn.classList.add("hidden");
//   }
//   changeSubMenuItem();
// });

// window.addEventListener("load", () => {
//   changeSubMenuItem();
// });

/* ########################################## Sticky Nav Bar ####################################################### */
// Listen on scroll event to show/hide btn back to top
const navBar = document.querySelectorAll(".experience-headerbanner")[0]
  ? document.querySelectorAll(".experience-headerbanner")[0]
  : false;
const header = document.querySelector("header")
  ? document.querySelector("header")
  : false;

setTimeout(function () {
  const navBarOffSet = navBar.offsetTop;
  const navBarHeight = navBar.offsetHeight;
  header.style.minHeight = navBarHeight + "px";

  window.addEventListener("scroll", () => {
    if (window.scrollY > navBarOffSet) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  });
}, 100);

/* ########################################## ⬆️ Show Filter Categories ⬆️ ####################################################### */

// let filter_container = document.querySelector("#filter-categories");
// let button_filter = document.querySelector("#filter-button");
// let checkbox = document.querySelectorAll(".values.content li button");
// let openIcon = document.getElementById("openFilters");
// let closeIcon = document.getElementById("closeFilters");


// if (checkbox) {
//   checkbox.forEach((item) => {
//     item.addEventListener("click", (e) => {
  
//       setTimeout(() => {
//         filter_container = document.querySelector("#filter-categories");
//         button_filter = document.querySelector("#filter-button");
  
//         button_filter.addEventListener("click", () => {
//           filter_container.classList.toggle('filtershow')
  
//           if (filter_container.style.display === "none") {
//             filter_container.style.display = "block";
//             closeIcon.style.visibility = "visible";
//             openIcon.style.display = "none";
//           } else {
//             filter_container.style.display = "none";
//             openIcon.style.display = "initial";
//             closeIcon.style.visibility = "hidden";
//           }
//         });
//       }, 1000);
//     });
//   });
// }

function showFilterMenu() {
  filter_container = document.querySelector("#filter-categories");
  filter_container.classList.toggle('filtershow')
  const openIcon = document.getElementById("openFilters");
  const closeIcon = document.getElementById("closeFilters");

  const body = document.body;
  const html = document.documentElement;

  if (filter_container.style.display === "none") {
    filter_container.style.display = "block";
    closeIcon.style.visibility = "visible";
    openIcon.style.display = "none";
    body.classList.add('removeScroll')
    html.classList.add('removeScroll')
  } else {
    filter_container.style.display = "none";
    openIcon.style.display = "initial";
    closeIcon.style.visibility = "hidden";
    body.classList.remove('removeScroll')
    html.classList.remove('removeScroll')
  }
}

const copyLink = () => {
  var currentUrl = window.location.href;
  
  // Crea un elemento temporal para realizar la copia al portapapeles
  var tempInput = document.createElement("input");
  tempInput.value = currentUrl;
  document.body.appendChild(tempInput);
  
  // Selecciona el contenido del elemento temporal
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // Para dispositivos móviles
  
  // Copia el contenido al portapapeles
  document.execCommand("copy");
  
  // Remueve el elemento temporal
  document.body.removeChild(tempInput);  
}

if (navigator.appVersion.includes("Mac OS") || navigator.appVersion.includes("iPhone")) {
  //estilo css para mac os 
  var styles = `
  .ITBC-content .btn-ITBC {
      line-height: 2.8;
    }

  footer li a{
    display: block;
    width: 100%;
    height: 100%;
  }

  .checkout__stepper--item-circle{
    padding-top: 20px;
  }

  .check-icon{
    padding-bottom: 18px;
  }

  .div-a-minicart .normal, .card-make-default-link .normal,.div-mobile-back-profile .normal{
    position: absolute;
    bottom: 0;
  }

  #cleanStoreMobile {
    top: -0.6em;
}

  @media (max-width: 991px) {
    .ITBC-content .btn-ITBC {
      line-height: 1.5;
    }

    .text2:hover {
      color: #ffffff;
    }
    
  }`;
  var styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

let password = document.getElementById('login-form-password');
let viewPassword = document.getElementById('viewPassword');
let click = false;

if(viewPassword) {

  viewPassword.addEventListener('click', (e)=>{
    if(!click){
      password.type = 'text'
      click = true
    }else if(click){
      password.type = 'password'
      click = false
    }
  });
}

window.onload=function(){
  var pos=window.name || 0;
  window.scrollTo(0,pos);
  }
  window.onunload=function(){
  window.name=self.pageYOffset || (document.documentElement.scrollTop+document.body.scrollTop);
  }
  

// Seleccionamos el botón con id 'btn-compartir' 
//const shareButton = document.getElementById("btn-compartir");
 
// Creamos una función que se ejecutará cuando el usuario haga click en el botón
//shareButton.addEventListener("click", (event) => {
 
  // Verificamos si el navegador tiene soporte para el API compartir
  //if ("share" in navigator) {
    //navigator
      //.share({
        // Defino un título para la ventana de compartir
        //title: "Comparte Esta Página en Tu Plataforma Favorita",
 
        // Detecto la URL actual de la página 
        //url:
           // window.location.href
      //})
 
      // Mensaje en Consola cuando se presiona el botón de compartir 
      //.then(() => {
       // console.log("Contenido Compartido !");
      //})
      //.catch(console.error);
  //} else {
    // Si el navegador no tiene soporte para la API compartir, le enviamos un mensaje al usuario
    //alert('Lo siento, este navegador no tiene soporte para recursos compartidos.')
  //}
//});

function hideBlockSession() {
  const blockSession = document.querySelector(".blockSession");

  blockSession.style.display = 'none';
}

function hideBlockSessionMob() {
  const blockSessionMob = document.querySelector(".blockSessionMob");

  blockSessionMob.style.display = 'none';
}


