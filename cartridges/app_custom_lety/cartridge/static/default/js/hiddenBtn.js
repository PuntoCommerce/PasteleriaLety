const showChar = 38;
const ellipsestext = "...";

window.onload = () => {
  const descriptions = document.querySelectorAll(".truncate p");
  descriptions.forEach((el) => {
    let content = el.textContent;
    if (content.length >= showChar) {
      let formattedText = content.substr(0, showChar);
      let originalText = content;
      var newHtml =
        '<div class="truncate-text">' +
        formattedText +
        '<span class="moreellipses">' +
        ellipsestext + 
        '&nbsp;&nbsp;<a href="" class="moreless more">más</a></span></span></div><div class="truncate-text d-none">' +
        originalText + " " +
        '<a href="" class="moreless less">menos</a></span></div>';
      el.insertAdjacentHTML("afterend", newHtml);
    }
  });
  setTimeout(() => {
    const descritptionBtn = document.querySelectorAll(".moreless.more");
    descritptionBtn.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        var descriptionFormattedText = el.parentNode.parentNode;
        var descriptionOriginalText =
          descriptionFormattedText.nextElementSibling;
          console.log(descriptionFormattedText,descriptionOriginalText)
        descriptionOriginalText.classList.remove("d-none");
        descriptionFormattedText.classList.remove("d-block");
        descriptionFormattedText.classList.add("d-none");
      });
    });
  }, 500);

  setTimeout(() => {
    const descritptionBtn = document.querySelectorAll(".moreless.less");
    descritptionBtn.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        var descriptionFormattedText = el.parentNode;
        var descriptionOriginalText = descriptionFormattedText.previousSibling;
        descriptionFormattedText.classList.add("d-none");
        descriptionOriginalText.classList.remove("d-none");
        descriptionOriginalText.classList.add("d-block");
        console.log(descriptionFormattedText,descriptionOriginalText)
      });
    });
  }, 500);

};
