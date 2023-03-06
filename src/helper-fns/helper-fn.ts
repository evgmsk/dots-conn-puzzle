import {DefaultColor, DefaultConnections, DefaultSectors} from "../constant/constants";
import {
    IDotSectorProps,
    ITakenPointProps,
    LineDirections,
    ISector
} from "../constant/interfaces";

const development = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';

export const isDev = () => development

export const getSectorsData = (props: ITakenPointProps): IDotSectorProps[] => {
    // console.warn(props)
    const {connections, utmost, crossLine, joinPoint} = props
    const singleColor = (!crossLine && !joinPoint) || joinPoint?.length === 1
    const neighborDirs = Object.keys(connections)
        .filter(key => connections[key].neighbor) as LineDirections[]
    const simpleLine = singleColor && !utmost
        && neighborDirs.length === 2
    return defaultSectors().map(sector => {
        const {neighbor, color} = connections[sector.dir]
        const turn = simpleLine
            ? neighborDirs.filter(dir => dir !== sector.dir)[0]
            : undefined
        return {
            dir: sector.dir,
            line: neighbor ? color : '',
            fill: utmost ? color : '',
            turn,
        }
    })
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


export const defaultConnectionsWithColor = (color = DefaultColor) => {
    const connections = Object.assign({}, DefaultConnections)
    if (color !== DefaultColor) {
        defaultSectors().forEach(sec => {
            connections[sec.dir] = {color}
        })
    }
    return connections
}

export const defaultSectors = () => Object.assign([], DefaultSectors) as ISector[]

export const oppositeDirection = (dir: LineDirections) => {
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
