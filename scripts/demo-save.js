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
        console.log(item.valueOf());
        draw(item.valueOf());
    });
}

function addGrid() {
    let elementId = getElementId() + 1;
    let div = document.createElement('div');
    div.className = "item";
    div.id = elementId;
    div.setAttribute("data-id", elementId);

    // div.innerHTML = '<div class="item-content" >' + elementId + '</div >';
    div.innerHTML = '<div class="item-content" ><div class="container" id="container'+elementId+'"></div><input type="button" value="Usuń" onclick="deleteGrid('+ elementId +');" /></div>';

    let elementsByClassNameElement = document.getElementsByClassName('grid')[0];
    elementsByClassNameElement.appendChild(div);

    let currentLayoutJSON = JSON.parse(currentLayout);
    currentLayoutJSON.push(elementId.toString());
    console.log(currentLayoutJSON);

    putLayout(JSON.stringify(currentLayoutJSON));
    putLayoutState(document.getElementsByClassName('grid')[0].innerHTML);
    //initGrid();
   // draw()

   // draw(elementId);
}

function deleteGrid(elementId) {
    console.log("Delete " + elementId);
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