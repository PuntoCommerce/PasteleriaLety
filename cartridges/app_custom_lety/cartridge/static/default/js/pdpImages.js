const mainImage = document.getElementById('pdpMainImage');
const imageList = document.querySelectorAll('.pdp-image');
const activeImage = document.querySelector('#pdpMainImage');

const skuSelectors = document.querySelectorAll('.attributes .custom-select.form-control');
skuSelectors.forEach(skuSelector => {
    skuSelector.addEventListener('change', () => {
        setTimeout(() => {
            const imageListArray = document.querySelectorAll('.product-wrapper .carousel-item.active img');
            imageListArray.forEach(image => {
                activeImage.src = image.src;
            }
            );
        }, 500);
    }
    );
}
);

imageList.forEach(function (image, i) {
    if (i === 0) {
        image.classList.add('d-none');
        mainImage.src = image.src;
    }
    image.addEventListener('click', function () {
        imageList.forEach(function (image) {
            image.classList.remove('d-none');
        });
        image.classList.add('d-none');
        mainImage.src = image.src;
    });
});

