'use strict'
const QRCODE_URL = "http://localhost"

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector(".qrcode--wallet--list") && renderNewWallet();
});

function renderNewWallet() {
  let walletListElement = document.createElement("div");
  walletListElement.classList.add("qrcode--wallet--list--element");
  walletListElement.innerHTML =
    `${renderCryptoNamesDropdown()}${renderPublicAddressInput()}${renderRemoveWalletButton()}`;

  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];
  walletList.appendChild(walletListElement);
}

function renderCryptoNamesDropdown() {
  return `<div class='qrcode--wallet--list--element--name'>\
            ${renderCryptoNames()}
          </div>`;
}

function renderCryptoNames() {
  let cryptoNames = JSON.parse(document.querySelector("div[data-cryptonames]")
                                       .getAttribute('data-cryptonames'));
  const options = cryptoNames.map(cryptoName => `<option value=${cryptoName}>
                                                  ${cryptoName}
                                                 </option>`).join('');
  return `<select>${options}</select>`;
}

function renderPublicAddressInput() {
  return "<div class='qrcode--wallet--list--element--public-address'><input type='text' placeholder='public address' name='wallet-name'></div>";
}

function renderRemoveWalletButton() {
  return "<button onClick='removeWallet(this)' class='btn--danger qrcode--wallet--list--element--button-remove' type='button'>\
            <i class='fa fa-trash'></i>\
          </button>";
}

function generateQrCode() {
  let qrcodeElement = document.getElementById("qrcode");
  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];

  qrcodeElement.innerHTML = "";

  let token = "";
  for (var i = 0; i < walletList.childNodes.length; i++) {
    let publicAddress = walletList.childNodes[i].childNodes[1].firstChild.value
    if(publicAddress) {
      token += publicAddress.slice(0, 10);
    }
  }

  new QRCode(qrcodeElement, `${QRCODE_URL}?token=${token}`);
  renderToken(token);
}

function renderToken(tokenGeneratedValue) {
  let qrcodeElement = document.getElementsByClassName("qrcode")[0];
  let qrcodeTokenGenerateElement = document.getElementsByClassName("qrcode--token")[0];

  if(qrcodeTokenGenerateElement) {
    qrcodeGenerateElement.removeChild(qrcodeTokenGenerateElement);
  }

  let token = document.createElement("div");
  let tokenMessage = document.createElement("div");
  let tokenValue = document.createElement("input");

  tokenValue.classList.add("qrcode--token--value");
  token.classList.add("qrcode--token");

  token.appendChild(tokenMessage);
  token.appendChild(tokenValue);
  tokenMessage.innerHTML = "Copy this token to save your qrcode.";
  tokenValue.value = tokenGeneratedValue;
  qrcodeElement.appendChild(token);
}

function removeWallet(removeButtonElement) {
  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];
  if(walletList.childElementCount > 1) {
    walletList.removeChild(removeButtonElement.parentNode);
  }
}
