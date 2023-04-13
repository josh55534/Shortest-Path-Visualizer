import { useEffect, useInsertionEffect, useState } from "react";
import { Node } from "./Node/node"

function PathVisualizer() {
    const [grid, setGrid] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const GRID_MAX_X = 10;
    const GRID_MAX_Y = 10;

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
            previousNode: null
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
    })

    return (
        <div id="gridBox">
            {grid.map((row, indexY) => (
                <div id={`row${indexY}`} key={`row${indexY}`}>
                    {row.map((col, indexX) => (
                        <Node key={`row${indexY}-col${indexX}`}
                            xPos={col.xPos}
                            yPos={col.yPos}
                            isWall={col.isWall}
                            isStart={col.isStart}
                            isFinish={col.isFinish}
                        />
                    ))}
                </div>
            ))}
        </div>
    )


}

export { PathVisualizer };