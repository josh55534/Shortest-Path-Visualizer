import { useEffect, useInsertionEffect, useState } from "react";
import { Node } from "./Node/node"
import "./path-visualizer.css"
import { dijkstra } from "../algorithm/dijkstra";
import { aStar } from "../algorithm/a-star";
import { pathFind } from "../algorithm/globalMethods";

function PathVisualizer() {
    const [grid, setGrid] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [pathLength, setPathLength] = useState("");
    const [nodesLength, setNodesLength] = useState("");

    const [startPos, setStartPos] = useState([]);
    const [finishPos, setFinishPos] = useState([]);

    const GRID_MAX_X = 40;
    const GRID_MAX_Y = 20;

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

    const createNode = (xPos, yPos) => {
        return {
            xPos: xPos,
            yPos: yPos,
            distance: Infinity,
            hVal: Infinity,
            isWall: false,
            isStart: xPos === startPos[1] && yPos === startPos[0],
            isFinish: xPos === finishPos[1] && yPos === finishPos[0],
            isVisited: false,
            previousNode: null
        }
    }

    const toggleWall = (xPos, yPos) => {
        var newGrid = [...grid];
        if (!startPos.length) {
            newGrid[yPos][xPos].isStart = true;
            setStartPos([yPos, xPos]);
        }
        else if (!finishPos.length) {
            newGrid[yPos][xPos].isFinish = true;
            setFinishPos([yPos, xPos]);
        }
        else {
            newGrid[yPos][xPos].isWall = !newGrid[yPos][xPos].isWall;
            setGrid(newGrid);
        }
    }

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

    useEffect(() => {
        if (isLoading) {
            setGrid(setupGrid());
            setLoading(false);
        }
    }, [grid])

    const setVisited = (x, visited) => {
        const node = visited[x];
        document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node visited";
    }

    const setPath = (x, finish) => {
        const node = finish[x];
        document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node path";
    }

    const createPath = (finish, x) => {
        setTimeout(() => {
            setPath(x, finish);
            x--;
            if (x > 0) createPath(finish, x);
        }, 10);
    }

    const updateNodes = (visited, x, finish) => {
        setTimeout(() => {
            setVisited(x, visited);
            x++;
            if (x < visited.length - 1) updateNodes(visited, x, finish);
            if (x == visited.length - 1) createPath(finish, finish.length - 2);
        },);
    }

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