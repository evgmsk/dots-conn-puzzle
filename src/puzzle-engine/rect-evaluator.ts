import {
    IEndpointsValue, IPath,
    ITPoints, SA,
} from '../constant/interfaces'
// import { DefaultColor } from "../constant/constants";
import {
    copyObj,
    defaultConnectionsWithColor,
    isDev,
    isEqualArrays, loopLimit,
    // loopLimit
} from "../utils/helper-fn";
import { PathResolver } from "./path-resolver";
import {puzzlesManager} from "../app-services/puzzles-manager";
import {Observable} from "../app-services/observable";

// import { isDev } from "../utils/helper-fn";

export class PuzzleEvaluator extends PathResolver {
    linesInterfering = {} as {[key: string]: number}
    autoResolving = false
    $autoResolving = new Observable<boolean>(this.autoResolving)

    setAutoResolving = (au = !this.autoResolving) => {
        this.autoResolving = au
        this.$autoResolving.emit(this.autoResolving)
    }

    preparePuzzleEvaluation = () => {
        this.joinPointLines = {}
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
                    puzzlesManager.saveError(`Line of ${color} color is too short. It has Less then 3 points`)
                    return console.error(line)
                }
                this.convertLastToEndpoint(line[0], line[line.length - 1])
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
                        puzzlesManager.saveError(`There are too many lines of ${color} color. Limit is 2`)
                        return false
                    }
                    lines[color] = 1
                }
            }
            if (crossLine) {
                this.addTakenPoints({
                    [point]: {
                        endpoint, connections, crossLine, joinPoint, lineEndpoints
                    }
                })
            }
        }
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
        if (this.autoResolving) return
        const lineKeys = this.prepareToResolve()
        console.warn('handle resolve', Object.keys(this.lineEndpoints), lineKeys)
        if (lineKeys.length) {
            this.linesOrder.length = 0
            this.setAutoResolving(true)
            setTimeout(this.resolvePuzzle, 300, lineKeys)
        }
    }

    findLine = (lineProps: any, key: string, crossLines = [] as SA):
        {line: SA, sRestPaths: IPath[], tRestPaths: IPath[]} => {
        this.pathCrossLines = crossLines
        this.key = key
        console.warn('while resolving puzzle', key,
            copyObj(this.altLinePaths), copyObj(this.lineEndpoints), Object.keys(this.takenPoints))
        this.forceRePath = false
        const {line: points, color} = lineProps
        const [sP, tP] = [points[0], points[points.length - 1]]
        let result = this.findPath(sP, tP, [color])
        let isEqual = isEqualArrays(result.line, points)
        console.warn('line first result', copyObj(result), isEqual, points, this.forceRePath)
        if (result.line.length >= points.length
            && this.compareCommonLinesLength(result.line.length, key) > 0) {
            this.removeAllInterfered(this.lineEndpoints[key].line.slice())
            result = this.findPath(sP, tP, [color])
            console.log('second seeking result', copyObj(this.altLinePaths), result)
            isEqual = isEqualArrays(result.line, points)
        }
        if (result.line.length === points.length && !isEqual) {
            result.line = this.lineEndpoints[key].line.slice()
            console.log('set puzzle line', copyObj(this.altLinePaths), result)
            this.removeAllInterfered(result.line)
            return result
        }
        if (result.line.length < 3
            || !this.getPoint(result.line[0])
            || !this.getPoint(result.line[result.line.length - 1])
        ) {
            console.error('no line', result)
            return {line: [], sRestPaths: [], tRestPaths: []}
        }
        if (result.line.length < points.length || this.forceRePath || isEqual) {
            return result
        }
        return result
    }

    compareCommonLinesLength = (length: number, key: string) => {
        let i = length, j = this.lineEndpoints[key].line.length
        for (const k in this.altLinePaths) {
            i += this.altLinePaths[k].line.length
            j += this.lineEndpoints[k].line.length
        }
        return i - j
    }

    resolvePuzzle = (lineKeys: SA, switchOrder = false, SO = false): any => {
        let searchOrder = SO
        let lineToFind = this.getUnresolvedLine(lineKeys.slice(0), searchOrder)
        const lim = loopLimit(300)
        while (lineToFind.key && lim()) {
            const {lineProps, key, crossLines} = lineToFind
            this.linesOrder.push(key)
            const {line, sRestPaths, tRestPaths} = this.findLine(lineProps, key, crossLines)
            if (line.length) {
                this.addFoundLine(line, this.lineEndpoints[key].color, key)
                const color = this.lineEndpoints[key].color
                this.altLinePaths[key] = {line, color, sRestPaths, tRestPaths}
                console.log('alt line added', key , line , copyObj(this.altLinePaths))
            } else { console.error('line not found', line, sRestPaths, tRestPaths); break }
            const extraLength = this.linesOrder.length > lineKeys.length
            let linesPattern = [] as SA
            if (extraLength) {
                linesPattern = this.checkLinesCircle(this.linesOrder, key)
                if (linesPattern.length) {
                    console.error('check pattern', linesPattern, key, copyObj(this.altLinePaths), this.linesOrder)
                }
            }
            searchOrder = switchOrder ? !searchOrder : searchOrder
            console.log('loop', this.linesOrder,
                Object.keys(this.altLinePaths).length < lineKeys.length, searchOrder, switchOrder)
            lineToFind = this.getUnresolvedLine(lineKeys.slice(0), searchOrder)
        }
        const foundLines = Object.values(this.altLinePaths).map(l => l.line)
        if (Object.keys(this.takenPoints).length === this.width * this.height) {
            puzzlesManager.checkNewlyCreated(true)
        } else {
            if (foundLines.length === lineKeys.length && !foundLines.filter(l => !l.length).length) {
                puzzlesManager.saveError('The puzzle has to many solutions. Please fix it and check again')
            } else {
                console.error('newly created puzzle unresolved and unchecked',
                    copyObj(this.altLinePaths), switchOrder, SO)
                this.altLinePaths = {}
                this._takenPoints = {} as ITPoints
                this.linesOrder.length = 0
                if (!switchOrder) {
                    this.setStartingPoints()
                    return this.resolvePuzzle(lineKeys, true, false)
                }
            }
        }
        this.setAutoResolving(false)
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


    checkLinesCircle = (lines: SA, nextLine: string): SA => {
        const previousIndex = lines.slice(0, -1).lastIndexOf(nextLine)
        if (previousIndex > 0) {
            const pattern = lines.slice(previousIndex + 1)
            const prevLine = lines.slice(previousIndex - pattern.length + 1, previousIndex + 1)
            for (let lineInd = pattern.length - 1; lineInd >= 0; lineInd--) {
                if (prevLine[lineInd] !== pattern[lineInd]) {
                    return []
                }
            }
            return pattern
        }
        return []
    }

    getUnresolvedLine = (sortedLines: SA, so = true) => {
        const lines = so ? sortedLines : [...sortedLines].reverse()
        console.warn('lines order', lines, sortedLines, so)
        for (const key of lines) {
            if (!this.altLinePaths[key] || !this.altLinePaths[key].line.length) {
                const crossLines = this.lineEndpoints[key].line
                    .filter(p => this.getPoint(p)?.crossLine
                        && !this.altLinePaths[key]?.tRestPaths.filter(l => l.path.includes(p)).length
                        && !this.altLinePaths[key]?.sRestPaths.filter(l => l.path.includes(p)).length
                    )

                return {key, lineProps: this.lineEndpoints[key], crossLines}
            }
        }
        return {}
    }
}
