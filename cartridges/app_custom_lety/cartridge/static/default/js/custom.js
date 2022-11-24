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

window.addEventListener("scroll", () => {
  changeSubMenuItem();
});

window.addEventListener("load", () => {
  changeSubMenuItem();
});

if (navigator.appVersion.includes("Mac OS") || navigator.appVersion.includes("iPhone")) {
  //estilo css para mac os 
  var styles = `
  .ITBC-content .btn-ITBC {
      line-height: 2.8;
    }

  @media (max-width: 991px) {
    .ITBC-content .btn-ITBC {
      line-height: 1.5;
    }
  }`;
  var styleSheet = document.createElement("style")
  styleSheet.type = "text/css"
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

const changeSubMenuItem = () => {
  const menu = $C(".menu-group");
  const subMenu = $$C(".dropdown-menu");
  const menuHeight = 100;
  let rectMenu = menu.getBoundingClientRect();

  subMenu.forEach((sub) => {
    sub.style.top = rectMenu.y + menuHeight + "px";
  });
};

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
const backToTopBtn = $C(".goToUp");

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    backToTopBtn.classList.remove("hidden");
  } else {
    backToTopBtn.classList.add("hidden");
  }
  changeSubMenuItem();
});

window.addEventListener("load", () => {
  changeSubMenuItem();
});

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

let filter_container = document.querySelector("#filter-categories");
let button_filter = document.querySelector("#filter-button");
let checkbox = document.querySelectorAll(".values.content li button");

if (checkbox) {
  checkbox.forEach((item) => {
    item.addEventListener("click", (e) => {
  
      setTimeout(() => {
        filter_container = document.querySelector("#filter-categories");
        button_filter = document.querySelector("#filter-button");
  
        button_filter.addEventListener("click", () => {
          filter_container.classList.toggle('filtershow')
  
          if (filter_container.style.display === "none") {
            filter_container.style.display = "block";
          } else {
            filter_container.style.display = "none";
          }
        });
      }, 1000);
    });
  });
}

if (filter_container) {
  try {
    filter_container.addEventListener('click', () => {
      setTimeout(() => {
        filter_container = document.querySelector("#filter-categories");
        button_filter = document.querySelector("#filter-button");
  
        button_filter.addEventListener("click", () => {
          if (filter_container.style.display === "none") {
            filter_container.style.display = "block";
          } else {
            filter_container.style.display = "none";
          }
        });
      }, 1000);
    })
  } catch (error) {
    console.log(error)
  }
}

if (button_filter) {
  try {
    button_filter.addEventListener("click", () => {

      if (filter_container.style.display === "none") {
        filter_container.style.display = "block";
      } else {
        filter_container.style.display = "none";
      }
    });
  } catch (error) {
    console.log(error)
  }
}


/* ########################################## ⬆️ Calendar Delivery ⬆️ ####################################################*/
/* let monthNames= ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

let currentDate = new Date();
let currentDay = currentDate.getDate();
let monthNumber = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let dates = document.getElementsByClassName("dates");
let month = document.getElementsByClassName("month").textContent = monthNames[monthNumber];
let year = document.getElementsByClassName("year").textContent = currentYear.toString();

let prevMonthDOM= document.getElementsByClassName("prev-month");
let nextMonthDOM = document.getElementsByClassName("next-month");

prevMonthDOM.addEventListener('click', ()=>lastMonth());
nextMonthDOM.addEventListener('click', ()=>nextMonth());


function writeMonth(month){

}

function getTotalDays(month){

}

function isLeap(){
  return ((currentYear % 100 !==0)&& (currentYear % 4 === 0) || (currentYear % 400 === 0));
 
}

function startDay(){
  let start = new Date(currentYear, monthNumber, 1);
  return ((start.getDay()-1) === -1) ? 6 : start.getDate()-1;
}

function lastMonth(){
if(monthNumber !== 0){
  monthNumber--;

}else{
  monthNumber=11;
  currentYear--;
}
setNewDate();
}

function nextMonth(){
  if(monthNumber !== 11){
    monthNumber++;
  
  }else{
    monthNumber= 0;
    currentYear++;
  }

  setNewDate();
}

function setNewDate(){
 currentDate.setFullYear(currentYear, monthNumber,currentDay);
 month.textContent = monthNames[monthNumber];
 year.textContent = currentYear.toString();
}  */

