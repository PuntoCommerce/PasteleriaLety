(async () => {
  $('form.getMembership').submit(async (e) => {
    var form = $('.getMembership');
    $()
    e.preventDefault();

    const url = form[0].action
    const dataForm = new FormData()
    const data = Object.fromEntries(new FormData(e.target).entries());
    const message = document.getElementById('form-membershipId-confirm-error')
    const successMessage = document.getElementById('form-membershipId-confirm-success').getAttribute('data-message');
    const alertMessage = document.getElementById('form-membershipId-confirm-alert').getAttribute('data-message');

    var results = {}
    dataForm.append('membership', data.dwfrm_customerEvo_membershipId)

    await fetch(url, {
      method: 'POST',
      body: dataForm,
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const registrationForm = data.registrationForm.customer;
        Object.keys(registrationForm).map((key) => {
          if (registrationForm[key]
            && Object.prototype.hasOwnProperty.call(registrationForm[key], 'formType')) {
            if (registrationForm[key].formType === 'formField') {
              results[registrationForm[key].htmlName] = registrationForm[key].htmlValue;
            }
          }
        })

        Object.keys(results).forEach(function (innerKey) {
          $('input[name="' + innerKey + '"]').val(results[innerKey]);
        });
        message.innerHTML = successMessage

        $('.membership-button').attr('disabled', 'true')
        $('.closeModal').attr('disabled', 'true')

        setTimeout(() => {
          $('.getMembershipData').addClass('d-none')
        }, 1500)
      })
      .catch(err => {
        console.log(err)
        message.innerHTML = alertMessage
      })
  })
})()

function closeModalMembership() {
  const modal = document.querySelector('.getMembershipData');
  modal.classList.add('d-none')
}