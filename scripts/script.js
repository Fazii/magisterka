const BASE_URL = "http://127.0.0.1:8000/";
let gridElements = {
    "layout": [],
    "layout_order": []
};

sendGetLayoutRequest();
function get() {
    let responseText = document.getElementById('response');
    let req = new XMLHttpRequest();
    let value = document.getElementById("valueID1").value;
    if (value === "") {
        value = 123;
    }

    req.open("GET", BASE_URL + "address/" + value + "?words=1", true);
    req.responseType = "arraybuffer";

    req.onload = function () {
        let array = new Uint8Array(req.response);
        let hexString = toHexString(array);
        responseText.innerHTML = "DEC: "+parseInt(hexString, 16).toString() + " / HEX: " + hexString.toUpperCase();
    };
    req.send();
}

function getValueOnAddress(address) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", BASE_URL + "address/" + address + "?words=1", true);
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

function patch() {
    let req = new XMLHttpRequest();
    let address = document.getElementById("AdressID").value;
    if (address === "") {
        address = 123;
    }
    req.open("PATCH", BASE_URL + "address/" + address + "?words=1", true);
    req.setRequestHeader("Content-Type", "application/octet-stream");

    let value = document.getElementById("ValueID").value;
    let array = toByteArray(value);
    let array1 = new Uint8Array(array);

    req.send(array1);
}

//Start - json communication

function sendUpdateLayoutRequest(jsonLayout) {
    console.log("calling sendUpdateLayoutRequest with payload: " + jsonLayout);
    let req = new XMLHttpRequest();
    req.open("PUT", BASE_URL + "configuration", true);
    req.setRequestHeader("Content-Type", "application/json");

    req.send(jsonLayout);
}

function sendGetLayoutRequest() {
    console.log("calling sendGetLayoutRequest");
    let req = new XMLHttpRequest();
    req.open("GET", BASE_URL + "configuration", true);

    req.onload = async function () {
        let currentLayoutState = req.responseText;
        console.log("current json state:");
        console.log(currentLayoutState);
        let updatedGridElements = await updateGridElementsArray(currentLayoutState);
        jsonToHtmlConverter(updatedGridElements);
    };
    req.send();
}

//Stop - json communication

function jsonToHtmlConverter(jsonArray) {
    let layout = jsonArray.layout;

    if (typeof layout !== 'undefined' && layout.length > 0){
        layout.forEach(function (item, index) {
            let htmlDivElement = createHtmlElement(item.element_id.toString(), item.address.toString(), item.refresh_rate.toString());

            let grid = document.getElementsByClassName('grid')[0];
            grid.appendChild(htmlDivElement);
        });
    }
}

function createHtmlElement(elementId, address, refresh_rate) {
    let div = document.createElement('div');
    div.className = "item";
    div.id = elementId;
    div.setAttribute("data-id", elementId);
    div.style.cssText = 'background-color:#eee;padding-bottom:80px;margin-top:30px;border-style:solid;border-width:1px;border-color:#0B29FA;border-radius:3px;';

    let chartAddress = address;
    let chartRefresh = refresh_rate;

    let deleteButton = '<input type="button" class="butn-dlt chartButton" value="Usuń" onclick="deleteGrid(' + elementId + ');" />';
    let saveButton = '<input type="button" class="butn chartButton" value="Aktualizuj" onclick="updateGrid(' + elementId + ');" />';
    let chartButtons = '<div class="chartButtons">' + deleteButton + saveButton + '</div>';
    let address_input = '<label for="ChartAddressID' + elementId + '">Adres:</label><input type="text" class="inpt" value="' + chartAddress + '" id="ChartAddressID' + elementId + '">';
    let refresh_input = '<label for="ChartRefreshID' + elementId + '">Odśw.:</label><input type="text" class="inpt" value="' + chartRefresh + '" id="ChartRefreshID' + elementId + '">';
    let cnt = '<div class="item-content" ><div class="container" id="container' + elementId + '"></div>'+ address_input + refresh_input + chartButtons + '</div>'; //Chart container

    div.innerHTML = '' + cnt +'';
    return div;
}

function updateGridElementsArray(json) {
    return new Promise(function (resolve, reject) {
        console.log(json);
        let parse = JSON.parse(json);
        let layout_order_array = parse.layout_order;
        let layout_array = parse.layout;
        console.log("A:" + parse.layout_order);

        if (typeof layout_array !== 'undefined' && layout_array.length > 0
            && typeof layout_order_array !== 'undefined' && layout_order_array.length > 0) {
            for (let i = 0; i < layout_array.length; i++) {
                gridElements.layout[i] = layout_array[i];
                gridElements.layout_order.push(layout_order_array[i]);
            }
        }
        resolve(gridElements);
    });
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
