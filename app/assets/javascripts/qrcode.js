'use strict'
const QRCODE_URL = "http://localhost"

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector(".qrcode--wallet--list") && renderNewWallet();
});

function renderNewWallet() {
  let walletListElement = document.createElement("div");
  walletListElement.classList.add("qrcode--wallet--list--element");
  walletListElement.innerHTML = `${renderCryptoNamesDropdown()}${renderPublicAddressInput()}${renderRemoveWalletButton()}`;

  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];
  walletList.appendChild(walletListElement);
}

function renderCryptoNamesDropdown() {
  return `<div class='qrcode--wallet--list--element--name'>${renderCryptoNames()}</div>`;
}

function renderCryptoNames() {
  let cryptoNames = JSON.parse(document.querySelector("div[data-cryptonames]")
                                       .getAttribute('data-cryptonames'));
  const options = cryptoNames.map(cryptoName => `<option value=${cryptoName}>${cryptoName}</option>`).join('');
  return `<select>${options}</select>`;
}

function renderPublicAddressInput() {
  return "<div class='qrcode--wallet--list--element--public-address'><input type='text' placeholder='public address' name='wallet-name'></div>";
}

function renderRemoveWalletButton() {
  return "<button onClick='removeWallet(this)' class='btn--danger qrcode--wallet--list--element--button-remove' type='button'><i class='fa fa-trash'></i></button>";
}

function generateQrCode(token) {
  let qrcodeElement = document.getElementById("qrcode");
  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];

  qrcodeElement.innerHTML = "";

  new QRCode(qrcodeElement, `${QRCODE_URL}?token=${token}`);
}

function renderToken(tokenValueGenerated) {
  let qrcodeElement = document.getElementsByClassName("qrcode")[0];
  let qrcodeTokenGenerateElement = document.getElementsByClassName("qrcode--token")[0];

  if(qrcodeTokenGenerateElement) {
    qrcodeGenerateElement.removeChild(qrcodeTokenGenerateElement);
  }

  let token = document.createElement("div");
  let tokenMessage = document.createElement("div");
  let tokenRender = document.createElement("div");
  let tokenRenderValue = document.createElement("input");
  let tokenRenderCopyButton = document.createElement("div");

  token.classList.add("qrcode--token");
  tokenRender.classList.add("qrcode--token--render");
  tokenRenderValue.classList.add("qrcode--token--render--value");
  tokenRenderCopyButton.classList.add("qrcode--token--render--copy--button");

  tokenMessage.innerHTML = "Copy this token to save your qrcode.";
  token.appendChild(tokenMessage);

  tokenRenderValue.value = tokenValueGenerated;
  tokenRenderValue.readOnly = true;
  tokenRender.appendChild(tokenRenderValue);

  tokenRenderCopyButton.innerHTML = "<i class='fa fa-copy'></i>";
  tokenRenderCopyButton.onclick = function () { copyToken(); };
  tokenRender.appendChild(tokenRenderCopyButton);

  token.appendChild(tokenRender);

  qrcodeElement.appendChild(token);
}

function copyToken() {
  var copyText = document.getElementsByClassName("qrcode--token--render--value")[0];
  copyText.select();
  document.execCommand("copy");
}

function removeWallet(removeButtonElement) {
  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];
  if(walletList.childElementCount > 1) {
    walletList.removeChild(removeButtonElement.parentNode);
  }
}

function saveWallets() {
  const url = "/qrcodes";
  const url_location = "/qrcodes/new";
  const method = "POST";

  fetch(buildRequest(url, method)).then(function (response) {
    if (response.ok) {
      response.json().then(function(data) {
        generateQrCode(data.token);
        renderToken(data.token);
      }, function () {
        window.location = url_location;
      });
    } else {

    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function buildRequest(url, method) {
  return new Request(url, {
    method: method,
    body: buildRequestBody(),
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
      'Accept': 'application/json'
    })
  });
}

function buildRequestBody() {
  let walletListElements = document.getElementsByClassName("qrcode--wallet--list--element");

  let wallets = [];
  for (let i = 0; i < walletListElements.length; i++) {
    let cryptoName = walletListElements[i].firstChild.firstChild.value;
    let publicAddress = walletListElements[i].childNodes[1].firstChild.value;
    wallets[i] = { crypto_name: cryptoName, token: publicAddress };
  }

  let json = {
    qrcode: {
      wallets: wallets
    }
  };

  return JSON.stringify(json);
}
