import { useEffect, useInsertionEffect, useState } from "react";
import { Node } from "./Node/node"
import "./path-visualizer.css"
import { dijkstra } from "../algorithm/dijkstra";
import { aStar } from "../algorithm/a-star";
import { pathFind } from "../algorithm/globalMethods";

function PathVisualizer() {
    // ===== GLOBAL VARIABLES =====
    const [grid, setGrid] = useState([]); // javascript object grid
    const [isLoading, setLoading] = useState(true); // check whether the data has been loaded or not

    const [pathLength, setPathLength] = useState(""); // message to print the length of the path found
    const [nodesLength, setNodesLength] = useState(""); // message to print the number of nodes checked

    const [startPos, setStartPos] = useState([]); // (X, Y) values of selected start node
    const [finishPos, setFinishPos] = useState([]); // (X, Y) values of selected end node

    const GRID_MAX_X = 40; // width of grid in number of nodes
    const GRID_MAX_Y = 20; // height of grid in number of nodes

    // ===== METHODS =====

    // Resets the node colors in the grid
    const reRender = () => {
        for (var y in grid) {
            for (var x in grid[0]) {
                
                const node = grid[y][x];
                node.distance = Infinity;
                node.hVal = Infinity;
                node.isVisited = false;

                setPathLength("");
                setNodesLength("");

                if(node.isStart) document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node start";
                else if(node.isFinish) document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node finish";
                else if(node.isWall) document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node wall";
                else document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node";
            }
        }
    }

    // Create a new javascript node object with a given X and Y coordinate
    // Returns created javascript object
    const createNode = (xPos, yPos) => {
        return {
            xPos: xPos, // x position
            yPos: yPos, // y position
            distance: Infinity, // distance from start node
            hVal: Infinity, // calculated distance from end node (A*)
            isWall: false, // if node is a wall, set to true
            isStart: xPos === startPos[1] && yPos === startPos[0], // if xPos and yPos are same of start node, set isStart to true
            isFinish: xPos === finishPos[1] && yPos === finishPos[0], // if xPos and yPos are same of finish node, set isFinish to true
            isVisited: false, // if node has been checked before, set to true
            previousNode: null // pointer to previous node
        }
    }

    // Given an X and Y coordinate, update node so that it is a wall
    // Also updates nodes to start and end nodes if start/end nodes have yet to be selected
    const toggleWall = (xPos, yPos) => {
        var newGrid = [...grid];
        if (!startPos.length) { // if start node hasn't been selected, update node to be start node
            newGrid[yPos][xPos].isStart = true;
            setStartPos([yPos, xPos]);
        }
        else if (!finishPos.length) { // if finish node hasn't been selected, update node to be finish node
            newGrid[yPos][xPos].isFinish = true;
            setFinishPos([yPos, xPos]);
        }
        else { // update node to be wall node
            newGrid[yPos][xPos].isWall = !newGrid[yPos][xPos].isWall;
            setGrid(newGrid);
        }
    }

    // Creates a 2D array of javascript node objects
    // Returns 2D array
    const setupGrid = () => {
        var grid = []

        for (var y = 0; y < GRID_MAX_Y; y++) {
            var row = []

            for (var x = 0; x < GRID_MAX_X; x++) {
                row.push(createNode(x, y));
            }

            grid.push(row);
        }

        return grid;
    };

    // Creates grid upon loading webpage if isLoading is true
    useEffect(() => {
        if (isLoading) {
            setGrid(setupGrid());
            setLoading(false);
        }
    }, [grid])

    // Given an index value (x) and array of nodes (visited), update node[index] to display as visited node (yellow)
    const setVisited = (x, visited) => {
        const node = visited[x];
        document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node visited";
    }

    // Given an index value (x) and array of nodes (visited), update node[index] to display as path node (light blue)
    const setPath = (x, finish) => {
        const node = finish[x];
        document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node path";
    }
    
    // Given an array of nodes and starting value (x) update colors of nodes to be path nodes (light blue)
    // Called recursively with a timer so that it updates each node with a delay
    const createPath = (finish, x) => {
        setTimeout(() => {
            setPath(x, finish);
            x--;
            if (x > 0) createPath(finish, x);
        }, 10);
    }

    // Given an array of nodes and starting value (x) update colors of nodes to be path nodes (light blue)
    // Called recursively with a timer so that it updates each node with a delay
    // When finished, call createPath() to update path nodes to light blue
    const updateNodes = (visited, x, finish) => {
        setTimeout(() => {
            setVisited(x, visited);
            x++;
            if (x < visited.length - 1) updateNodes(visited, x, finish);
            if (x == visited.length - 1) createPath(finish, finish.length - 2);
        },);
    }

    // Calls the Dijkstra pathfinding algorithm, passing the 2D array of nodes to the algorithm
    // Calls updateNodes() to start the animation of updating nodes in order of visited
    const startDijsktra = () => {
        reRender();
        const startNode = grid[startPos[0]][startPos[1]];
        const finishNode = grid[finishPos[0]][finishPos[1]];

        const visited = dijkstra(grid, startNode, finishNode);
        const path = pathFind(finishNode);

        setPathLength(`Dijkstra path length: ${path.length - 1}`)
        setNodesLength(`Total Nodes Visited: ${visited.length - 1}`)

        updateNodes(visited, 1, path);
    }

    // Calls the A* pathfinding algorithm, passing the 2D array of nodes to the algorithm
    // Calls updateNodes() to start the animation of updating nodes in order of visited
    const startAStar = () => {
        reRender();
        const startNode = grid[startPos[0]][startPos[1]];
        const finishNode = grid[finishPos[0]][finishPos[1]];

        const visited = aStar(grid, startNode, finishNode);
        const path = pathFind(finishNode);

        setPathLength(`A* path length: ${path.length - 1}`)
        setNodesLength(`Total Nodes Visited: ${visited.length - 1}`)

        updateNodes(visited, 1, path);
    }

    // ===== COMPONENT RENDERING =====
    return (
        <>
            <div className="header">
                <h1 className="title">Shortest Path Visualizer</h1>
                <p>Click on a box to turn it into a wall. Click start to find the shortest path from the green box to the red.</p>
                <button onClick={startDijsktra}>Start Dijkstra</button>
                <button onClick={startAStar}>Start A*</button>
            </div>
            {pathLength !== "" && <p>{pathLength}</p>}
            {nodesLength !== "" && <p>{nodesLength}</p>}
            <div id="gridBox" className="gridBox">
                {grid.map((row, indexY) => (
                    <div id={`row${indexY}`} key={`row${indexY}`} className="gridRow">
                        {row.map((col, indexX) => (
                            <Node key={`row${indexY}-col${indexX}`}
                                xPos={col.xPos}
                                yPos={col.yPos}
                                isWall={col.isWall}
                                isStart={col.isStart}
                                isFinish={col.isFinish}
                                onClick={() => { toggleWall(indexX, indexY) }}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    )


}

export { PathVisualizer };