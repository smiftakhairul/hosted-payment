function verifyGpOtpSubmit(e, mobile) {
  e.preventDefault();
  let formData = prepareFormFields('hpmVerifyGpOtpForm');
  if (mobile && formData?.otp) {
    verifyGpOtp(mobile, formData?.otp).then(res => {
      if (res?.data?.data?.returnURL) {
        window.location.href = res?.data?.data?.returnURL;
      }
    });
  }
}

function sendGpOtpSubmit(e) {
  e.preventDefault();
  let formData = prepareFormFields('hpmSendGpOtpForm');
  if (formData?.mobile) {
    sendGpOtp(formData.mobile).then(res => {
      if (res?.status?.toLowerCase() === 'success') {
        let div = `<form action="#" id="hpmVerifyGpOtpForm" method="post" onsubmit="verifyGpOtpSubmit(event, '${formData?.mobile}')">\
              <p class="mb-1">Please verify mobile number for security.</p>\
              <input type="text" name="otp" class="form-control" placeholder="Enter otp" required>\
              <button class="btn btn-info mt-2 mb-3" type="submit">Submit</button>\
          </form>`;
        $('#hpmMobileBanking').html(div);
      }
    });
  }
}

function processGw(item) {
  let res = '';
  if (item.gw.toLowerCase() === 'gpdob') {
    res += '<form action="#" id="hpmSendGpOtpForm" method="post" onsubmit="sendGpOtpSubmit(event)">\
          <p class="mb-1">Please verify mobile number for security.</p>\
          <input type="text" name="mobile" class="form-control" placeholder="Enter mobile number" required>\
          <button class="btn btn-info mt-2 mb-3" type="submit">Verify</button>\
      </form>';
    $('#hpmMobileBanking').html(res);
  } else {
    window.location.href = item.redirectGatewayURL;
  }
  return res;
}

function initSavedWalletSubmit(wallet) {
  initWallet(wallet?.index, wallet?.type?.toLowerCase()).then(res => {
    if (res?.data?.data?.redirectURL) {
      window.location.href = res?.data?.data?.redirectURL;
    }
  });
}

function savedWalletSection(wallets) {
  let div = '';
  if (wallets.length) {
    div += '<div class="row">';
    wallets.forEach((wallet, index) => {
      div += `<div class="col-md-6 mb-2">
            <div class="card card-body">
                <div class="mb-0" onclick='initSavedWalletSubmit(${JSON.stringify(wallet)})' style="cursor: pointer">
                  <p class="mb-0 text-success">${wallet.type}</p>
                  <p class="mb-0">${wallet.wallet}</p>
                </div>
            </div>
        </div>`;
    });
    div += '</div>';
  }
  return div;
}

function mobileBanking(mobiles, wallets) {
  let div = '';
  if (mobiles.length) {
    div += '<p><b><u>Mobile Banking</u></b></p>';
    div += '<div class="row" id="hpmMobileBanking">';
  }
  div += savedWalletSection(wallets);
  mobiles.forEach((item, index) => {
    div += '<div class="sslcz_hpm_col-md-3 col-md-3 sslcz_hpm_mb-2">';
    div += `<button class="btn" onclick='processGw(${JSON.stringify(item)})'>`;
    div += `<img src="${item.logo}" height="80px" alt="${item.gw}">`;
    div += '</button>';
    div += '</div>';
  });
  if (mobiles.length) {
    div += '</div>';
  }
  return div;
}
