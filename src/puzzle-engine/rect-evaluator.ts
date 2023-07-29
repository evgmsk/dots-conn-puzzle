import {
    IEndpointsValue,
    ITPoints, SA,
} from '../constant/interfaces'
import { DefaultColor } from "../constant/constants";
import {defaultConnectionsWithColor, getCommonColor, isDev} from "../utils/helper-fn";
import { PathResolver } from "./path-resolver";
// import { isDev } from "../utils/helper-fn";

export class PuzzleEvaluator extends PathResolver {
    linesInterfering = {} as {[key: string]: number}
    lineError = ''

    checkPoint = (point: string, TP = false) => {
        const {endpoint, connections} = TP ? this.totalPoints[point] : this.getPoint(point)
        const {crossLine, joinPoint} = endpoint
            ? this.prepareEndpointForResolver({endpoint, connections}, TP)
            : {crossLine: undefined, joinPoint: undefined}
        const colors = this.getColors(connections)
        const neighbors = this.getLineNeighbors(connections, '', TP)
        if ((!(crossLine || joinPoint) && colors.length !== 1)
            || (endpoint && !(crossLine || joinPoint) && neighbors.length !== 1)
            || colors.includes(DefaultColor)
            || (!joinPoint && colors.length > 2)
        ) {
            this.lineError = `${colors[0]} line broken`
            return {}
        }
        return {endpoint, crossLine, colors, connections, joinPoint, neighbors}
    }

    preparePuzzleEvaluation = () => {
        console.log('prepare evaluation', this.takenPoints)
        const passed = {} as {[key: string]: boolean}
        const lines = {} as {[key: string]: number}
        for (const point in this.takenPoints) {
            const {
                colors,
                connections,
                neighbors,
                endpoint,
                joinPoint,
                crossLine
            } = this.checkPoint(point, )
            if (endpoint) {
                this.addTakenPoints({
                    [point]: {
                        endpoint, connections, crossLine, joinPoint
                    }
                })
            }
            if (passed[point]) { continue }
            if (!connections) {return console.error('not connections', colors, point)}
            for (const color of colors) {
                const lineNeighbors = colors.length > 1
                    ? this.getLineNeighbors(connections, color, )
                    : neighbors
                const line = this.getFullLineFromAnyPoint(point, color, lineNeighbors, )
                if (!line.length || line.length < 3) {
                    this.lineError = `Line of ${color} color is too short. It has Less then 3 points`
                    return console.error(line)
                }
                const start = line[0]
                const end = line[line.length - 1]
                this.convertLastToEndpoint(start)
                this.convertLastToEndpoint(end)
                line.forEach(p => { passed[p] = true })
                if (this.addLineEndpoint([start, end], color)) {
                    if (lines[color] && lines[color] > 1) {
                        this.lineError = `There are too many lines of ${color} color. Limit is 2`
                        console.error(this.lineError, lines)
                        return false
                    }
                    lines[color] = 1
                }
            }
        }
        console.log('prepared', this.lineEndpoints)
        return true
    }

    addLineEndpoint = (points: SA, color: string) => {
        if (this.lineEndpoints[`${points[0]}_${points[1]}`]
            || this.lineEndpoints[`${points[1]}_${points[0]}`]) {
            return false
        }
        const {pairKey, ...endpoints} = this.getLineEndpoints(points, color)
        this.lineEndpoints[pairKey] = endpoints
        return true
    }

    getLineEndpoints = (points: SA, color: string): IEndpointsValue & {pairKey: string} => {
        const firstPointCoords = points[0].split('-').map(i => parseInt(i))
        const secondPointCoords = points[1].split('-').map(i => parseInt(i))
        return {
            pairKey: `${points[0]}_${points[1]}`,
            coords1: firstPointCoords,
            coords2: secondPointCoords,
            intervals: {
                x: firstPointCoords[0] - secondPointCoords[0],
                y: firstPointCoords[1] - secondPointCoords[1]
            },
            color,
            meddling: 0,
            keys: points
        }
    }

    evaluatePuzzle = () => {
        let puzzleInterfering = 0
        this.linesInterfering = {}
        let step = 0
        for (const key1 in this.lineEndpoints) {
            for (const key2 in this.lineEndpoints) {
                // console.log(key1, key2, this.linesInterfering)
                if (key1 === key2
                    || this.linesInterfering[`${key1}_${key2}`]
                    || this.linesInterfering[`${key2}_${key1}`]) {
                    continue
                }

                const key = `${key1}_${key2}`

                const line1 = this.lineEndpoints[key1]
                const line2 = this.lineEndpoints[key2]
                this.linesInterfering[key] = this.twoLinesInterfering(line1, line2)

                puzzleInterfering += this.linesInterfering[key]
                this.lineEndpoints[key1].meddling += this.linesInterfering[key]
                this.lineEndpoints[key2].meddling += this.linesInterfering[key]
                console.log(step++, key, this.linesInterfering[key], puzzleInterfering)
            }
        }
        // console.log('eval puzzle', this.linesInterfering, this.lineEndpoints)
        return Math.round(puzzleInterfering / Object.keys(this.lineEndpoints).length)
    }

