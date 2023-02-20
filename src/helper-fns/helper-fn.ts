import {IConnection, IPointSectorProps, ITakenPointProps, LineDirections} from "../constant/interfaces";

export const getSectorsData = (props: ITakenPointProps): IPointSectorProps[] => {
    // console.warn(props)
    const {connections, utmost} = props
    const colors = Object.keys(connections)
    const firstColor = colors[0]
    const singleColor = colors.length === 1
    const simpleLine = singleColor 
        && !utmost 
        && connections[firstColor].filter(c => c.neighbor).length === 2
    return colors.reduce((acc, color) => {
        const colorConns = connections[color] as IConnection[]
        colorConns.forEach(con => {
            const line = con.neighbor ? color : ''
            const sector = {dir: con.dir, line} as IPointSectorProps
            if (utmost) {
                sector.dir = con.dir
                sector.fill = color
            } else {
                sector.fill = ''
                sector.turn = simpleLine 
                    ? connections[color].filter(sec => 
                        sec.neighbor && sec.dir !== con.dir)[0].dir 
                    : undefined
            }
            acc[sectorIndex(con.dir)] = sector
            return acc
        })
        return acc
    }, [] as IPointSectorProps[])
}


export const sectorIndex = (dir: LineDirections) => {
    switch (dir) {
        case LineDirections.top: 
            return 0
        case LineDirections.right: 
            return 1
        case LineDirections.bottom: 
            return 3
        default: 
            return 2
    }
}

export const defaultSectors = () => Object.assign([], [
    {dir: LineDirections.top},
    {dir: LineDirections.right},
    {dir: LineDirections.left},
    {dir: LineDirections.bottom},
]) as IConnection[]

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


export const copyObj = (obj: {[key: string]: any}): {[key: string]: any} => {
    if (typeof obj !== 'object') return obj
    const copy = Array.isArray(obj) ? [] as any[] : {} as {[key: string]: any}
    for (const prop in obj) {
        const value = copyObj(obj[prop]) as any
        if (typeof value === 'object') {
            copy[prop] = Object.assign((Array.isArray(value) ? [] : {}), value)
        } else {
            copy[prop] = value
        }
    }
    return copy
}