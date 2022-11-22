// ================================ Change color avaibility ================================

const sizeSelect = document.getElementById('tamano-1');
const quantitySelect = document.getElementById('quantity-1')

if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
        setTimeout(() => {
            var avaibilityMessage = document.querySelector('.list-unstyled.availability-msg li div');


            console.log(avaibilityMessage);
            avaibilityMessage.innerText === 'En existencia' ?
                $('.list-unstyled.availability-msg li div').addClass('avaibility-product') :
                $('.list-unstyled.availability-msg li div').addClass('unavailable-product');
        }, 300);
    })

    quantitySelect.addEventListener('change', () => {
        setTimeout(() => {
            var avaibilityMessage = document.querySelector('.list-unstyled.availability-msg li div');


            console.log(avaibilityMessage);
            avaibilityMessage.innerText === 'En existencia' ?
                $('.list-unstyled.availability-msg li div').addClass('avaibility-product') :
                $('.list-unstyled.availability-msg li div').addClass('unavailable-product');
        }, 300);
    })
}

// ================================ Add Product To Wishlist ================================


$('.add-to-wish-list').on('click', (e) => {
    var url = e.target.dataset.href;
    var pid = e.target.id;

    $.spinner().start();

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        data: {
            pid: pid
        }
    });

    setTimeout(() => {
        $.spinner().stop();
        $('.add-wishlist-alert').append('<div class="alert alert-success" role="alert">' + 'Se añadio a tu wishlist correctamente' + '</div>');
    }, 1500);

    setTimeout(() => {
        $('.add-wishlist-alert .alert-success').remove();
    }, 4500);
})
