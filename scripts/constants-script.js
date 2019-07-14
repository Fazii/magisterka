function getConstantValue(address, constantId) {
    let responseText = document.getElementById(constantId);
    let req = new XMLHttpRequest();

    req.open("GET", "http://127.0.0.1:8000/" + "address/" + parseInt(address, 16).toString() + "?words=1", true);
    req.responseType = "arraybuffer";

    req.onload = function () {
        let array = new Uint8Array(req.response);
        let hexString = toHexString(array);
        console.log(hexString);
        responseText.innerHTML = "DEC: "+parseInt(hexString, 16).toString() + " / HEX: " + hexString.toUpperCase();
    };
    req.send();
}