function initGrid() {
    console.log("initGrid");
    let grid = new Muuri('.grid', {
        dragEnabled: true,
        layoutOnInit: true,
        dragStartPredicate: function (item, event) {
            return document.getElementById("layoutBlock").value !== "Odblokuj";

        },
    }).on('move', function () {
        serializeLayout(grid);
    });

    loadLayout(grid);
}

function blockGrid() {
    let layoutBlock = document.getElementById("layoutBlock");
    if (layoutBlock.value === "Zablokuj") {
        initGrid();
        layoutBlock.value = "Odblokuj";
    } else {
        initGrid();
        layoutBlock.value = "Zablokuj";
    }
}

function serializeLayout(grid) {
    let itemIds = grid.getItems().map(function (item) {
        return item.getElement().getAttribute('data-id');
    });
    let stringify = JSON.stringify(itemIds);
    // Update layout_order
    gridElements.layout_order = JSON.parse(stringify);
    console.log(stringify);
    sendUpdateLayoutRequest(JSON.stringify(gridElements));
}

function loadLayout(grid) {
    let layout = gridElements.layout_order;
    let currentItems = grid.getItems();
    let currentItemIds = currentItems.map(function (item) {
        return item.getElement().getAttribute('data-id')
    });
    let newItems = [];
    let itemId;
    let itemIndex;

    for (var i = 0; i < layout.length; i++) {
        itemId = layout[i];
        itemIndex = currentItemIds.indexOf(itemId);
        if (itemIndex > -1) {
            newItems.push(currentItems[itemIndex])
        }
    }

    grid.sort(newItems, {layout: 'instant'});

    /**
     * Get address and refresh rate and draw chart
     */

    layout.forEach(async function (item, index) {
        let address = document.getElementById("ChartAddressID" + item).value;
        let refreshRate = document.getElementById("ChartRefreshID" + item).value;
        let formula = document.getElementById("ChartFormulaID" + item).value;
        await draw(item, address, refreshRate, formula);
    });
}

/**
 * Add new grid with chart. Save structure and state in server
 *  {
   "element_id: "1", // numer elementu na gridzie, potrzebny do sortowania
   "type": "spline_chart" // typ elementu.
   "address": "0xAABBCCDD", //Potencjalnie tablica adresów
   "refresh_rate": "1000" ,// czas pomiędzy kolejnymi odświeżeniami wykresu
   "formula: "x + 1", // Formuła metematyczna zastosowana do przekształcania wykresów
   "name": "koncentrator 1",
   "length": num_of_bytes_to_read,

}
 */
function addGrid() {
    let elementId = getCurrentHighestGridElementId() + 1;
    let chartAddress = document.getElementById("ChartAddressID").value;
    let chartRefresh = document.getElementById("ChartRefreshID").value;
    let chartFormula = document.getElementById("ChartFormulaID").value;

     if (chartAddress == null || chartAddress == "" || chartRefresh == null || chartRefresh == ""){
         alert("Pole nie może być puste");
         return;
     }


    let div = createHtmlElement(elementId, chartAddress, chartRefresh, chartFormula);

    let newGridElement = {
        "element_id": elementId,
        "type": "spline",
        "address": chartAddress,
        "refresh_rate": chartRefresh,
        "formula": chartFormula,
        "name:": chartAddress,
        "length": "1"
    };

    gridElements.layout.push(newGridElement);

    let grid = document.getElementsByClassName('grid')[0];
    grid.appendChild(div); // Add element to grid

    let currentLayoutJSON = gridElements.layout_order;
    currentLayoutJSON.push(elementId.toString());
    console.log(currentLayoutJSON);

    let layout_order = JSON.stringify(currentLayoutJSON);
    gridElements.layout_order = JSON.parse(layout_order);


    sendUpdateLayoutRequest(JSON.stringify(gridElements));
    initGrid();
}

/**
 * Delete grid element. Save structure and state in server
 *
 * @param elementId
 *              Id of the element. Taken from 'id' in html.
 */
function deleteGrid(elementId) {
    console.log("Delete " + elementId);
    deleteChart(elementId);
    document.getElementById(elementId).remove();

    for (let i = 0; i < gridElements.layout.length; i++) {
        if (elementId.valueOf() === gridElements.layout[i].element_id) {
            gridElements.layout.splice(i, 1);
            gridElements.layout_order.splice(gridElements.layout_order.indexOf(elementId.toString()), 1);
        }
    }

    sendUpdateLayoutRequest(JSON.stringify(gridElements));
    initGrid();
}

function updateGrid(elementId) {
    let chartAddress = document.getElementById("ChartAddressID" + elementId).value;
    let chartRefresh = document.getElementById("ChartRefreshID" + elementId).value;
    let chartFormula = document.getElementById("ChartFormulaID" + elementId).value;
    for (let i = 0; i < gridElements.layout.length; i++) {
        if (elementId.valueOf() === gridElements.layout[i].element_id) {
            gridElements.layout[i].address = chartAddress;
            gridElements.layout[i].refresh_rate = chartRefresh;
            gridElements.layout[i].formula = chartFormula;
        }
    }

    sendUpdateLayoutRequest(JSON.stringify(gridElements));

    updateChart(elementId, chartRefresh, chartAddress, chartFormula);
}

function getCurrentHighestGridElementId() {
    let n = document.getElementsByClassName('item'),
        m = 0,
        i = 0,
        j = n.length;
    for (; i < j; i++) {
        m = Math.max(n[i].id, m);
    }

    return m;
}

initGrid();