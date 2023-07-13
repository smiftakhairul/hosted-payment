function payNewCardSubmit(e) {
  e.preventDefault();
  let formData = prepareFormFields('hpmPayNewCardForm');
  if (formData?.number && formData?.expiry && formData?.cvv && formData?.holder) {
    paymentWithNewCard({
      number: formData?.number,
      expiry: formData?.expiry,
      cvv: formData?.cvv,
      holder: formData?.holder,
    }).then(res => {
      if (res) {
        cardFormSubmit(res);
      }
    })
  }
}

function paySavedCardSubmit(e, formId, card) {
  e.preventDefault();
  let formData = prepareFormFields(formId);
  paymentWithSavedCard({
    cardindex: card?.cardindex,
    cvv: formData?.cvv
  }).then(res => {
    if (res) {
      cardFormSubmit(res);
    }
  })
}

function toggleSavedCardForm(formId) {
  $(`#${formId}`).toggle();
}

function savedCardsSection(cards) {
  let div = '';
  if (cards.length) {
    div += '<div class="row">';
    cards.forEach((card, index) => {
      div += `<div class="col-md-6 mb-2">
            <div class="card card-body">
                <div class="mb-0" onclick='toggleSavedCardForm("hpmSavedCardSingleForm${index}")' style="cursor: pointer">
                  <p class="mb-0 text-success">${card.type}</p>
                  <p class="mb-0">${card.cardNo}</p>
                </div>

                <form class="hpmSavedCardSingleCvv mt-2" action="#" id="hpmSavedCardSingleForm${index}" method="post" onsubmit='paySavedCardSubmit(event, "hpmSavedCardSingleForm${index}", ${JSON.stringify(card)})' style="display: none;">
                  <div class="row">
                    <div class="col-md-8">
                      <input type="password" name="cvv" class="form-control" placeholder="Enter CVV/CVC" required>
                    </div>
                    <div class="col-md-4">
                      <button type="submit" class="btn btn-info">Pay</button>
                    </div>
                  </div>
                </form>

            </div>
        </div>`;
    });
    div += '</div>';
  } else {
    div += (localStorage.getItem('_sslcz_hpm_token') && !cards.length) ? '<p class="text-warning mb-0">There are no saved cards.</p>' : '';
  }
  return div;
}

function toggleCardSection(target, cards = []) {
  let div = '';

  if (target === 'newCard') {
    div += '<div id="hpmNewCardBanking">';
    div += '<form action="#" method="post" id="hpmPayNewCardForm" onsubmit="payNewCardSubmit(event)">\
          <div class="row">\
              <div class="col-md-12 mb-2">\
                  <input type="text" name="number" class="form-control" placeholder="Enter card number" required>\
              </div>\
              <div class="col-md-6 mb-2">\
                  <input type="text" name="expiry" class="form-control" placeholder="Enter card expiry" required>\
              </div>\
              <div class="col-md-6 mb-2">\
                  <input type="password" name="cvv" class="form-control" placeholder="Enter card cvv/cvc" required>\
              </div>\
              <div class="col-md-12 mb-2">\
                  <input type="text" name="holder" class="form-control" placeholder="Enter card holder name" required>\
              </div>\
              <div class="col-md-12 mb-2">\
                  <button class="btn btn-primary w-100" type="submit">Pay Now</button>\
              </div>\
          </div>\
      </form>';
    div += '</div>';
    div += `<div class="hpm_pay_new_card mb-3"><a href="javascript:void(0)" onclick='toggleCardSection("savedCard", ${JSON.stringify(cards)})'>Pay with saved card</a></div>`;
  } else if (target === 'savedCard') {
    div += savedCardsSection(cards);
    div += `<div class="hpm_pay_new_card mb-3"><a href="javascript:void(0)" onclick='toggleCardSection("newCard", ${JSON.stringify(cards)})'>Pay with new card</a></div>`;
  }

  $('#hpmCardBanking').html(div);
}

function savedCards(cards) {
  let div = '';
  div += '<p><b><u>Card Banking</u></b></p>';
  div += '<div class="row" id="hpmCardBanking">';
  div += savedCardsSection(cards);
  div += `<div class="hpm_pay_new_card mb-3"><a href="javascript:void(0)" onclick='toggleCardSection("newCard", ${JSON.stringify(cards)})'>Pay with new card</a></div>`;
  div += '</div>';
  return div;
}
