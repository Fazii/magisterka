function getConstantValue(address, constantId) {
    let responseText = document.getElementById(constantId);
    let req = new XMLHttpRequest();

    req.open("GET", "http://127.0.0.1:8000/" + "address/" + parseInt(address, 16).toString() + "?words=1", true);
    req.responseType = "arraybuffer";

    req.onload = function () {
        let array = new Uint8Array(req.response);
        let value = toWords(array).join('');
        responseText.innerHTML = "DEC: " + value.toUpperCase();
    };
    req.send();
}

function toWords (byteArray) {
    let words = [];
    for (let i = 0; i < byteArray.length; i += 4) {
        words[i / 4] = (byteArray[i + 3] << 24) + (byteArray[i + 2] << 16) + (byteArray[i + 1] << 8) + byteArray[i];
    }
    return words;
}