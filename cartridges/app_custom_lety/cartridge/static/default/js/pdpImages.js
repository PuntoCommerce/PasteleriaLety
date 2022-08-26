const mainImage = document.getElementById('pdpMainImage');
const imageList = document.querySelectorAll('.pdp-image');

imageList.forEach(function (image, i) {
    if (i === 0) {
        image.classList.add('d-none');
        mainImage.src = image.src;
    }
    image.addEventListener('click', function () {
        mainImage.src = image.src;
        imageList.forEach(function (image) {
            image.classList.remove('d-none');
        });
        image.classList.add('d-none');
    });
});