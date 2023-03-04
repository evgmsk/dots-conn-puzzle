import {DefaultColor, Height, Width} from "../constant/constants";
import { PuzzleCommons } from "./rect-commons";
import {defaultConnectionsWithColor} from "../helper-fns/helper-fn";
import {IDotConnections} from "../constant/interfaces";

export class PuzzleResolver extends PuzzleCommons {

    checkIfCanJoin = (next: string, prev: string, color: string) => {
        const {connections, utmost, joinPoint, crossLine} = this.getPoint(next) || {}
        if (!utmost) return true
        const properJoin = joinPoint && joinPoint.includes(color)
        const colors = this.getColors(connections)
        const sameColor = colors.includes(color)
        const defColor = color === DefaultColor
        const properUtmost = (utmost &&
            ((sameColor && !defColor)
                || (!sameColor && defColor)))
            || crossLine
        return utmost && (properJoin || properUtmost)
    }

    resolveMouseEnter = (next: string, prev: string, color: string) => {
        console.log('enter rr', next, prev, color, this.takenPoints)
        const {utmost, connections, joinPoint} = this.getPoint(next) || {}
        if (!connections) {
            this.updateLineStart(next, prev, color, true)
            return this.continueLine(next, prev, color)
        }
        const colors = this.getColors(connections)
        const sameColor = colors.includes(color)
        const sameLine = connections
            && sameColor
            && this.checkIfSameLinePoints(next, prev, color).same
        console.log('enter rr 2', sameLine, sameColor, connections)
        if (sameLine) {
            return this.removeLineCirclePart(prev, next, color)
        }
        this.updateLineStart(next, prev, color, true)
        if (utmost && (!joinPoint || joinPoint.includes(color))) {
            return color !== DefaultColor
                ? this.createJoinPoint(next, prev, color, sameColor)
                : this.changeColorOfGrayLine(next, prev)
        }
        if (connections && !utmost && !sameColor) {
            this.removeInterferedLines(next)
            this.continueLine(next, prev, color)
        }
    }

    changeColorOfGrayLine = (nextPoint: string, prevPoint: string) => {
        const {connections, utmost, joinPoint, crossLine} = this.getPoint(nextPoint)
        if (!utmost || joinPoint || crossLine) {
            return console.error('invalid method', nextPoint, this.getPoint(nextPoint))
        }
        let dir = this.determineDirection(nextPoint, prevPoint)
        const color = connections[dir].color
        console.warn('gray', nextPoint, connections, color)
        this.addTakenPoints({[nextPoint]: {
                connections: {
                    ...connections,
                    [dir]: {color, neighbor: prevPoint}
                },
                utmost
            }
        })
        const toFn = (key: string) => {
            const {connections, crossLine, utmost, joinPoint} = this.getPoint(key)
            console.warn(connections, DefaultColor, key, this.getPoint(key), dir)
            const directions = this.getLineDirections(connections)
            const updatedConnections = !utmost
                ? defaultConnectionsWithColor(color)
                : connections
            directions.forEach(d => {
                updatedConnections[d] = {color, neighbor: connections[d].neighbor}
            })
            this.addTakenPoints({
                [key]: {
                    utmost,
                    joinPoint,
                    crossLine,
                    connections: updatedConnections
                }
            })
            return utmost
        }
        this.goToLinePoint(prevPoint, nextPoint, toFn)
    }

    getLineLength = (start: string, prev: string, color: string) => {
        let lineLength = 0
        const stopFn = (key: string) => {
            lineLength += 1
            const point = this.getPoint(key) || {}
            return key !== start && point.utmost 
        }
        this.goToLinePoint(start, prev, stopFn)
        return lineLength
    }
}

export const rr = new PuzzleResolver({width: Width, height: Height})
