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