import { listNodes } from "./globalMethods";

function aStar(grid, startNode, finishNode) {
    const visitedNodes = [];

    startNode.distance = 0;
    startNode.hVal = calculateHVal(startNode, finishNode);

    const unvisitedNodes = listNodes(grid);

    while (!!unvisitedNodes.length) {
        unvisitedNodes.sort((nodeOne, nodeTwo) => { return (nodeOne.distance + nodeOne.hVal) - (nodeTwo.distance + nodeTwo.hVal) || nodeOne.hVal - nodeTwo.hVal });


        const nextNode = unvisitedNodes.shift();

        if (nextNode.isWall) continue;

        if (nextNode.distance === Infinity) return visitedNodes;

        nextNode.isVisited = true;
        visitedNodes.push(nextNode);
        if (nextNode === finishNode) return visitedNodes;
        updateNodes(nextNode, finishNode, grid);
    }
}

function updateNodes(node, finishNode, grid) {
    const nearbyNodes = getNearbyNodes(node, grid);

    for (const nearbyNode of nearbyNodes) {
        nearbyNode.distance = node.distance + 1;
        nearbyNode.hVal = calculateHVal(nearbyNode, finishNode);
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

function calculateHVal(nodeA, nodeB) {
    var total = 0;
    total += Math.abs(nodeA.xPos - nodeB.xPos);
    total += Math.abs(nodeA.yPos - nodeB.yPos);
    return total;
}

export { aStar }