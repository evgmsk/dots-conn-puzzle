import { DefaultColor } from "../constant/constants";
import { PuzzleCommons } from "./rect-commons";
import {copyObj, defaultConnectionsWithColor, getCommonColor, isDev} from "../helper-fns/helper-fn";
import {
    ILines,
    IPuzzle, ISLines,
    ITakenPointProps,
    ITakenPoints, LineAndIndex,
} from "../constant/interfaces";


export class PuzzleResolver extends PuzzleCommons {
    puzzleName: string = ''
    difficulty: number = 0
    currentLines = {} as {[color: string]: {start: string, resolved: number}[]}
    resolved = false
    totalPoints = {} as ITakenPoints
    highlightedEndpoints = [] as string[]
    interferedLines = {} as ILines

    constructor(props: IPuzzle) {
        super(props);
        this.getStartPoints(props.points as ITakenPoints)
        this.puzzleName = props.name
        this.lines = props.lines
        this.totalPoints = props.points!
        this.presetColors(props.lines)
        isDev() && console.log('puzzle created', this.takenPoints)
    }

    getStartPoints = (points: ITakenPoints): ITakenPoints => {
        for (const point in points) {
            const pointProps = points[point]
            if (pointProps.endpoint) {
                this.addTakenPoints({
                    [point]: this.prepareEndpointForResolver(pointProps)
                })
            }
        }
        return this.totalPoints
    }

    presetColors = (lines: ISLines) => {
        for (const color in lines) {
            this.currentLines[color] = lines[color].map(l => ({resolved: 0, start: ''}))
        }
    }

    updateCrossLineNeighbors = (point: string, color: string): ITakenPointProps => {
        const currentProps = this.getPoint(point)
        const connections = copyObj(currentProps.connections)
        const pointProps = this.totalPoints[point]
        const lineDirections = this.getLineDirections(pointProps.connections, color)
        for (const dir in connections) {
            if (lineDirections.includes(dir)) {
                connections[dir] = {
                    color,
                    neighbor: (pointProps.connections)[dir].neighbor
                }
            }
        }
        return {...currentProps, connections}
    }

    lineContinuationIsImpossible = (nextPoint: string, prevPoint: string, color: string) => {
        const {connections, joinPoint, endpoint} = this.getPoint(prevPoint) || {}
        if (!connections) return true
        if (!endpoint || this.getColors(nextPoint).includes(color)) return false
        const possible = ((joinPoint &&
                (color === DefaultColor
                    || joinPoint.includes(color)))
                || this.getColors(connections).includes(color))
        console.log('line continue', possible, joinPoint, color, color === DefaultColor)
        return !possible
    }

    setHighlightedEndpoints = (point: string, color: string, index: number) => {
        console.log(this.currentLines[color][index].start === point, this.currentLines)
        const {joinPoint, connections} = this.getPoint(point) || {}
        if (!connections || (joinPoint && color !== DefaultColor)) {
            console.error('invalid props to highlight endpoints', index, color, point, this.takenPoints)
            return
        }
        const colors = joinPoint || this.getColors(connections)
        colors.forEach(col => {
            const {line} = this.getLineAndIndex(col, point)
            const endPoint = line[0] === point
                ? line[line.length - 1]
                : line[0]
            this.highlightedEndpoints.push(endPoint)
        })
        console.log('high', colors, point, this.highlightedEndpoints, )
    }

    getLineAndIndex = (color: string, point: string): LineAndIndex => {
        const linesOfColor = this.lines[color]
        const {endpoint, connections, crossLine} = this.getPoint(point) || {}
        const neighbors = this.getLineNeighbors(connections, color)
        if (endpoint && !crossLine) {
            for (let index = 0; index < linesOfColor.length; index++) {
                if (linesOfColor[index].includes(point)) {
                    return {index, line: linesOfColor[index]}
                }
            }
        } else {
            const linePart1 = this.getLinePartPoints(color, neighbors[0], point)
            const linePart2 = neighbors[1]
                ? this.getLinePartPoints(color, neighbors[1], point)
                : []
            const lastPoint1 = linePart1[linePart1.length - 1]
            const lastPoint2 = linePart2[linePart2.length - 1]
            const endpoint = this.getPoint(lastPoint1).endpoint
                ? lastPoint1
                : lastPoint2
            for (let index = 0; index < linesOfColor.length; index++) {
                if (linesOfColor[index].includes(endpoint)) {
                    return {index, line: linesOfColor[index]}
                }
            }
        }
        console.error('line not found', color, point, this.lines)
        return {} as {index: number, line: string[]}
    }

