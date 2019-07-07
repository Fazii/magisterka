initGrid();

function initGrid() {
    var grid = new Muuri('.grid', {
        dragEnabled: true,
        layoutOnInit: false
    }).on('move', function () {
        serializeLayout(grid);
    });

    loadLayout(grid);
}

function serializeLayout(grid) {
    var itemIds = grid.getItems().map(function (item) {
        return item.getElement().getAttribute('data-id');
    });
    let stringify = JSON.stringify(itemIds);
    console.log(stringify);
    putLayout(stringify);
}

function loadLayout(grid) {
    var layout = JSON.parse(getLayout());
    var currentItems = grid.getItems();
    var currentItemIds = currentItems.map(function (item) {
        return item.getElement().getAttribute('data-id')
    });
    var newItems = [];
    var itemId;
    var itemIndex;

    for (var i = 0; i < layout.length; i++) {
        itemId = layout[i];
        itemIndex = currentItemIds.indexOf(itemId);
        if (itemIndex > -1) {
            newItems.push(currentItems[itemIndex])
        }
    }

    grid.sort(newItems, {layout: 'instant'});

    layout.forEach(function (item, index) {
        let address = document.getElementById("ChartAddressID" + item.valueOf()).value;
        let refreshRate = document.getElementById("ChartRefreshID" + item).value;
        draw(item.valueOf(), address, refreshRate);
    });
}

function addGrid() {
    let elementId = getElementId() + 1;
    let div = document.createElement('div');
    div.className = "item";
    div.id = elementId;
    div.setAttribute("data-id", elementId);

    let chartAddress = document.getElementById("ChartAddressID").value;
    let chartRefresh = document.getElementById("ChartRefreshID").value;
    let updateData = ''+elementId+','+chartAddress+','+chartRefresh+'';

    let deleteButton = '<input type="button" value="Usuń" onclick="deleteGrid('+ elementId +');" />';
    let saveButton = '<input type="button" value="Aktualizuj" onclick="updateGrid('+ updateData +');" />';
    let cnt = '<div class="item-content" ><div class="container" id="container'+elementId+'"></div>'+deleteButton + saveButton+'</div>';
    let address = '<label for="ChartAddressID'+elementId+'">Adres: </label><input type="text" value="'+chartAddress+'" id="ChartAddressID'+elementId+'">';
    let refresh = '<label for="ChartRefreshID'+elementId+'">Odśw.: </label><input type="text" value="'+chartRefresh+'" id="ChartRefreshID'+elementId+'">';

    div.innerHTML = ''+cnt + address + refresh +'';

    let grid = document.getElementsByClassName('grid')[0];
    grid.appendChild(div);

    let currentLayoutJSON = JSON.parse(currentLayout);
    currentLayoutJSON.push(elementId.toString());
    console.log(currentLayoutJSON);

    putLayout(JSON.stringify(currentLayoutJSON));
    putLayoutState(document.getElementsByClassName('grid')[0].innerHTML);
    initGrid();
}

function deleteGrid(elementId) {
    console.log("Delete " + elementId);
    deleteChart(elementId);
    document.getElementById(elementId).remove();
    let currentLayoutJSON = JSON.parse(currentLayout);

    let index = currentLayoutJSON.indexOf(elementId.toString());

    if (index > -1) {
        currentLayoutJSON.splice(index, 1);
    }

    console.log(currentLayoutJSON);

    putLayout(JSON.stringify(currentLayoutJSON));
    putLayoutState(document.getElementsByClassName('grid')[0].innerHTML);
    initGrid();
}

function updateGrid(elementId, address, refresh) {
    console.log(elementId, address, refresh);
}
function getElementId() {
    var n = document.getElementsByClassName('item'),
        m = 0,
        i = 0,
        j = n.length;
    for (;i<j;i++) {
        m = Math.max(n[i].id,m);
    }

    return m;
}