import { listNodes } from "./globalMethods";

// Given a 2D array of nodes (grid), a starting node (startnode) and finish node (finishNode) find shortest path with Dijkstra pathfinding
// Sorts nodes by total distance traveled from start node. Checks nearby nodes of node with shortest distance traveled
// Returns an ordered array of visited nodes
function dijkstra(grid, startNode, finishNode) {
    const visitedNodes = [];

    startNode.distance = 0;
    const unvisitedNodes = listNodes(grid);

    while (!!unvisitedNodes.length) { // start of pathfinding loop
        unvisitedNodes.sort((nodeOne, nodeTwo) => nodeOne.distance - nodeTwo.distance) // sort unvisited nodes by lowest distance first
        const nextNode = unvisitedNodes.shift(); // grab next node

        if (nextNode.isWall) continue; // skip walls

        if (nextNode.distance === Infinity) return visitedNodes; // if next node distance is Infinity, no solution exists. return visited nodes

        nextNode.isVisited = true;
        visitedNodes.push(nextNode);
        if (nextNode === finishNode) return visitedNodes; // if nextNode is finishNode, solution found, return visited nodes
        updateNodes(nextNode, grid);
    }
}

// Given a recently visited node (node), update neaby unvisited nodes by increasing current distance from start by 1
// Set pointer of nearby nodes to recently visited nodes
function updateNodes(node, grid) {
    const nearbyNodes = getNearbyNodes(node, grid);

    for (const nearbyNode of nearbyNodes) {
        nearbyNode.distance = node.distance + 1;
        nearbyNode.previousNode = node;
    }
}

// Given a node object (node) and a 2D array of nodes (grid), find unvisited nodes touching current node.
// Returns array of nearby unvisited nodes
function getNearbyNodes(node, grid) {
    const nodes = [];
    const { xPos, yPos } = node;

    if (xPos > 0) nodes.push(grid[yPos][xPos - 1]);
    if (yPos > 0) nodes.push(grid[yPos - 1][xPos]);
    if (yPos < grid.length - 1) nodes.push(grid[yPos + 1][xPos]);
    if (xPos < grid[0].length - 1) nodes.push(grid[yPos][xPos + 1]);

    return nodes.filter(node => !node.isVisited);
}

export { dijkstra }