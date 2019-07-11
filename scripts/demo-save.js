initGrid();
let gridElements = {
    "layout": [],
    "layout_order": []
};

function initGrid() {
    let grid = new Muuri('.grid', {
        dragEnabled: true,
        layoutOnInit: false
    }).on('move', function () {
        serializeLayout(grid);
    });

    loadLayout(grid);
}

function serializeLayout(grid) {
    let itemIds = grid.getItems().map(function (item) {
        return item.getElement().getAttribute('data-id');
    });
    let stringify = JSON.stringify(itemIds);
    // Update layout_order
    gridElements.layout_order = stringify;
    console.log(stringify);
    putLayout(stringify);
}

function loadLayout(grid) {
    let layout = JSON.parse(getLayout());
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
    layout.forEach(function (item, index) {
        let address = document.getElementById("ChartAddressID" + item.valueOf()).value;
        let refreshRate = document.getElementById("ChartRefreshID" + item).value;
        draw(item.valueOf(), address, refreshRate);
    });
}

/**
 * Add new grid with chart. Save structure and state in server
 *  {
   "element_id: "1", // numer elementu na gridzie, potrzebny do sortowania
   "type": "spline_chart" // typ elementu.
   "address": 0xAABBCCDD, //Potencjalnie tablica adresów
   "refresh_rate": "1000 // czas pomiędzy kolejnymi odświeżeniami wykresu
   "name": "koncentrator 1",
   "length": num_of_bytes_to_read,

}
 */
function addGrid() {
    let elementId = getCurrentHighestGridElementId() + 1;
    let div = document.createElement('div');
    div.className = "item";
    div.id = elementId;
    div.setAttribute("data-id", elementId);

    let chartAddress = document.getElementById("ChartAddressID").value;
    let chartRefresh = document.getElementById("ChartRefreshID").value;

    let deleteButton = '<input type="button" value="Usuń" onclick="deleteGrid(' + elementId + ');" />';
    let saveButton = '<input type="button" value="Aktualizuj" onclick="updateGrid(' + elementId + ');" />';
    let cnt = '<div class="item-content" ><div class="container" id="container' + elementId + '"></div>' + deleteButton + saveButton + '</div>'; //Chart container
    let address = '<label for="ChartAddressID' + elementId + '">Adres: </label><input type="text" value="' + chartAddress + '" id="ChartAddressID' + elementId + '">';
    let refresh = '<label for="ChartRefreshID' + elementId + '">Odśw.: </label><input type="text" value="' + chartRefresh + '" id="ChartRefreshID' + elementId + '">';


    let newGridElement = {
        "element_id": elementId,
        "type": "spline",
        "address": chartAddress,
        "refresh_rate": chartRefresh,
        "name:": chartAddress,
        "length": "1"
    };

    gridElements.layout.push(newGridElement);
    /**
     * Create new HTML element
     *
     * @type {string}
     */
    div.innerHTML = '' + cnt + address + refresh + '';

    let grid = document.getElementsByClassName('grid')[0];
    grid.appendChild(div); // Add element to grid

    let currentLayoutJSON = JSON.parse(currentLayout);
    currentLayoutJSON.push(elementId.toString());
    console.log(currentLayoutJSON);

    let layout_order = JSON.stringify(currentLayoutJSON);
    gridElements.layout_order = layout_order;
    putLayout(layout_order); // Save layout structure
    putLayoutState(document.getElementsByClassName('grid')[0].innerHTML); // Save layout state
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
    let currentLayoutJSON = JSON.parse(currentLayout);

    let index = currentLayoutJSON.indexOf(elementId.toString());

    if (index > -1) {
        currentLayoutJSON.splice(index, 1);
    }

    for (let i = 0; i < gridElements.layout.length; i++) {
        if (elementId.valueOf() === gridElements.layout[i].element_id) {
            gridElements.layout.splice(i, 1);
        }
    }

    console.log(currentLayoutJSON);

    putLayout(JSON.stringify(currentLayoutJSON));
    putLayoutState(document.getElementsByClassName('grid')[0].innerHTML);
    initGrid();
}

// TODO: Implement updating current grid element
function updateGrid(elementId) {
    let chartAddress = document.getElementById("ChartAddressID" + elementId).value;
    let chartRefresh = document.getElementById("ChartRefreshID" + elementId).value;
    for (let i = 0; i < gridElements.layout.length; i++) {
        if (elementId.valueOf() === gridElements.layout[i].element_id) {
            gridElements.layout[i].address = chartAddress.toString();
            gridElements.layout[i].refresh_rate = chartRefresh.toString();
        }
    }

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