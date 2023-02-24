import { Height, Width } from "../constant/constants";
import { IConnection, IDotConnections, ITakenPointProps, ITakenPoints } from "../constant/interfaces";
import { copyObj, defaultSectors } from "../helper-fns/helper-fn";
import { LinedRectBase } from "./rect-base";

export class PuzzleCommons extends LinedRectBase {

    continueLine = (key: string, key2: string, color: string, addPoints?: Function) => {
        const addTakenPoints = addPoints || this.addTakenPoints
        const dir = this.determineDirection(key, key2)
        const sectors = defaultSectors()
        const index = this.getSectorIndex(dir, sectors)
        sectors[index] = {dir, neighbor: key2}
        const point = {
            [key]: {
                utmost: false,
                connections: {
                    [color]: sectors
                } 
            }
        } as ITakenPoints
        addTakenPoints(point)
    }

    createJoinPoint = (
        key: string,
        key2: string,
        color: string,
        addPoints = this.addTakenPoints,
        sameColor = false) => {
    
            const existedPoint = this.getPoint(key)
            const dir = this.determineDirection(key, key2)
            const connections = {} as IDotConnections
            const joinSectors = copyObj(existedPoint.connections[color] || []) as IConnection[]
            const index = sameColor ? this.getSectorIndex(dir, joinSectors) : -1
            console.log('create join', key, key2, color, this.takenPoints, sameColor)
            console.warn('index', index, dir, joinSectors)
            joinSectors[index >= 0 ? index : joinSectors.length] = {dir, neighbor: key2}
            for (const col in existedPoint.connections) {
                const sectors = existedPoint.connections[col]
                connections[col] = index < 0 && col !== color 
                    ? sectors.filter(d => d.dir !== dir)
                    : sectors
            }
            connections[color] = joinSectors        
            const updatedPointProps = { 
                utmost: !sameColor || existedPoint.utmost,
                connections 
            }
            addPoints({[key]: updatedPointProps})
    }

    
    removeLinePart(
        from: string,
        to: string,
        color: string,
        delPoint = this.deletePoint,
        addPoints = this.addTakenPoints) {
        console.warn('remove', from, to)
        const toFn = (key: string) => {
            const neighbor = this.haveNeighbor(key, to, color)
            delPoint(from)
            if (neighbor) {
                console.warn(neighbor)
                let {connections, utmost} = this.getPoint(to)
                const sectors = connections[color].map(s => {
                    const dir = s.dir
                    return s.neighbor === key ? {dir} : s
                })
                connections = {
                    ...connections,
                    [color]: sectors
                }
                
                addPoints({[to]: {utmost, connections}})
            }
            return neighbor
        }
        this.goToLinePoint(from, to, color, toFn)
    }


    updateLineStart = (key: string, key2: string, color: string, addPoints?: Function) => {
        const addTakenPoints = addPoints || this.addTakenPoints
        const point = this.getPoint(key2)
        if (!point || !point.connections) return
        const {connections, utmost} = point
        const dir = this.determineDirection(key2, key)
        const sectors = connections[color]
        console.warn(key, point, color, connections)
        const index = this.getSectorIndex(dir, sectors)
        sectors[index] = { dir, neighbor: key }
        connections[color] = sectors
        const newPoint = {
            [key2]: {
                utmost,
                connections
            }
        } as ITakenPoints 
        addTakenPoints(newPoint)
    }

    cutNeighborsInStartPoints = (key: string, points: ITakenPoints): ITakenPointProps => {
        const startPoint = copyObj(points[key]) as ITakenPointProps
        for (const color in startPoint.connections) {
            const sectors = startPoint.connections[color]
            startPoint.connections[color] = sectors.map(sec => ({dir: sec.dir}))
        }
        return startPoint
    }

    removeInterferedLines = (key: string, delPoint?: Function, addPoints?: Function) => {
        const deletePoint = delPoint || this.deletePoint
        const addTakenPoints = addPoints || this.addTakenPoints
        const connections = this.getPoint(key).connections
        const colors = Object.keys(connections)
        deletePoint(key)
        let lastDeleted = key
        const fn = (pointKey: string, col: string) => {
            const point = this.getPoint(pointKey)
            console.log(point, pointKey, this.takenPoints, lastDeleted)
            if (!point.utmost) { 
                deletePoint(pointKey)
                lastDeleted = pointKey
            } else {
                const dir = this.determineDirection(pointKey, lastDeleted)
                const sectors = point.connections[col].map(sec => 
                    sec.dir === dir ? {dir} : sec)
                const connections = {...point.connections, [col]: sectors}
                addTakenPoints({[pointKey]: {...point, connections}} as ITakenPoints)
            }
            return point.utmost
        }
        for (const col of colors) {
            const neighbors = connections[col].map(c => c.neighbor)
            neighbors.forEach(n => {
                n && this.goToLinePoint(n, key, col, fn)
            })
        }
    }
}

export const puzzleResolver = new PuzzleCommons({width: Width, height: Height})
