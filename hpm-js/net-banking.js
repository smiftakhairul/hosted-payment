function netBanking(ibs) {
  let div = '';
  if (ibs.length) {
    div += '<p><b><u>Internet Banking</u></b></p>';
    div += '<div class="row">';
  }
  ibs.forEach((item, index) => {
    div += '<div class="sslcz_hpm_col-md-3 col-md-3 sslcz_hpm_mb-2">';
    div += `<button class="btn" onclick='processGw(${JSON.stringify(item)})'>`;
    div += `<img src="${item.logo}" height="80px" alt="${item.gw}">`;
    div += '</button>';
    div += '</div>';
  });
  if (ibs.length) {
    div += '</div>';
  }
  return div;
}
