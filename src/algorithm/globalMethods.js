// Given a 2D array of nodes (grid) put all nodes in a single array
// Returns 1D array of nodes
function listNodes(grid) {
    const nodeList = [];
    for (var row in grid) {
        for (var col in grid[0]) {
            nodeList.push(grid[row][col]);
        }
    }

    return nodeList
}

// Given a node (finishNode), find path of nodes visited by pushing previous
// node pointer to array of nodes
// Returns array of nodes that lead from start node to given node
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