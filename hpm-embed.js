function loadScript(callback) {
  const urls = [
    'https://code.jquery.com/jquery-3.6.0.min.js',
    './hpm-js/constant.js',
    './hpm-js/helper.js',
    './hpm-js/api.js',
    './hpm-js/login.js',
    './hpm-js/card-banking.js',
    './hpm-js/other-banking.js',
    './hpm-js/mobile-banking.js',
    './hpm-js/net-banking.js',
  ];
  const totalScripts = urls.length;
  let loadedScripts = 0;
  function scriptLoaded() {
    loadedScripts++;
    if (loadedScripts === totalScripts) {
      callback();
    }
  }

  urls.forEach(function(url) {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = scriptLoaded;
    document.head.appendChild(script);
  });
}

function generateSession(sessionId) {
  getSessionInfo(sessionId).then(async res => {
    if (res?.status?.toLowerCase() === 'success' && res?.data) {
      localStorage.setItem('_sslcz_hpm_session_key', res?.data?.session_data?.meta?.gw_sessionkey);

      let cards = [];
      let savedWallets = [];
      if (localStorage.getItem('_sslcz_hpm_token')) {
        await verifyLogin().then(res => {
          if (!res) {
            toggleAuth('logout');
          }
        })
        await getCards().then(res => {
          if (res?.data?.actionStatus?.toLowerCase() === 'success') {
            cards = res?.data?.cardNos || [];
            savedWallets = res?.data?.bKashWT || [];
          }
        })
      }
      const mobiles = getPaymentOptions(res?.data?.session_data?.gateways?.desc || [], 'mobilebanking');
      const ibs = getPaymentOptions(res?.data?.session_data?.gateways?.desc || [], 'internetbanking');
      const others = getPaymentOptions(res?.data?.session_data?.gateways?.desc || [], 'othercards');

      let paymentDiv = '<div class="card">';
      paymentDiv += `<div class="card-header d-flex justify-content-between">\
          <p class="card-title mb-0">\
            <a href="javascript:void(0)" class="text-dark text-decoration-none" onclick="generateSession('${sessionId}')">\
              <img src="https://sslcommerz.com/wp-content/uploads/2019/11/footer_logo.png" height="23px" />\
            </a>\
          </p>\
          <div id="hpmAuthTitle">\
            ${localStorage.getItem('_sslcz_hpm_token') ? authSection('logout') : authSection('login')}\
          </div>\
        </div>`;
      paymentDiv += '<div class="card-body" id="hpmMainBody">';

      let cardDiv = savedCards(cards);
      let otherCardDiv = otherBanking(others);
      let mobileDiv = mobileBanking(mobiles, savedWallets);
      let ibDiv = netBanking(ibs);
      paymentDiv += cardDiv + otherCardDiv + mobileDiv + ibDiv;

      paymentDiv += '</div>';
      paymentDiv += '</div>';

      $(hpmTarget).hide();
      $(hpmTarget).html(paymentDiv);
      $(hpmTarget).fadeIn(200);
    }
  });
}

loadScript(function() {
  $(document).ready(function() {
    $('[data-hpm-id="_sslczHpmPayBtn"]').click(async function() {
      hpmEndpoint = $(this).attr('data-hpm-endpoint');
      hpmFormData = $(this).attr('data-hpm-data');
      hpmTarget = $(this).attr('data-hpm-target');

      if (hpmFormData) {
        hpmFormData = JSON.parse(hpmFormData);
      } else {
        hpmFormData = {};
      }

      if (!localStorage.getItem('_sslcz_hpm_z_r_i') || !localStorage.getItem('_sslcz_hpm_z_e_k')) {
        await getToken().then(res => {
          if (res?.status?.toLowerCase() === 'success' && res?.data) {
            if (res?.data?.reg_id && res?.data?.enc_key) {
              localStorage.setItem('_sslcz_hpm_z_r_i', res?.data?.reg_id);
              localStorage.setItem('_sslcz_hpm_z_e_k', res?.data?.enc_key);
            }
          }
        });
      }

      initiatePayment(hpmEndpoint, hpmFormData).then(initRes => {
        if (initRes?.status?.toLowerCase() === 'success' && initRes?.data) {
          localStorage.setItem('_sslcz_hpm_session_id', initRes?.data);
          generateSession(localStorage.getItem('_sslcz_hpm_session_id'));
        }
      });
    });
  });
})
