function otherBanking(others) {
  let div = '';
  if (others.length) {
    div += '<p><b><u>Other Card Banking</u></b></p>';
    div += '<div class="row">';
  }
  others.forEach((item, index) => {
    div += '<div class="sslcz_hpm_col-md-3 col-md-3 sslcz_hpm_mb-2 mb-2">';
    div += `<button class="btn" onclick='processGw(${JSON.stringify(item)})'>`;
    div += `<img src="${item.logo}" height="80px" alt="${item.gw}">`;
    div += '</button>';
    div += '</div>';
  });
  if (others.length) {
    div += '</div>';
  }
  return div;
}
