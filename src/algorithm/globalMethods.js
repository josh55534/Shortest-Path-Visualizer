function listNodes(grid) {
    const nodeList = [];
    for (var row in grid) {
        for (var col in grid[0]) {
            nodeList.push(grid[row][col]);
        }
    }


    return nodeList
}

function pathFind(finishNode) {
    const array = [];
    array.push(finishNode);
    var node = finishNode.previousNode;
    while(node !== null) {
        array.push(node);
        node = node.previousNode;
    }

    return array;
}

export {listNodes, pathFind}