    resolveMouseDown = (point: string, color: string) => {
        const {connections, endpoint, crossLine, joinPoint} = this.getPoint(point) || {}
        if (!connections) return
        const lineNeighbors = this.getLineNeighbors(point, color)
        let index = -(color === DefaultColor)
        isDev() && console.log('resolve mouse down', point, color, connections, index, endpoint)
        if (index < 0) {
            if (crossLine) { return }
            if (joinPoint) {
                this.currentLines[color] = [{start: point, resolved: 0}]
                return this.resolveJoinPointDown(point)
            }
            return this.removeForks(point, color)
        }
        if (endpoint && !(joinPoint || crossLine)) {
            const index = this.getLineAndIndex(color, point).index
            this.currentLines[color][index] = {start: point, resolved: 0}
            if (lineNeighbors[0]) {
                this.removeLineFork(lineNeighbors[0], point, color)
                this.updateLastPoint(point, lineNeighbors[0])
            }
        } else {
            const start = this.currentLines[color][this.getLineAndIndex(color, point).index].start
            this.removeForks(point, color, start)
        }
        this.setHighlightedEndpoints(point, color, index)
    }

    getUnresolvedLine = () => {
        for (const color in this.lines) {
            for (let i = 0; i < this.lines[color].length; i++) {
                if (!this.currentLines[color][i] || !this.currentLines[color][i].resolved) {
                    this.currentLines[color][i] = {start: '', resolved: 1}
                    return {line: this.lines[color][i], index: i, color}
                }
            }
        }
        return {}
    }

    resolveJoinPointDown = (point: string) => {

    }

    resolveMouseUp = (point: string, color: string) => {
        const {endpoint, crossLine, connections} = this.getPoint(point) || {}
        if (!connections) {
            console.error(point, color, this.totalPoints)
            return
        }
        this.highlightedEndpoints.length = 0
        this.interferedLines = {} as ILines
        if (endpoint && !crossLine && this.getLineNeighbors(connections).length) {
            const {start, end} = this.getLineFromEndpoint(point, color, false)
            if (!end) {return}
            const lastPointProps = this.getPoint(end)
            if (start === point && lastPointProps.endpoint && !lastPointProps.crossLine) {
                this.resolved = this.puzzleFulfilled() && this.checkIfPuzzleIsResolved();
            }
        }
    }

    checkIfCanJoin = (next: string, prev: string, color: string, possColors?: string[]): string => {
        const {connections, endpoint, joinPoint, crossLine} = this.getPoint(next) || {}
        console.log('check join', color, endpoint, connections, possColors, this.getLineNeighbors(prev))
        if (!connections
            || !endpoint
            || this.getLineNeighbors(prev).includes(next)) return color

        if (color === DefaultColor && !possColors) {
            console.error('invalid props check join', next, prev, color, possColors, this.takenPoints)
            return ''
        }
        if (color !== DefaultColor && crossLine) {
            return color
        }
        const colors = joinPoint || crossLine || this.getColors(connections)
        const commonColor = possColors?.length
            ? getCommonColor(colors, possColors)
            : (colors.includes(color) ? color : '')
        console.log('can join', next, prev, color,
            possColors, commonColor, joinPoint, crossLine, endpoint)
        return commonColor
    }

    updateResolvedLines = (color: string, endpoint: string) => {
        if (color === DefaultColor) {
            return
        }
        const linePart =  this.getLinePartPoints(color, endpoint)
        const lastPoint = linePart[linePart.length - 1]
        const linesOfColor = this.lines[color]
        let index = 0, line = [] as string[]
        for (let i = 0; i < linesOfColor.length; i++) {
            if (linesOfColor[i].includes(endpoint)) {
                line = linesOfColor[i]
                index = i
            }
        }
        if ((line[0] === endpoint && line[line.length - 1] === lastPoint)
            || (line[0] === lastPoint && line[line.length - 1] === endpoint)) {
            this.currentLines[color][index].resolved = .5
        }
    }