    cosOfLines = (line1: IEndpointsValue, line2: IEndpointsValue) => {
        const linesMultiply = (line1.intervals.x * line2.intervals.x) +
            (line1.intervals.y   * line2.intervals.y)
        const line1Abs = Math.sqrt(line1.intervals.x * line1.intervals.x
            + line1.intervals.y * line1.intervals.y)
        const line2Abs = Math.sqrt(line2.intervals.x * line2.intervals.x
            + line2.intervals.y * line2.intervals.y)
        const cos = linesMultiply / line1Abs / line2Abs
        return Math.min(Math.max(cos, -1), 1)
    }

    twoLinesInterfering = (line1: IEndpointsValue, line2: IEndpointsValue) => {
        const { coords1: [l1x1, l1y1], coords2: [l1x2, l1y2] } = line1
        const { coords1: [l2x1, l2y1], coords2: [l2x2, l2y2] } = line2
        const line1X = [l1x1, l1x2].sort()
        const line2X = [l2x1, l2x2].sort()
        const line1Y = [l1y1, l1y2].sort()
        const line2Y = [l2y1, l2y2].sort()
        if ((line1X[1] < line2X[0]
            || line1Y[1] < line2Y[0]
            || line2Y[1] < line1Y[0]
            || line2X[1] < line1X[0])
            // && !interfering1
        ) {
            console.warn('no interfering', line1, line2)
            return 0
        }
        const cos = this.cosOfLines(line1, line2)
        const sin = Math.sqrt((1 - cos * cos))
        const line1Length = Math.sqrt((l1x1 - l1x2) * (l1x1 - l1x2) + (l1y1 - l1y2) * (l1y1 - l1y2))
        const line2Length = Math.sqrt((l2x1 - l2x2) * (l2x1 - l2x2) + (l2y1 - l2y2) * (l2y1 - l2y2))
        const interfering1 = ((line1Length + line2Length) * sin)
        const intersectionX0 = Math.max(line1X[0], line2X[0])
        const intersectionX1 = Math.min(line1X[1], line2X[1])
        const intersectionY0 = Math.max(line1Y[0], line2Y[0])
        const intersectionY1 = Math.min(line1Y[1], line2Y[1])
        const interfering2 = Math.abs((intersectionX1 - intersectionX0) * cos)
            + Math.abs((intersectionY1 - intersectionY0) * sin)
        // console.log('interfering', line1, line2, sin, interfering1, interfering2)
        return Math.max(interfering1, interfering2)
    }

    addFoundLine = (line: SA, color: string) => {
        isDev() && console.log('found', line, color)
        const lineToShow = {} as ITPoints
        for (let i = 0; i < line.length; i++) {
            const point = line[i]
            const utmost = i === 0 || i === line.length - 1
            const neighbors = !utmost
                ?  [line[i -1 ], line[i + 1]]
                : (i === 0 ? line.slice(1,2) : line.slice(-2, -1))

            const existedPoint = this.getPoint(point)
            const lineConnections = {
                [this.determineDirection(point, neighbors[0])]: {
                    color, neighbor: neighbors[0]
                }
            }
            if (utmost) {
                lineToShow[point] = {
                    ...existedPoint,
                    connections: {
                        ...existedPoint.connections,
                        ...lineConnections
                    }
                }
            } else if (existedPoint) {
                    lineToShow[point] = this.updateCrossLinePoint(point, color, this.totalPoints[point])
            } else {
                lineConnections[this.determineDirection(point, neighbors[1])] = {
                    color, neighbor: neighbors[1]
                }
                lineToShow[point] = {
                    endpoint: false,
                    connections: {
                        ...defaultConnectionsWithColor(color),
                        ...lineConnections
                    }
                }
            }
        }
        this.addTakenPoints(lineToShow)
    }

    resolvePuzzle = () => {
        const lineKeys = Object.keys(this.lineEndpoints).sort((a, b) => {
            return this.lineEndpoints[a].meddling - this.lineEndpoints[b].meddling
        })
        if (!Object.keys(this.lineEndpoints).length) {
            return console.error('impossible resolve')
        }
        console.log('handle resolve', Object.keys(this.totalPoints))
        if (Object.keys(this.totalPoints).length) {
            if (Object.keys(this.totalPoints).length >= Object.keys(this.takenPoints).length) {
                this.addTakenPoints(this.totalPoints)
                this.totalPoints = {} as ITPoints
                return
            }
        }
        this.totalPoints = this.takenPoints
        this._takenPoints = {} as ITPoints
        this.setStartingPoints()
        while (Object.keys(this.altLines).length < lineKeys.length) {
            const {endPoints, key} = this.getUnresolvedLine(lineKeys)
            if (!key) break
            const {keys, color} = endPoints
            let line: SA
            line = this.findPath(keys[0], keys[1], [color], 'strict').concat(keys[1])
            if (line.length === 1) {
                line = this.findPath(keys[0], keys[1], [color], 'strict', true)
                    .concat(keys[1])
            }
            const lineColor = getCommonColor(
                this.getColors(this.getPoint(line[0]).connections),
                this.getColors(this.getPoint(line[line.length - 1]).connections)
            )
            if (line.length > 1) {
                this.addFoundLine(line, lineColor)
                this.altLines[key] = { line, color }
            } else {
                console.error('unresolved problem', line, keys, color)
                break
            }
        }
    }

    getUnresolvedLine = (sortedLines: SA) => {
        for (const key of sortedLines) {
            if (!this.altLines[key]) {
                return {key, endPoints: this.lineEndpoints[key]}
            }
        }
        return {}
    }
}
