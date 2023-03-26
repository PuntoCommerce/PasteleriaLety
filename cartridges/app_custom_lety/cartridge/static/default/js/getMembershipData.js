(async () => {
  $('form.getMembership').submit(async (e) => {
    var form = $('.getMembership');
    $()
    e.preventDefault();

    const url = form[0].action
    const dataForm = new FormData()
    const data = Object.fromEntries(new FormData(e.target).entries());
    dataForm.append('membership', data.dwfrm_customerEvo_membershipId)
    var results = {}

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
        $('#form-membershipId-confirm-error').append(successMessage);
        $('#form-membershipId-confirm-error').removeClass('invalid-feedback');
      })
      .catch(err => console.log(err))
  })
})()