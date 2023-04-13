function Node(props) {
    const xPos = props.xPos;
    const yPos = props.yPos;
    
    const isWall = props.isWall;
    const isStart = props.isStart;
    const isFinish = props.isFinish;

    const color = isStart ? "start" : isFinish ? "finish" : isWall ? "wall" : ""

    return (
        <div className="text-red-500">
            {color}
        </div>
    )
}

export { Node };