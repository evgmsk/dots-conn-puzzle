import {
    IEndpointsValue,
    ITPoints, SA,
} from '../constant/interfaces'
import { DefaultColor } from "../constant/constants";
import {
    copyObj,
    defaultConnectionsWithColor,
    getCommonColor,
    isDev,
    isEqualArrays,
    loopLimit
} from "../utils/helper-fn";
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
        console.warn('prepare evaluation', Object.keys(this.takenPoints))
        const passed = {} as {[key: string]: boolean}
        const lines = {} as {[key: string]: number}
        for (const point in this.rect) {
            const {
                colors, connections, neighbors, endpoint, joinPoint, crossLine
            } = this.checkPoint(point) || {}
            if (passed[point]) { continue }
            if (!connections) { return console.error('not connections', colors, point) }
            const lineEndpoints = [] as SA
            for (const color of colors) {
                const lNs = colors.length > 1
                    ? this.getLineNeighbors(connections, color)
                    : neighbors
                const line = this.getFullLineFromAnyPoint(point, color, lNs, false, false)
                if (!line.length || line.length < 3) {
                    this.lineError = `Line of ${color} color is too short. It has Less then 3 points`
                    return console.error(line)
                }
                this.convertLastToEndpoint(line[0])
                this.convertLastToEndpoint(line[line.length - 1])
                line.forEach(p => { passed[p] = true })
                if (endpoint && !crossLine) {
                    lineEndpoints.push((point === line[0] ? line[line.length - 1] : line[0]))
                }
                if (crossLine) {
                    lineEndpoints.push(line[0])
                    lineEndpoints.push(line[line.length - 1])
                }
                if (this.addLineEndpoint(line, color)) {
                    if (lines[color] && lines[color] > 1) {
                        this.lineError = `There are too many lines of ${color} color. Limit is 2`
                        console.error(this.lineError, lines)
                        return false
                    }
                    lines[color] = 1
                }
            }
            if (endpoint) {
                this.addTakenPoints({
                    [point]: {
                        endpoint, connections, crossLine, joinPoint, lineEndpoints
                    }
                })
            }
        }
        // console.log('prepared', this.lineEndpoints)
        return true
    }

    addLineEndpoint = (points: SA, color: string) => {
        if (this.checkEndpoints(points[0], points[points.length - 1])) {
            return false
        }
        const [first, last] = [points[0], points[points.length - 1]]
        for (const point of points) {
            const pointProps = this.getPoint(point)
            if (!pointProps) {
                console.error('line point not found')
                continue
            }
            const toConcat = pointProps.endpoint && !pointProps.crossLine
                ? (point === first ? last : first)
                : [first, last]
            const lineEndpoints = (pointProps.lineEndpoints || []).concat(toConcat)
            this.addTakenPoints({[point]: {
                ...pointProps,
                lineEndpoints
            }})
        }
        const {pairKey, ...endpoints} = this.getLineEndpoints(points, color)
        this.lineEndpoints[pairKey] = endpoints
        return true
    }

    getLineEndpoints = (points: SA, color: string): IEndpointsValue & {pairKey: string} => {
        const firstPointCoords = points[0].split('-').map(i => parseInt(i))
        const secondPointCoords = points[points.length - 1].split('-').map(i => parseInt(i))
        const pairKey = `${points[0]}_${points[points.length - 1]}`

        return {
            pairKey,
            coords1: firstPointCoords,
            coords2: secondPointCoords,
            intervals: {
                x: firstPointCoords[0] - secondPointCoords[0],
                y: firstPointCoords[1] - secondPointCoords[1]
            },
            color,
            meddling: 0,
            line: points
        }
    }

    evaluatePuzzle = () => {
        let puzzleInterfering = 0
        this.linesInterfering = {}
        for (const key1 in this.lineEndpoints) {
            for (const key2 in this.lineEndpoints) {
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
        ) {
            // console.warn('no interfering', line1, line2)
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

    addFoundLine = (line: SA, color: string, key: string) => {
        const endPs = key.split('_')
        if (line[0] !== endPs[0] && line[0] !== endPs[1]) {
            console.error('invalid line key', line, key)
        }

        isDev() && console.log('found', line, color, key)
        const lineEndpoints = key.split('_')
        const lineToAdd = {} as ITPoints
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
                lineToAdd[point] = {
                    ...existedPoint,
                    connections: {
                        ...existedPoint.connections,
                        ...lineConnections
                    }
                }
            } else if (existedPoint) {
                lineToAdd[point] =
                    this.updateCrossLinePoint(point, line[i-1], line[i+1], color)
                // console.warn('resolve crossline', lineToShow, point, existedPoint)
            } else {
                lineConnections[this.determineDirection(point, neighbors[1])] = {
                    color, neighbor: neighbors[1]
                }
                lineToAdd[point] = {
                    endpoint: false,
                    connections: {
                        ...defaultConnectionsWithColor(color),
                        ...lineConnections
                    },
                    lineEndpoints
                }
            }
        }
        this.addTakenPoints(lineToAdd)
    }

    handleAutoResolvePuzzle = () => {
        const lineKeys = this.prepareToResolve()
        console.warn('handle resolve', Object.keys(this.lineEndpoints), lineKeys)
        if (lineKeys.length) {
            this.linesOrder.length = 0
            setTimeout(this.resolvePuzzle, 100, lineKeys)
        }
    }

    resolvePuzzle = (lineKeys: SA) => {
        const lim = loopLimit(50)
        while (Object.keys(this.altLinePaths).length < lineKeys.length && lim()) {
            const {endPoints, key, crossLines} = this.getUnresolvedLine(lineKeys.slice(0))
            this.pathCrossLines = crossLines || []
            console.warn('while resolving puzzle',
                endPoints, key, copyObj(this.altLinePaths),
                [...this.fixedLines], [...this.linesOrder])
            this.forceRePath = false
            if (!key) break
            const {line: points, color} = endPoints
            const [sP, tP] = [points[0], points[points.length - 1]]
            let line = this.findPath(sP, tP, [color], key)
            const isEqual =isEqualArrays(line, points)
            if (line.length >= points.length && !isEqual){
                this.pathCrossLines = crossLines || []
                this.forceRePath = true
                line = this.findPath(sP, tP, [color], key)
            }
            if (line.length < 3
                || !this.getPoint(line[0])
                || !this.getPoint(line[line.length - 1])
            ) {
                if (!this.forceRePath) {
                    console.error('need turn on force re-path', copyObj(this.altLinePaths), copyObj(this.fixedLines), copyObj(this.linesOrder))
                }
                return console.error('unresolved problem', line, this.altLinePaths, this.fixedLines, key)
            }
            if (line.length < points.length || this.forceRePath || isEqual) {
                this.linesOrder.push(key)
                this.addFoundLine(line, color, key)
            }
            const extraLength = this.linesOrder.length > lineKeys.length
            let lineToFix = [] as SA, linesPattern = [] as SA
            if (extraLength) {
                linesPattern = this.checkLinesCircle(this.linesOrder, key)
                lineToFix = linesPattern.filter(l => l !== key && !this.fixedLines.includes(l))
                console.error('check pattern', linesPattern,
                    lineToFix, extraLength, key, {...this.altLinePaths})
            }
            if (lineToFix.length) {
                this.fixedLines.push(lineToFix[0]!)
                linesPattern.length = 0
                console.error('add fixed line', linesPattern, this.fixedLines)
            }
            // else if (linesPattern.length && fixedLines.length) {
            //     console.error('all lines fixed', linesPattern, fixedLines)
            //     const lineToImprove = fixedLines.shift()!
            //     const {color, line} = this.altLines[lineToImprove]
            //     this.removeLinePart(line, color)
            //     this.addFoundLine(this.lineEndpoints[lineToImprove].line, color, lineToImprove)
            // }
            // this.linesOrder.push(key)
            // this.addFoundLine(line, color, key)
        }
    }

    prepareToResolve = () => {
        if (!Object.keys(this.lineEndpoints).length) {
            console.error('impossible resolve')
            return []
        }
        const lineKeys = Object.keys(this.lineEndpoints).sort((a, b) => {
            return this.lineEndpoints[a].line.length - this.lineEndpoints[b].line.length
        })
        if (Object.keys(this.totalPoints).length) {
            if (Object.keys(this.totalPoints).length >= Object.keys(this.takenPoints).length) {
                this.addTakenPoints(this.totalPoints)
                this.totalPoints = {} as ITPoints
                this.lineEndpoints = {}
                this.altLinePaths = {}
                return []
            }
        }
        this.totalPoints = this.takenPoints
        this._takenPoints = {} as ITPoints
        this.setStartingPoints()
        return lineKeys
    }

    checkPattern = (stInd: number, lines: SA): SA => {
        const pattern = lines.slice(stInd)
        const lineHead = lines.slice(0, stInd)
        for (let lineInd = 1; lineInd < pattern.length; lineInd++) {
            if (lineHead[lineHead.length - lineInd] !== pattern[pattern.length - lineInd]) {
                return []
            }
        }
        return pattern
    }

    checkLinesCircle = (lines: SA, nextLine: string): SA => {
        const length = lines.length
        const previousIndex = lines.lastIndexOf(nextLine)
        if (previousIndex > length / 2) {
            const pattern = this.checkPattern(previousIndex, lines)
            if (pattern.length) {
                return pattern
            }
        }
        return []
    }

    getUnresolvedLine = (sortedLines: SA) => {
        for (const key of sortedLines) {
            if (!this.altLinePaths[key]) {
                const crossLines = this.lineEndpoints[key].line
                    .filter(p => this.getPoint(p)?.crossLine)
                return {key, endPoints: this.lineEndpoints[key], crossLines}
            }
        }
        return {}
    }
}
