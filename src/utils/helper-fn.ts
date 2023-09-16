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

export const isEqualArrays = (arr1: SA, arr2: SA) => {
    if (arr1.length !== arr2.length) return false
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false
    }
    return true
}

export const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const { clientY, clientX } =
        e.type === 'touchmove'
            ? (e as React.TouchEvent).changedTouches['0']
            : e as React.MouseEvent
    return {clientY, clientX}
}

export function getPuzzlesFromStorage() {
    return JSON.parse(localStorage.getItem(LSPuzzles) || '[]')
}

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
