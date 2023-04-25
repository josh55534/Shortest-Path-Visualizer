import { listNodes } from "./globalMethods";

// Given a 2D array of nodes (grid), a starting node (startnode) and finish node (finishNode) find shortest path with A* pathfinding
// Calculates hVal for each nearby node, which is approximate distance from finish node. check nodes that are closer to finish node first
// Returns an ordered array of visited nodes
function aStar(grid, startNode, finishNode) {
    const visitedNodes = [];

    startNode.distance = 0;
    startNode.hVal = calculateHVal(startNode, finishNode); // Calculate hVal

    const unvisitedNodes = listNodes(grid);

    while (!!unvisitedNodes.length) { // start of pathfinding loop

        // sort nodes by lowest (distance + hval), in case of duplicate values, sort by lowest hVal
        unvisitedNodes.sort((nodeOne, nodeTwo) => { return (nodeOne.distance + nodeOne.hVal) - (nodeTwo.distance + nodeTwo.hVal) || nodeOne.hVal - nodeTwo.hVal });

        const nextNode = unvisitedNodes.shift(); // grab next node

        if (nextNode.isWall) continue; // skip walls

        if (nextNode.distance === Infinity) return visitedNodes; // if next node distance is infinity, we have no solution. return nodes visited

        nextNode.isVisited = true;
        visitedNodes.push(nextNode);
        if (nextNode === finishNode) return visitedNodes; // if nextNode is finishNode, we found solution. return nodes visited
        updateNodes(nextNode, finishNode, grid);
    }
}

// Given a recently visited node (node), update neaby unvisited nodes by increasing current distance from start by 1
// and calculating hVal for each node. Set pointer of nearby nodes to recently visited nodes
function updateNodes(node, finishNode, grid) {
    const nearbyNodes = getNearbyNodes(node, grid);

    for (const nearbyNode of nearbyNodes) {
        nearbyNode.distance = node.distance + 1;
        nearbyNode.hVal = calculateHVal(nearbyNode, finishNode);
        nearbyNode.previousNode = node;
    }
}

// Given a node object (node) and a 2D array of nodes (grid), find unvisited nodes touching current node.
// Returns array of nearby unvisited nodes
function getNearbyNodes(node, grid) {
    const nodes = [];
    const { xPos, yPos } = node;

    if (xPos > 0) nodes.push(grid[yPos][xPos - 1]); // get node to left of input node
    if (yPos > 0) nodes.push(grid[yPos - 1][xPos]); // get node below input node
    if (yPos < grid.length - 1) nodes.push(grid[yPos + 1][xPos]); // get node above input node
    if (xPos < grid[0].length - 1) nodes.push(grid[yPos][xPos + 1]); // get node to right of input node

    return nodes.filter(node => !node.isVisited); // filter visited nodes out of array
}

// Given a node object (nodeA) and a second node object (nodeB), calculate distance from nodeA to nodeB
// Returns distance calculated
function calculateHVal(nodeA, nodeB) {
    var total = 0;
    total += Math.abs(nodeA.xPos - nodeB.xPos);
    total += Math.abs(nodeA.yPos - nodeB.yPos);
    return total;
}

export { aStar }