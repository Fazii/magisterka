const baseUrl = "http://127.0.0.1:8000/";
let currentVal;
let currentLayout;

function get() {
    let responseText = document.getElementById('response');
    let req = new XMLHttpRequest();
    let value = document.getElementById("valueID1").value;
    if (value === "") {
        value = 123;
    }

    req.open("GET", baseUrl + "address/" + value + "?words=1", true);
    req.responseType = "arraybuffer";

    req.onload = function () {
        let array = new Uint8Array(req.response);
        let responseVal = parseInt(toHexString(array), 16);
        responseText.innerHTML = responseVal;
        currentVal = responseVal;
    };
    req.send();
}

function getValueOnAddress(address) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", baseUrl + "address/" + address + "?words=1", true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                let array = new Uint8Array(xhr.response);
                let responseVal = parseInt(toHexString(array), 16);
                resolve(responseVal);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function getLayout() {
    console.log("calling layout get");
    let req = new XMLHttpRequest();
    req.open("GET", baseUrl + "layout", false);

    req.onload = function () {
        currentLayout = req.responseText;
    };
    req.send();
    return req.responseText;
}

function putLayout(data) {
    console.log("calling putLayout");
    let req = new XMLHttpRequest();
    req.open("PUT", baseUrl + "/layout", false);
    req.setRequestHeader("Content-Type", "application/json");

    req.send(data);
}

function getLayoutState() {
    console.log("calling layout get");
    let req = new XMLHttpRequest();
    req.open("GET", baseUrl + "layout_state", true);

    req.onload = function () {
        var currentLayoutState = req.responseText;
        console.log("current state:");
        console.log(currentLayoutState);
        document.getElementsByClassName('grid')[0].insertAdjacentHTML('beforeend', req.responseText);
    };
    req.send();
}

function putLayoutState(data) {
    console.log("calling putLayoutState");
    let req = new XMLHttpRequest();
    req.open("PUT", baseUrl + "layout_state", false);
    req.send(data);
}

function patch() {
    let req = new XMLHttpRequest();
    let address = document.getElementById("AdressID").value;
    if (address === "") {
        address = 123;
    }
    req.open("PUT", baseUrl + "address/" + address + "?words=1", true);
    req.setRequestHeader("Content-Type", "application/octet-stream");

    let value = document.getElementById("ValueID").value;
    let array = toByteArray(value);
    let array1 = new Uint8Array(array);

    req.send(array1);
}

function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

function toByteArray(hexString) {
    let result = [];
    for (let i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return result;
}