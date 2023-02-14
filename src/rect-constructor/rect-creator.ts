import { Height, Width } from "../constant/constants";
import { ITakenPointProps, ITakenPoints } from "../constant/interfaces";
import { LinedRectBase } from "./rect-base";


export class RectCreator extends LinedRectBase {

    resolveMouseUp = (key1: string, key2: string, color: string) => {
       
    }

    resolveNewPointDown(key: string, color: string) {
        console.log(key, color, this.rect, this.rect)
        const neighbors = this.rect[key].neighbors
        console.warn('new down rect', key, color)
        const sameColorNeighbors = neighbors.filter(k => {
            return ((this._takenPoints[k] || {}).connections || {})[color]
        })
        if (!sameColorNeighbors.length) {
            const connections = {[color]: []}
            this._takenPoints[key] = {
                utmost: true,
                connections
            } as ITakenPointProps
            this._utmostPoints[color] = this._utmostPoints[color]
                ? [...this._utmostPoints[color], {key, connections}]
                : [{key, connections}]
        } else {
            const directions = sameColorNeighbors.map(d => this.determineDirection(key, d))
            this._takenPoints[key] = {
                utmost: false,
                connections: {[color]: directions}
            } as ITakenPointProps
        }
    }

    resolveMouseDown = (key: string, color: string, sp?: string) => {
        console.warn('down rect', key, color)
        if (!sp && !this._takenPoints[key]) {
            this.resolveNewPointDown(key, color)
        }
        
    }

    resolveMouseEnter = (key: string, key2: string, color: string, joinPoint = false) => {
        const existedPoint = this._takenPoints[key]
        if (!existedPoint) {
            this.continueLine(key, key2, color)
            this.updateLineStart(key, key2, color)
        } else if (joinPoint) {
            this.createJoinPoint(key, key2, color)
            this.updateLineStart(key, key2, color)
        } else {
            
        }
    }

    createJoinPoint = (key: string, key2: string, color: string) => {
        console.log('create join point')
        const existedPoint = this._takenPoints[key] 
        const existedConnection = existedPoint.connections[color] 
        const dir = this.determineDirection(key, key2)
        const connections = {
            ...existedPoint.connections,
            [color]: (existedConnection ? [...existedConnection, dir] : [dir])
        }
        const updatedPoint = {...existedPoint, utmost: true, connections}
        this._takenPoints[key] = updatedPoint
    }

    updateLineStart = (key: string, key2: string, color: string) => {
        const {utmost, connections} = Object.assign({}, this._takenPoints[key2]) as ITakenPointProps
        const point = {
            [key2]: {
                utmost,
                connections: {
                    ...connections,
                    [color]: [...connections[color], this.determineDirection(key2, key)]
                } 
            }
        } as ITakenPoints 
        this.addTakenPoints(point)
    }

    continueLine = (key: string, key2: string, color: string) => {
        const point = {
            [key]: {
                utmost: false,
                connections: {
                    [color]: [this.determineDirection(key, key2)]
                } 
            }
        } as ITakenPoints     
        this.addTakenPoints(point)
    }

    resolveMouseLeave = (key: string, color: string) => {

    }
}

export const rectCreator = new RectCreator({width: Width, height: Height / 2})
