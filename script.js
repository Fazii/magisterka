function get() {
    var responseText = document.getElementById('response');
    var req = new XMLHttpRequest();
    req.open("GET", "http://127.0.0.1:8000/address/123?words=1", true);
    req.responseType = "arraybuffer";

    req.onload = function (res) {
        var array = new Uint8Array(req.response);
        var result = parseInt(toHexString(array), 16);
        console.log(result);
        responseText.innerHTML = result;
    };
    req.send();
}

function patch() {
    var responseText = document.getElementById('response1');
    var req = new XMLHttpRequest();
    req.open("PATCH", "http://127.0.0.1:8000/address/123?words=1", true);
    req.onload = function (res) {
        var array = new Uint8Array(req.response);
        var result = parseInt(toHexString(array), 16);
        console.log(result);
        responseText.innerHTML = result;
    };

    var array = toByteArray("5f43");

    req.send(array);
}

function toHexString(byteArray) {
    return Array.prototype.map.call(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

function toByteArray(hexString) {
    var result = [];
    for (var i = 0; i < hexString.length; i += 2) {
        result.push(parseInt(hexString.substr(i, 2), 16));
    }
    return result;
}