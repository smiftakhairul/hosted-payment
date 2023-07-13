function authSection(action) {
  if (action === 'login') {
    let div = `<a href="javascript:void(0)" onclick="toggleAuth('login')"><span class="text-success">Login</span></a>`;
    return div;
  } else if (action === 'logout') {
    let div = `<a href="javascript:void(0)" onclick="toggleAuth('logout')"><span class="text-danger">Logout</span></a>`;
    return div;
  }
}

function verifyOtpSubmit(e, mobile) {
  e.preventDefault();
  let formData = prepareFormFields('hpmVerifyOtpForm');
  if (mobile && formData?.otp) {
    verifyOtp(mobile, formData?.otp).then(res => {
      if (res?.data?.data?.actionStatus?.toLowerCase() === 'success') {
        $('#hpmAuthTitle').html(authSection('logout'));
        localStorage.setItem('_sslcz_hpm_phone', mobile);
        localStorage.setItem('_sslcz_hpm_token', res?.data?.data?.custSession);
        generateSession(localStorage.getItem('_sslcz_hpm_session_id'));
      }
    });
  }
}

function sendOtpSubmit(e) {
  e.preventDefault();
  let formData = prepareFormFields('hpmSendOtpForm');
  if (formData?.mobile) {
    sendOtp(formData.mobile).then(res => {
      if (res?.status?.toLowerCase() === 'success') {
        let div = `<form action="#" id="hpmVerifyOtpForm" method="post" onsubmit="verifyOtpSubmit(event, '${formData?.mobile}')">\
              <p class="mb-1">Please verify mobile number for security.</p>\
              <input type="text" name="otp" class="form-control" placeholder="Enter otp" required>\
              <button class="btn btn-info mt-2" type="submit">Submit</button>\
          </form>`;
        $('#hpmMainBody').html(div);
      }
    });
  }
}

function toggleAuth(action) {
  let res = '';
  if (action === 'login') {
    res += '<form action="#" id="hpmSendOtpForm" method="post" onsubmit="sendOtpSubmit(event)">\
          <p class="mb-1">Please verify mobile number for security.</p>\
          <input type="text" name="mobile" class="form-control" placeholder="Enter mobile number" required>\
          <button class="btn btn-info mt-2" type="submit">Verify</button>\
      </form>';
    $('#hpmMainBody').html(res);
  } else if (action === 'logout') {
    localStorage.removeItem('_sslcz_hpm_phone');
    localStorage.removeItem('_sslcz_hpm_token');
    generateSession(localStorage.getItem('_sslcz_hpm_session_id'));
  }
}