    resolveMouseEnter = (next: string, prev: string, color: string, newColor?: string) => {
        const {endpoint, connections, joinPoint} = this.getPoint(next) || {}
        if (!connections) {
            this.updateLineStart(next, prev, color, true)
            return this.addNextPoint(next, prev, color)
        }
        const sameLine = color === newColor && this.checkIfSameLinePoints(next, prev, color).same
        console.log('enter', next, prev, color, sameLine, connections, newColor, joinPoint)
        if (sameLine) {
            this.removeLineCirclePart(prev, next, color)
            if (Object.keys(this.interferedLines).length) {
                this.updateInterferedLine(next, prev, color)
            }
            return
        }
        this.updateLineStart(next, prev, color, true)
        if (endpoint) {
            if (color === newColor) {
                this.createJoinPoint(next, prev, color, true)
                this.updateResolvedLines(color, next)
            }
            newColor && color !== newColor && this.changeColorOfGrayLine(next, prev, newColor)
        }
        const nextColors = this.getColors(connections)
        if (connections && !endpoint && !nextColors.includes(color)) {
            this.saveInterferedLine(next, nextColors[0])
            this.removeInterferedLine(next)
            this.addNextPoint(next, prev, color)
        }
    }

    updateInterferedLine = (current: string, prev: string, color: string) => {
        const lineNeighbors = this.getLineNeighbors(current, color)
        let start, passed
        if (lineNeighbors.length === 2) {
            start = current
            passed = prev
        } else {
            passed = current
            start = lineNeighbors[0]
        }
        const line = this.getLinePartPoints(color, start, passed)
        const pointsToCheck = line.slice(0, -1)
        console.log('update interfered', start, passed, color, this.interferedLines, line, pointsToCheck, current)
        for (const col in this.interferedLines) {
            let interfered = false
            for (const point of pointsToCheck) {
                if (this.interferedLines[col][point]) {
                    interfered = true
                    break
                }
            }
            if (!interfered) {
                this.addTakenPoints(this.interferedLines[col])
                delete this.interferedLines[col]
            }
        }
    }

    saveInterferedLine = (point: string, color: string) => {
        console.log('save interfered', point, color)
        let line: string[]
        if (!this.currentLines[color].length) {
            return
        }
        const neighbors = this.getLineNeighbors(point, color)
        line = this.getLineFromMiddlePoint(neighbors, point, color, false).line as string[]
        if (!line || !line.length) {
            return
        }
        this.interferedLines[color] = this.getFullLine(line)
    }

    changeColorOfGrayLine = (nextPoint: string, prevPoint: string, color: string) => {
        const {connections, endpoint, joinPoint, crossLine} = this.getPoint(nextPoint)
        console.warn('gray', nextPoint, connections, color, endpoint)
        if (!endpoint) {
            return console.error('invalid method', nextPoint, this.getPoint(nextPoint))
        }
        let dir = this.determineDirection(nextPoint, prevPoint)
        this.addTakenPoints({[nextPoint]: {
                connections: {
                    ...connections,
                    [dir]: {color, neighbor: prevPoint}
                },
                endpoint,
                joinPoint,
                crossLine
            }
        })
        const toFn = (key: string) => {
            const {connections, crossLine, endpoint, joinPoint} = this.getPoint(key)
            const directions = this.getLineDirections(connections, DefaultColor)
            console.warn(connections, key, this.getPoint(key), dir, directions)
            const updatedConnections = !endpoint
                ? defaultConnectionsWithColor(color)
                : connections
            directions.forEach(d => {
                updatedConnections[d] = {color, neighbor: connections[d].neighbor}
            })
            this.addTakenPoints({
                [key]: {
                    endpoint,
                    joinPoint,
                    crossLine,
                    connections: updatedConnections
                }
            })
            return endpoint
        }
        this.goToLinePoint(prevPoint, nextPoint, toFn, DefaultColor)
    }

    // arePointsEqual = (point1: ITakenPointProps, point2: ITakenPointProps, color: string): boolean => {
    //     const colors1 = this.getColors(point1.connections),
    //           colors2 = this.getColors(point2.connections)
    //     if (colors1.includes(DefaultColor)
    //         || colors1.length !== colors2.length
    //         || !colors1.includes(color)) {
    //         return false
    //     }
    //     const lineDirections = this.getLineDirections(point2.connections, color)
    //     for (const dir of lineDirections) {
    //         if (point1.connections[dir].color !== point2.connections[dir].color
    //         || point1.connections[dir].neighbor !== point2.connections[dir].neighbor) {
    //             return false
    //         }
    //     }
    //     return true
    // }

    checkIfLineResolved = (color: string) => {

    }

    checkIfPuzzleIsResolved = () => {
        let resolved = true
        for (const color in this.lines) {
            const linesOfColor = this.lines[color]
            for (const line of linesOfColor) {
                const linePart =  this.getLinePartPoints(color, line[0])
                const lastPoint = linePart[linePart.length - 1]
                if (!lastPoint || lastPoint !== line[line.length - 1]) {
                    console.warn('not resolved', color, this.currentLines, lastPoint, line)
                    return false
                }
            }
        }
        return resolved
    }
}
