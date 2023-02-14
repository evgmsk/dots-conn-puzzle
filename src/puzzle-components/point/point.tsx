import { IPointSectorProps, ITakenPointProps, LineDirections } from "../../constant/interfaces"

import './point.scss'

export const defaultSectors = [
    {dir: LineDirections.top},
    {dir: LineDirections.right},
    {dir: LineDirections.left},
    {dir: LineDirections.bottom}
] as IPointSectorProps[]

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

export const getSectorsData = (props: ITakenPointProps): IPointSectorProps[] => {
    const {connections, utmost} = props
    const colors = Object.keys(connections)
    const firstColor = colors[0]
    const singleColor = colors.length === 1
    const simpleLine = singleColor && !utmost && connections[firstColor].length === 2 
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
    return defaultSectors.map(_sec => {
        const sec = Object.assign({}, _sec)
        const lineColor = mapedConnections[sec.dir]
        sec.fill = !utmost ? '' : lineColor || firstColor
        sec.line = lineColor || ''
        sec.turn = simpleLine && connections[lineColor]
            ? connections[lineColor].filter(d => d !== sec.dir)[0] 
            : null
        return sec as IPointSectorProps
    })
}

export const Point: React.FC<ITakenPointProps> = (props: ITakenPointProps) => {
   
    const sectorsData = getSectorsData(props)
    
    return <>
        <div className="point-wrapper">
            {
                sectorsData.map(sec => {
                    const {dir, fill} = sec as IPointSectorProps
                    // console.warn(turn === getOppositeDirection(dir), turn, dir )
                    const fillCl = !!fill ? ` fill-${fill}` : ''
                    const sectorName = `puzzle-point_${dir}${fillCl}`
                    return !!fill ? <div className={sectorName} key={dir}></div> : null
                })
            }
        </div>
        {
            sectorsData.map(sec => {
                const {dir, turn, line} = sec as IPointSectorProps
                const lineCl = !!line ? ` line-${line}` : ''
                const turnCl = !turn ? '' : ` turn-${turn}`
                const lineName = `line-${dir}${lineCl}${turnCl}`
                return !!line ? <div className={lineName} key={dir}></div> : null
            })
        }
    </>
}
