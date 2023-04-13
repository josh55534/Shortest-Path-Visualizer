function dijkstra(grid, startNode, finishNode) {
    const visitedNodes = [];

    startNode.distance = 0;
    const unvisitedNodes = listNodes(grid);

    while (!!unvisitedNodes.length) {
        unvisitedNodes.sort((nodeOne, nodeTwo) => nodeOne.distance - nodeTwo.distance)
        const nextNode = unvisitedNodes.shift();

        if (nextNode.isWall) continue;

        if (nextNode.distance === Infinity) return visitedNodes;

        nextNode.isVisited = true;
        visitedNodes.push(nextNode);
        if (nextNode === finishNode) return visitedNodes;
        updateNodes(nextNode, grid);
    }
}

function updateNodes(node, grid) {
    const nearbyNodes = getNearbyNodes(node, grid);

    for (const nearbyNode of nearbyNodes) {
        nearbyNode.distance = node.distance + 1;
        nearbyNode.previousNode = node;
    }
}

function getNearbyNodes(node, grid) {
    const nodes = [];
    const { xPos, yPos } = node;

    if (xPos > 0) nodes.push(grid[yPos][xPos - 1]);
    if (yPos > 0) nodes.push(grid[yPos - 1][xPos]);
    if (yPos < grid.length - 1) nodes.push(grid[yPos + 1][xPos]);
    if (xPos < grid[0].length - 1) nodes.push(grid[yPos][xPos + 1]);

    return nodes.filter(node => !node.isVisited);
}

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
    var node = finishNode;
    while(node !== null) {
        node = node.previousNode;
        array.push(node);
    }

    return array;
}

export { dijkstra, pathFind }