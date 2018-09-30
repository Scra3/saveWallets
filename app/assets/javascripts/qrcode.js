'use strict'
const QRCODE_URL = "http://localhost"

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector(".qrcode--wallet--list") && renderNewWallet();
});

function renderNewWallet(selectedName = '', publicAddress = '') {
  let walletListElement = document.createElement("div");
  walletListElement.classList.add("qrcode--wallet--list--element");

  walletListElement.appendChild(renderCryptoNamesDropdown(selectedName));
  walletListElement.appendChild(renderPublicAddressInput(publicAddress));
  walletListElement.appendChild(renderRemoveWalletButton());

  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];
  walletList.appendChild(walletListElement);
}

function renderCryptoNamesDropdown(selectedName) {
  let cryptoNames = document.createElement("div");
  cryptoNames.classList.add("qrcode--wallet--list--element--name");
  cryptoNames.innerHTML = renderCryptoNames(selectedName);
  return cryptoNames;
}

function renderCryptoNames(selectedName) {
  let cryptoNames = JSON.parse(document.querySelector("div[data-cryptonames]")
                                       .getAttribute('data-cryptonames'));
  const options = cryptoNames.map(cryptoName => {
    if(selectedName == cryptoName) {
      return `<option selected value=${cryptoName}>${cryptoName}</option>`
    } else {
      return `<option value=${cryptoName}>${cryptoName}</option>`
    }
  }).join('');
  return `<select>${options}</select>`;
}

function renderPublicAddressInput(publicAddress) {
  let addressInput = document.createElement("div");
  addressInput.classList.add("qrcode--wallet--list--element--public-address");
  addressInput.innerHTML = `<input type='text' value='${publicAddress}' placeholder='public address' name='wallet-name'>`;
  return addressInput;
}

function renderRemoveWalletButton() {
  let removeButton = document.createElement("button");
  removeButton.onclick = function () { removeWallet(this); };
  removeButton.classList.add("btn--danger");
  removeButton.classList.add("qrcode--wallet--list--element--button-remove");
  removeButton.innerHTML = "<i class='fa fa-trash'></i>";
  return removeButton;
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
  let copyText = document.getElementsByClassName("qrcode--token--render--value")[0];
  copyText.select();
  document.execCommand("copy");
}

function removeWallet(removeButtonElement) {
  let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];
  if(walletList.childElementCount > 1) {
    walletList.removeChild(removeButtonElement.parentNode);
  }
}

function loadWallets() {
  let token = document.getElementsByClassName("qrcode--load--token")[0];
  fetchApi(`/qrcodes/${token.value}`, "GET", null, function(data) {
    let walletList = document.getElementsByClassName("qrcode--wallet--list")[0];
    walletList.innerHTML = "";

    data.wallets.forEach(wallet => renderNewWallet(wallet.crypto_name, wallet.token));
  });
}

function saveWallets() {
  fetchApi("/qrcodes", "POST", buildJsonWallets(), function(data) {
    generateQrCode(data.token);
    renderToken(data.token);
  });
}

function buildJsonWallets() {
  let walletListElements = document.getElementsByClassName("qrcode--wallet--list--element");

  let wallets = walletListElements.map(wallet => {
    let cryptoName = wallet.firstChild.firstChild.value;
    let publicAddress = wallet.childNodes[1].firstChild.value;
    return { crypto_name: cryptoName, token: publicAddress };
  });

  let json = { qrcode: { wallets: wallets } };
  return JSON.stringify(json);
}
