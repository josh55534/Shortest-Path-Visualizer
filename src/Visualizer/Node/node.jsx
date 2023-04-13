import "./node.css"

function Node(props) {
    const xPos = props.xPos;
    const yPos = props.yPos;

    const isWall = props.isWall;
    const isStart = props.isStart;
    const isFinish = props.isFinish;

    const onClick = props.onClick;

    const color = isStart ? "start" : isFinish ? "finish" : isWall ? "wall" : ""

    return (
        <div
            id={`node-${xPos}-${yPos}`} 
            className={`node ${color}`}
            onClick={onClick}></div>
    )
}

export { Node };