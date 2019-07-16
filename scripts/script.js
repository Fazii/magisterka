const BASE_URL = "http://127.0.0.1:8000/";
let gridElements = {
    "layout": [],
    "layout_order": []
};

sendGetLayoutRequest();

function get() {
    let responseText = document.getElementById('response');
    let req = new XMLHttpRequest();
    let address = document.getElementById("AddressID1").value;

    if (address == null || address === "") {
        alert("Pole nie może być puste");
        return;
    }

    req.open("GET", BASE_URL + "address/" + parseInt(address, 16).toString() + "?words=1", true);
    req.responseType = "arraybuffer";

    req.onload = function () {
        let array = new Uint8Array(req.response);
        let value = toWords(array).join('');
        //toHexString(array);
        responseText.innerHTML ="DEC: " + value.toUpperCase();
    };
    req.send();
}

function getValueOnAddress(address, formula) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", BASE_URL + "address/" + parseInt(address, 16).toString() + "?words=1", true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                let array = new Uint8Array(xhr.response);
                let responseVal = toWords(array).join('');

                if (formula == null || formula === "") {
                    formula = "x";
                }

                let scope = {
                    x: responseVal
                };
                let eval = math.evaluate(formula.toString(), scope);
                resolve(Math.round(parseFloat(eval) *1000) / 1000); //Rounding to three decimal places

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
    let address = document.getElementById("AddressID").value;
    if (address === "") {
        address = 123;
    }
    req.open("PATCH", BASE_URL + "address/" + parseInt(address, 16).toString() + "?words=1", true);
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
        try {
            initGrid();
        } catch (err) {
            // just in case if first init failed
        }
    };
    req.send();
}

//Stop - json communication

function jsonToHtmlConverter(jsonArray) {
    let layout = jsonArray.layout;

    if (typeof layout !== 'undefined' && layout.length > 0) {
        layout.forEach(function (item, index) {
            let htmlDivElement = createHtmlElement(
                item.element_id,
                item.address,
                item.refresh_rate,
                item.formula);

            let grid = document.getElementsByClassName('grid')[0];
            grid.appendChild(htmlDivElement);
        });
    }
}

function createHtmlElement(elementId, address, refresh_rate, formula) {
    let div = document.createElement('div');
    div.className = "item";
    div.id = elementId;
    div.setAttribute("data-id", elementId);
    div.style.cssText =
        'background-color:#eee;' +
        'padding-bottom:80px;' +
        'margin-top:30px;' +
        'border-style:solid;' +
        'border-width:1px;' +
        'border-color:#0B29FA;' +
        'border-radius:3px;';

    let deleteButton = '<input type="button" class="butn-dlt chartButton" value="Usuń" onclick="deleteGrid(' + elementId + ');" />';
    let saveButton = '<input type="button" class="butn chartButton" value="Aktualizuj" onclick="updateGrid(' + elementId + ');" />';
    let chartButtons = '<div class="chartButtons">' + deleteButton + saveButton + '</div>';

    let address_input = '<label for="ChartAddressID' + elementId + '">Adres:</label><input type="text" class="inpt" value="' + address + '" id="ChartAddressID' + elementId + '">';
    let refresh_input = '<label for="ChartRefreshID' + elementId + '">Odśw.:</label><input type="text" class="inpt" value="' + refresh_rate + '" id="ChartRefreshID' + elementId + '">';
    let formula_input = '<label for="ChartFormulaID' + elementId + '">Formuła: </label><input type="text" class="inpt" value="' + formula + '" id="ChartFormulaID' + elementId + '">';
    let chartInputs = '<div class="chartInputs">' + address_input + refresh_input + formula_input + '</div>';

    let cnt = '<div class="item-content" ><div class="container" id="container' + elementId + '"></div>' + chartInputs + chartButtons + '</div>'; //Chart container

    div.innerHTML = '' + cnt + '';
    return div;
}

function updateGridElementsArray(json) {
    return new Promise(function (resolve, reject) {
        console.log(json);
        let parse = JSON.parse(json);
        let layout_order_array = parse.layout_order;
        let layout_array = parse.layout;

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

function toWords (byteArray) {
    let words = [];
    for (let i = 0; i < byteArray.length; i += 4) {
        words[i / 4] = (byteArray[i + 3] << 24) + (byteArray[i + 2] << 16) + (byteArray[i + 1] << 8) + byteArray[i];
    }
    return words;
}

function toByteArray(hexString) {
    let value = parseInt(hexString);
    return [(value & 0xFF), (value >> 8) & 0xFF, (value >> 16) & 0xFF, (value >> 24) & 0xFF];
}
