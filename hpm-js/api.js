async function getToken() {
  let apiData = null;

  let deviceInfo = {
    osType: 'N/A',
    deviceId: 'HPM',
    deviceImei: 'N/A',
    Model: 'N/A',
    deviceManufa: 'N/A',
    browser: 'N/A',
    timezone: 'N/A',
    screenWidth: 'N/A',
    screenHeight: 'N/A',
    colorDepth: 'N/A',
    acceptHeaders: 'N/A',
    windowSize: 'N/A',
    browserLang: 'en-US',
    ipAddress: 'N/A',
  };

  const formData = Object.entries(deviceInfo).reduce((form, [key, value]) => {
    form.append(key, value);
    return form;
  }, new FormData());

  await fetch(`${apiCommBaseUrl}/api.php/get_token`, {
    method: 'POST',
    body: formData,
  })
  .then(res => {
    return res.json();
  })
  .then(data => {
    apiData = data;
  })

  return apiData;
}

async function initiatePayment(endpoint, formData = {}) {
  let apiData = null;

  await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function getSessionInfo(sessionId) {
  let apiData = null;

  await fetch(`${apiCommBaseUrl}/api.php/session_info/${sessionId}`)
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function sendGpOtp(phone) {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('token', '');
  formData.append('mobileNo', phone);

  await fetch(`${apiCommBaseUrl}/api.php/gp/init-transaction`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function verifyGpOtp(phone, otp) {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('token', '');
  formData.append('mobileNo', phone);
  formData.append('pin', otp);

  await fetch(`${apiCommBaseUrl}/api.php/gp/verify-transaction`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function paymentWithNewCard(card) {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('session_key', localStorage.getItem('_sslcz_hpm_session_id') || '');
  formData.append('card_no', card.number);
  formData.append('expiry', card.expiry);
  formData.append('name', card.holder);
  formData.append('save', card?.save ? '1' : '0');
  formData.append('card_cvv', card.cvv);
  formData.append('is_emi', card?.emi ? '1' : '0');
  formData.append('emi_tenure', card?.emi?.tenure || null);
  formData.append('emi_bank_id', card?.emi?.emi_bank_id || null);
  formData.append('offer_id', '');
  formData.append('is_offer', '0');

  await fetch(`${apiCommBaseUrl}/api.php/transact`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.text();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function paymentWithSavedCard(card) {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('token', localStorage.getItem('_sslcz_hpm_token') || '');
  formData.append('session_key', localStorage.getItem('_sslcz_hpm_session_id') || '');
  formData.append('cardindex', card?.cardindex);
  formData.append('card_cvv', card?.cvv);
  formData.append('is_emi', card?.emi ? '1' : '0');
  formData.append('emi_tenure', card?.emi?.tenure || null);
  formData.append('emi_bank_id', card?.emi?.emi_bank_id || null);
  formData.append('offer_id', '');
  formData.append('is_offer', '0');

  await fetch(`${apiCommBaseUrl}/api.php/payment/card_index`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.text();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function sendOtp(phone) {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('token', '');
  formData.append('phone', phone);

  await fetch(`${apiCommBaseUrl}/api.php/send_checkout_otp`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function verifyOtp(phone, otp) {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('token', '');
  formData.append('number', phone);
  formData.append('otp', otp);

  await fetch(`${apiCommBaseUrl}/api.php/verify_checkout_otp`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function getCards() {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('token', localStorage.getItem('_sslcz_hpm_token'));

  await fetch(`${apiCommBaseUrl}/api.php/mycards`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function verifyLogin() {
  let apiData = null;
  if (!localStorage.getItem('_sslcz_hpm_token')) {
    return null;
  }

  const formData = commonFormBody();
  formData.append('cus_session', localStorage.getItem('_sslcz_hpm_token'));

  await fetch(`${apiCommBaseUrl}/api.php/login_status`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}

async function initWallet(walletIndex, walletType = 'bkash') {
  let apiData = null;
  const formData = commonFormBody();
  formData.append('token', localStorage.getItem('_sslcz_hpm_token') || '');
  formData.append('session_id', localStorage.getItem('_sslcz_hpm_session_id'));
  formData.append('wallet_index', walletIndex);
  formData.append('is_save', '1');
  formData.append('walletType', walletType.toLowerCase());

  await fetch(`${apiCommBaseUrl}/api.php/bkash/init-transaction`, {
      method: 'POST',
      body: formData,
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      apiData = data;
    })

  return apiData;
}
