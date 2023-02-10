import { IPointConnections, IPointSectorProps, LineDirections } from "../../constant/interfaces"

export const getOppositeDirection = (dir: LineDirections) => {
    switch (dir) {
        case LineDirections.bottom: 
            return LineDirections.top
        case LineDirections.top:
            return LineDirections.bottom
        case LineDirections.left:
            return LineDirections.right
        default:
            return LineDirections.left
    } 
}

export const defaultSectors = [
    {dir: LineDirections.top},
    {dir: LineDirections.right},
    {dir: LineDirections.bottom},
    {dir: LineDirections.left}
] as IPointSectorProps[]

export const getSectorsData = (props: {connections: IPointConnections}): IPointSectorProps[] => {
    const {connections} = props
    const colors = Object.keys(connections)
    const firstColor = colors[0]
    const singleColor = colors.length === 1
    const simpleLine = singleColor && connections[firstColor].length === 2
    const mapedConnections = colors.reduce((acc, col) => {
        const dirs = connections[col] as LineDirections[]
        dirs.forEach(d => {
            if(!acc[d]) {
                acc[d] = col
            } else {
                console.error('invalid props', props)
            }
        })
        return acc
    }, {} as {[dir: string]: string})
    return defaultSectors.map(sec => {
        const lineColor = mapedConnections[sec.dir]
        sec.fill = simpleLine ? '' : lineColor || firstColor
        sec.line = !!lineColor
        sec.turn = simpleLine 
            ? connections[lineColor].filter(d => d !== sec.dir)[0] 
            : null
        return sec as IPointSectorProps
    })
}

export const PointSector: React.FC<IPointSectorProps> = (props: IPointSectorProps) => {
    const {color, turn, dir, line, fill} = props
    const filledClass = fill.length ? ` filled-${fill}` : ''
    const lineClass = line ? ` line-${color}` : ''
    const turnClass = turn === getOppositeDirection(dir) ? '' : ` turn-${turn}`
    const className = `puzzle-point_${dir}${filledClass}${lineClass}${turnClass}`
    return <div className={className}></div>
}

export const Point: React.FC<{connections: IPointConnections}> = (props: {connections: IPointConnections}) => {
    
    const sectorsData = getSectorsData(props)
   
    return <div className="point-wrapper">
            {
                sectorsData.map(sec => {
                    const {dir, fill, color, turn, line} = sec as IPointSectorProps
                    return <PointSector 
                                color={color}
                                key={dir}
                                dir={dir}
                                line={line}
                                fill={fill}
                                turn={turn}
                            />
                })
            }
        </div>
}
