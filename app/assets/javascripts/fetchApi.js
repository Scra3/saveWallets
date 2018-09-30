function fetchApi(url, method, requestBody = null, callBack = null) {
  const url_location = "/qrcodes/new";

  fetch(buildRequest(url, method, requestBody, callBack)).then(function (response) {
    if (response.ok) {
      response.json().then(function(data) {
        callBack(data);
      }, function () {
        window.location = url_location;
      });
    } else {
      renderErrorMessage();
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}

function buildRequest(url, method, requestBody) {
  return new Request(url, {
    method: method,
    body: requestBody,
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
      'Accept': 'application/json'
    })
  });
}

function renderErrorMessage() {
  let qrcodeElement = document.getElementById("qrcode");
  let qrcodeElementMessage = document.getElementsByClassName("qrcode--message")[0];
  let errorMessage = document.createElement("div");

  qrcodeElement.innerHTML = "";

  errorMessage.classList.add("qrcode--message");
  errorMessage.innerHTML = "An error has been received.";
  qrcodeElement.appendChild(errorMessage);
}
