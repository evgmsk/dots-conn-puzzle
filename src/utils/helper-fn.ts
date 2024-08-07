import {
    DefaultColor,
    DefaultConnections,
    DefaultSectors, LineColors,
    LSPuzzles,
    LSUserPuzzles
} from "../constant/constants";
import {
    IDotSectorProps,
    ITakenPProps,
    LineDirections,
    ISector, SA
} from "../constant/interfaces";

import React from "react";

const development = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';

export const isDev = () => development

export const getSectorsData = (props: ITakenPProps): IDotSectorProps[] => {
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

export const checkIfPointNeighbor = (neighbors: SA, target: string,) => neighbors.includes(target)

export const getCommonColor = (colors1: SA, colors2: SA) => {
    for (let color of colors1) {
        if (colors2.includes(color)) {
            return color
        }
    }
    return ''
}

export const loopLimit = (lim = 100) => {
    return () => {
        lim--
        return lim > 0
    }
}

export const square = (a: string) =>
    a.split('x').reduce((acc, j) => acc * parseInt(j), 1)

export const isEqualArrays = (arr1: SA, arr2: SA) => {
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false
    }
    return true
}

export const getCoordinates = (e: React.MouseEvent | React.TouchEvent | Partial<React.MouseEvent>) => {
    const { clientY, clientX } =
        e.type === 'touchmove'
            ? (e as React.TouchEvent).changedTouches['0']
            : e as React.MouseEvent
    return {clientY, clientX}
}

export function getPuzzlesFromStorage() {
    return JSON.parse(localStorage.getItem(LSPuzzles) || '[]')
}

export const isContainClass = (e: Element, className: string) => e.classList.contains(className)

export const getYearMonthDay = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`
}

export const haveCommonPoint = (line1: SA, line2: SA) => {
    const map = {} as {[k: string]: number}
    for (const point of line1.slice(0, -1)) {
        if (map[point]) {
            return true
        }
        map[point] = 1
    }
    for (const point of line2.slice(0, -1)) {
        if (map[point]) {
            return true
        }
        map[point] = 1
    }
    return false
}

export const getFullD = (d:number) => d < 10 ? '0' + d : d

export const getPColor = (n: number) => {
    const ind = n % LineColors.slice(1).length
    return LineColors.slice(1)[ind]
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

export const copyObj = (obj: any): any => {
    if (typeof obj !== 'object') return obj
    // const copy = Array.isArray(obj) ? [] as any[] : {} as {[key: string]: any}
    // for (const prop in obj) {
    //     const value = obj[prop]
    //     if (typeof value === 'object') {
    //         copy[prop] = copyObj(value)
    //     } else {
    //         return  Array.isArray(obj) ? obj.slice() : Object.assign({}, obj)
    //     }
    // }
    return JSON.parse(JSON.stringify(obj))
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
