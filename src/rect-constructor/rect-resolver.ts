import { DefaultColor } from "../constant/constants";
import { PuzzleCommons } from "./rect-commons";
import {defaultConnectionsWithColor, getCommonColor, isDev} from "../helper-fns/helper-fn";
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
                if (line[point].utmost && !takenPoints[point]) {
                    takenPoints[point] = this.prepareUtmostPointForResolver(line[point])
                }
            }
        }
        return takenPoints
    }

    lineContinuationIsImpossible = (nextPoint: string, prevPoint: string, color: string) => {
        const {connections, joinPoint, utmost} = this.getPoint(prevPoint) || {}
        if (!connections) return true
        if (!utmost) return false
        const possible = ((joinPoint &&
                (color === DefaultColor
                    || joinPoint.includes(color)))
                || this.getColors(prevPoint).includes(color))
        console.log(possible, joinPoint, color, color === DefaultColor)
        return !possible
    }


    checkIfCanJoin = (next: string, prev: string, color: string) => {
        const {connections, utmost, joinPoint, crossLine} = this.getPoint(next) || {}
        if (!connections || !utmost) return true
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

    resolveMouseEnter = (next: string, prev: string, color: string, posColors: string[]) => {
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
        console.log('enter rr', next, prev, color, sameLine, sameColor, connections, posColors, utmost)
        if (sameLine) {
            return this.removeLineCirclePart(prev, next, color)
        }
        this.updateLineStart(next, prev, color, true)
        const commonColor = (joinPoint && joinPoint.includes(color) && color)
                || (color === DefaultColor && getCommonColor(colors, posColors))

        if (utmost) {
            console.log('utmost', color, color !== DefaultColor,  commonColor, colors, posColors)
            return  color !== DefaultColor
                ? this.createJoinPoint(next, prev, color, sameColor)
                : (commonColor && this.changeColorOfGrayLine(next, prev, commonColor))
        }
        if (connections && !utmost && !sameColor) {
            this.removeInterferedLines(next)
            this.addNextPoint(next, prev, color)
        }
    }

    changeColorOfGrayLine = (nextPoint: string, prevPoint: string, color: string) => {
        const {connections, utmost, joinPoint, crossLine} = this.getPoint(nextPoint)
        console.warn('gray', nextPoint, connections, color, utmost)
        if (!utmost) {
            return console.error('invalid method', nextPoint, this.getPoint(nextPoint))
        }
        let dir = this.determineDirection(nextPoint, prevPoint)

        this.addTakenPoints({[nextPoint]: {
                connections: {
                    ...connections,
                    [dir]: {color, neighbor: prevPoint}
                },
                utmost,
                joinPoint,
                crossLine
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
        this.goToLinePoint(prevPoint, nextPoint, toFn, DefaultColor)
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
                if (point1.connections[dir].color !== point2.connections[dir].color
                || point1.connections[dir].neighbor !== point2.connections[dir].neighbor) {
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
