function commonFormBody() {
  const formData = new FormData();
  formData.append('reg_id', localStorage.getItem('_sslcz_hpm_z_r_i') || '');
  formData.append('enc_key', localStorage.getItem('_sslcz_hpm_z_e_k') || '');
  formData.append('lang', 'en');
  formData.append('gw_session_key', localStorage.getItem('_sslcz_hpm_session_key') || '');
  return formData;
}

function prepareFormFields(formId) {
  const formData = {};
  const form = document.getElementById(formId);
  if (!form) return formData;

  [...form.elements].forEach(({ name, type, value, checked }) => {
    if (!name) return;

    if (type === 'checkbox' || type === 'radio') {
      formData[name] = checked ? value : formData[name] || null;
    } else {
      formData[name] = value;
    }
  });

  return formData;
}

function getPaymentOptions(gateways, type) {
  const options = [];
  gateways.forEach(cg => {
    cg.type === type && options.push(cg);
  });
  return options;
}

function cardFormSubmit(data) {
  const container = document.createElement('div');
  container.innerHTML = data;
  const form = container.querySelector('form[name="frm1"]');
  if (form) {
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
}
