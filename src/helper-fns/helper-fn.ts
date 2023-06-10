import {
    BaseDevUrl, BaseProdUrl,
    DefaultColor,
    DefaultConnections,
    DefaultSectors, LineColors,
    LSPuzzles,
    LSToken, LSUserPuzzles
} from "../constant/constants";
import {
    IDotSectorProps,
    ITakenPointProps,
    LineDirections,
    ISector, IDotConnections
} from "../constant/interfaces";
import {authService} from "../app-services/auth-service";

const development = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';

export const isDev = () => development

export const getSectorsData = (props: ITakenPointProps): IDotSectorProps[] => {
    // console.warn(props)
    const {connections, endpoint, crossLine, joinPoint} = props
    const singleColor = (!crossLine && !joinPoint) || joinPoint?.length === 1
    const neighborDirs = Object.keys(connections)
        .filter(key => connections[key].neighbor) as LineDirections[]
    const simpleLine = singleColor && !endpoint
        && neighborDirs.length === 2
    return defaultSectors().map((sector, i) => {
        const {neighbor, color} = connections[sector.dir]
        const turn = simpleLine
            ? neighborDirs.filter(dir => dir !== sector.dir)[0]
            : undefined
        return {
            dir: sector.dir,
            line: neighbor ? color : '',
            fill: endpoint
                ? joinPoint ? joinPoint[i] : color
                : '',
            turn,
        }
    })
}

export const getCommonColor = (colors1: string[], colors2: string[]) => {
    for (let color of colors1) {
        if (colors2.includes(color)) {
            return color
        }
    }
    return ''
}

export const haveSameColorConnection = (connections: IDotConnections, colors: string[]) => {
    for (const dir in connections) {
        if (connections[dir].neighbor && colors.includes(connections[dir].color)) {
            return true
        }
    }
    return false
}

export function getPuzzlesFromStorage() {
    return JSON.parse(localStorage.getItem(LSPuzzles) || '[]')
}

export const getPColor = (n: number) => {
    const ind = n % LineColors.length
    return LineColors[ind]
}

export function getUserPuzzlesFromStorage() {
    return JSON.parse(localStorage.getItem(LSUserPuzzles) || '[]')
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

export const getUTCDate = (date = new Date()) => {
    return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    )
}
