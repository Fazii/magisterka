initGrid();

function initGrid() {
    var grid = new Muuri('.grid', {
        dragEnabled: true,
        layoutOnInit: false
    }).on('move', function () {
        serializeLayout(grid);
    });

    loadLayout(grid);
    grid.add([]);
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
    // getCurrentLayout()
    var layout = JSON.parse("[\"1\", \"2\", \"3\"]");
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
}

function addGrid() {
    let elementId = getElementId() + 1;
    var div = document.createElement('div');
    div.className = "item";
    div.id = elementId;
    div.setAttribute("data-id", elementId);


    console.log("element:");
    console.log(elementId);

    div.innerHTML = '<div class="item-content" >3</div >';

    document.getElementsByClassName('grid')[0].appendChild(div);
    var s = new XMLSerializer();
    var str = s.serializeToString(div);
    console.log(div);
    putLayoutState(str);
    initGrid();
   // draw()
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