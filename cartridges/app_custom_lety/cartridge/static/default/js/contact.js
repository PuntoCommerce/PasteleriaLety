function contactUs(e) {
  var url = e.dataset.href;
  var emailId = $('input[name=contact_email]').val();
  var firstName = $('input[name=contact_firstName]').val();
  var lastName = $('input[name=contact_lastName]').val();
  var comments = $('textarea[name=contact_comments]').val();
  var tema = $('select[name=contact_tema]').val();
  var temaChild = $('select[name=contact_tema_child]').val();
  const urlRedirect = document.getElementById('contact-link').dataset.href;

  emailId === '' ? $('input[name=contact_email]').addClass('input-required') : $('input[name=contact_email]').removeClass('input-required');
  firstName === '' ? $('input[name=contact_firstName]').addClass('input-required') : $('input[name=contact_firstName]').removeClass('input-required');
  lastName === '' ? $('input[name=contact_lastName]').addClass('input-required') : $('input[name=contact_lastName]').removeClass('input-required');
  comments === '' ? $('textarea[name=contact_comments]').addClass('input-required') : $('textarea[name=contact_comments]').removeClass('input-required');
  tema === null ? $('select[name=contact_tema]').addClass('input-required') : $('select[name=contact_tema]').removeClass('input-required');
  temaChild === null ? $('select[name=contact_tema_child]').addClass('input-required') : $('select[name=contact_tema_child]').removeClass('input-required');

  if (emailId != '' && firstName != '' && lastName != '' && comments != '' &&
    tema != null && temaChild != null) {
    $.ajax({
      method: 'post',
      dataType: 'json',
      url: url,
      data: {
        emailId,
        firstName,
        lastName,
        comments,
        tema,
        temaChild
      }
    })

    alertContact(urlRedirect)
  }
}

function alertContact(urlRedirect) {
  $('.send-contact-alert').append(`
    <div class='send-contact-alert__success'>
      <span send-contact-alert__success__message>Tu comentario se ah enviado correctamente</span>
      <a href='${urlRedirect}' class='send-contact-alert__success__link'>Regresar a mi cuenta</a>
    <div>
  `).removeClass('d-none')
}

const temas = ['Quejas', 'Sugerencias', 'Felicitación']
const quejas = ['Cabello en producto', 'Mal decorado', 'Objetos varios', 'Error en relleno o pan', 'Entregas tarde',
  'Pan seco', 'Pan duro', 'Fruta fermentada'];
const sugerencias = ['Instalaciones', 'Servicio', 'Empaque', 'Nueva sucursal', 'Nuevo producto', 'Promociones'];
const felicitación = ['Agregar felicitación '];

const temaSelect = document.getElementById('contact_tema');
const temaChildSelect = document.getElementById('contact_tema_child');

function Records(select, values) {
  if (temaChildSelect) {
    temaChildSelect.innerHTML = '';
    for (let index of values) {

      select.innerHTML += `
      <option>${index}</option>
    `
    }
  }
}

function addValueSelect() {
  Records(temaSelect, temas);
}

if (temaSelect) {
  temaSelect.addEventListener('change', (e) => {
    let data = e.target.value;

    switch (data) {
      case 'Quejas':
        Records(temaChildSelect, quejas)
        break;
      case 'Sugerencias':
        Records(temaChildSelect, sugerencias)
        break;
      case 'Felicitación':
        Records(temaChildSelect, felicitación)
        break;
    }
  })
}

addValueSelect();