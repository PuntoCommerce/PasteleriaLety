/* Buy Now Button */

const checkoutUrl = document.querySelector('#buy-now-url').value;
const buyNowBtn = document.querySelectorAll('#buy-now-btn');

buyNowBtn.forEach(e => e.addEventListener('click', function () {
    setTimeout(() => {
        location.href = checkoutUrl
    }, 4000);
}))