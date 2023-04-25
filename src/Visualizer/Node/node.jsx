import "./node.css"

function Node(props) {
    // ===== GLOBAL VARIABLES =====
    const xPos = props.xPos;
    const yPos = props.yPos;

    const isWall = props.isWall;
    const isStart = props.isStart;
    const isFinish = props.isFinish;

    const onClick = props.onClick;

    const color = isStart ? "start" : isFinish ? "finish" : isWall ? "wall" : "" // updates className CSS elements based on javascript elements passed to it

    return (
        <div
            id={`node-${xPos}-${yPos}`} 
            className={`node ${color}`}
            onClick={onClick}></div>
    )
}

export { Node };