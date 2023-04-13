import { useEffect, useInsertionEffect, useState } from "react";
import { Node } from "./Node/node"
import "./path-visualizer.css"
import { dijkstra, pathFind } from "../algorithm/dijkstra";
import path from "path";

function PathVisualizer() {
    const [grid, setGrid] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const GRID_MAX_X = 40;
    const GRID_MAX_Y = 20;

    const START_X_POS = 0;
    const START_Y_POS = 0;
    const FINISH_X_POS = GRID_MAX_X - 1;
    const FINISH_Y_POS = GRID_MAX_Y - 1;

    const createNode = (xPos, yPos) => {
        return {
            xPos: xPos,
            yPos: yPos,
            distance: Infinity,
            isWall: false,
            isStart: xPos === START_X_POS && yPos === START_Y_POS,
            isFinish: xPos === FINISH_X_POS && yPos === FINISH_Y_POS,
            isVisited: false,
            previousNode: null
        }
    }

    const toggleWall = (xPos, yPos) => {
        var newGrid = [...grid];
        newGrid[yPos][xPos].isWall = !newGrid[yPos][xPos].isWall;
        setGrid(newGrid);
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
    })

    const setVisited = (x, visited) => {
        const node = visited[x];
        document.getElementById(`node-${node.xPos}-${node.yPos}`).className = "node visited";
    }

    const setPath = (x, finish) => {

        const node = finish[x];
        console.log(x)
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
            if (x == visited.length - 1) createPath(finish, finish.length - 3);
        }, );
    }

    const startDijsktra = () => {
        const startNode = grid[START_Y_POS][START_Y_POS];
        const finishNode = grid[FINISH_Y_POS][FINISH_X_POS];

        const visited = dijkstra(grid, startNode, finishNode);
        const path = pathFind(finishNode);

        console.log(path.length)
        updateNodes(visited, 1, path);
    }

    return (
        <>
            <div className="header">
                <h1 className="title">Shortest Path Visualizer</h1>
                <p>Click on a box to turn it into a wall. Click start to find the shortest path from the green box to the red.</p>
                <button onClick={startDijsktra}>Start</button>
            </div>
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