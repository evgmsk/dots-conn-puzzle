import { DefaultColor } from "../constant/constants";
import { PuzzleCommons } from "./rect-commons";
import {defaultConnectionsWithColor, isDev} from "../helper-fns/helper-fn";
import {ILines, IPuzzle, ITakenPointProps, ITakenPoints, LineDirections} from "../constant/interfaces";


export class PuzzleResolver extends PuzzleCommons {
    puzzleName: string = ''
    difficulty: number = 0
    resolvedLines = {} as {[color: string]: boolean}

    constructor(props: IPuzzle) {
        super(props);
        this._takenPoints = props.startPoints || this.getStartPoints(props.lines)
        this._lines = props.dotsSegregatedByColor || props.lines
        this.puzzleName = props.name
        isDev() && console.log('puzzle created', this.takenPoints)
    }

    getStartPoints = (lines: ILines): ITakenPoints => {
        const takenPoints = {} as ITakenPoints
        for (const color in lines) {
            const line = lines[color]
            for (const point in line) {
                if (line[point].utmost) {
                    takenPoints[point] = this.prepareUtmostPointForResolver(line[point])
                }
            }
        }
        return takenPoints
    }

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
            return this.addNextPoint(next, prev, color)
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
            this.addNextPoint(next, prev, color)
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
            const directions = this.getLineDirections(connections, DefaultColor)
            console.warn(connections, key, this.getPoint(key), dir, directions)
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

    arePointsEqual = (point1: ITakenPointProps, point2: ITakenPointProps, color: string): boolean => {
        const topColor1 = point1.connections[LineDirections.top].color,
              topColor2 = point2.connections[LineDirections.top].color
        if (topColor1 === DefaultColor || topColor2 === DefaultColor) {
            return false
        }
        if (point2.utmost) {
            const lineDirections = this.getLineDirections(point2.connections, color)
            for (const dir of lineDirections) {
                if (point1.connections[dir].color !== point2.connections[dir].color) {
                    return false
                }
            }
            return true
        }
        // console.log('point are equal: ', topColor1 === topColor2)
        return topColor1 === topColor2
    }

    checkIfLineIsResolved = (color: string) => {
        console.log('check line resolve', color)
        const pointsOfColor = this._lines[color]
        this.resolvedLines[color] = true
        for (const point in pointsOfColor) {
            const pointAreEqual = this.getPoint(point)
                && this.arePointsEqual(this.getPoint(point), pointsOfColor[point], color)
            if (!pointAreEqual) {
                this.resolvedLines[color] = false
                console.warn('points are not equal', color, point, this.takenPoints, pointsOfColor)
                break
            }
        }
        return this.resolvedLines[color]
    }

    checkIfPuzzleIsResolved = () => {
        console.log('check puzzle resolve')
        let resolved = true
        for (const color in this._lines) {
            resolved = this.resolvedLines[color] || this.checkIfLineIsResolved(color)
            if (!resolved) {
                console.warn('not resolved', color, this.resolvedLines)
                break
            }
        }
        return resolved
    }

    puzzleFilled = () => Object.keys(this.takenPoints).length === this.width * this.height
}
//
// export const PR = new PuzzleResolver({
//     width: Width,
//     height: Height, name: '',
//     dotsSegregatedByColor: {},
//     startPoints: {}
// })
