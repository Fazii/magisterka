let currentVal;
let currentLayout;

function get() {
   // console.log("calling get");
    let responseText = document.getElementById('response');
    let req = new XMLHttpRequest();
    let value = document.getElementById("valueID1").value;
    if (value === "") {
        value = 123;
    }
//    console.log(value);
    req.open("GET", "http://127.0.0.1:8000/address/" + value + "?words=1", true);
    req.responseType = "arraybuffer";

    req.onload = function () {
        let array = new Uint8Array(req.response);
        let responseVal = parseInt(toHexString(array), 16);
        responseText.innerHTML = responseVal;
     //   console.log(responseVal);
        currentVal = responseVal;
    };
    req.send();
}

function getLayout() {
    console.log("calling layout get");
    let req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:8000/layout", true);

    req.onload = function () {
        currentLayout = req.responseText;
    };
    req.send();
}

function putLayout(data) {
    console.log("calling putLayout");
    let req = new XMLHttpRequest();
    req.open("PUT", "http://127.0.0.1:8000/layout", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.send(data);
}

function getLayoutState() {
    console.log("calling layout get");
    let req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:8000/layout_state", true);

    req.onload = function () {
        var currentLayoutState = req.responseText;
        console.log("current state:");
        console.log(currentLayoutState);
        document.getElementsByClassName('grid')[0].insertAdjacentHTML('beforeend', currentLayoutState);
    };
    req.send();
}

function putLayoutState(data) {
    console.log("calling putLayoutState");
    let req = new XMLHttpRequest();
    req.open("PUT", "http://127.0.0.1:8000/layout_state", true);
    req.send(data);
}

function getValueForChart() {
    get();
    return currentVal;
}

function getCurrentLayout() {
    getLayout();
    console.log("current layout:");
    console.log(currentLayout);
    return currentLayout;
}

function patch() {
    let req = new XMLHttpRequest();
    let address = document.getElementById("AdressID").value;
    if (address === "") {
        address = 123;
    }
    req.open("PUT", "http://127.0.0.1:8000/address/" + address +"?words=1", true);
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