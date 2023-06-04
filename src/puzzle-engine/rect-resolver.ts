import { DefaultColor } from "../constant/constants";
import { PuzzleCommons } from "./rect-commons";
import {
    copyObj,
    defaultConnectionsWithColor,
    getCommonColor,
    haveSameColorConnection,
    isDev
} from "../helper-fns/helper-fn";
import {
    ILines,
    IPuzzle,
    ITakenPointProps,
    ITakenPoints,
} from "../constant/interfaces";


export class PuzzleResolver extends PuzzleCommons {
    puzzleName: string = ''
    difficulty: number = 0
    resolved = false
    totalPoints = {} as ITakenPoints
    highlightedEndpoints = [] as string[]
    interferedLines = {} as ILines

    constructor(props: IPuzzle) {
        super(props);
        this.puzzleName = props.creator
        this.lines = this.separateDotsByLines(props.points)
        this.totalPoints = this.setStartingPoints(props.points as ITakenPoints)
        this.difficulty = props.difficulty
    }

    setStartingPoints = (points: ITakenPoints): ITakenPoints => {
        for (const point in points) {
            const pointProps = points[point]
            if (pointProps.endpoint) {
                this.addTakenPoints({
                    [point]: this.prepareEndpointForResolver(pointProps)
                })
            }
        }
        return points
    }

    updateCrossLinePointToRevealLine = (point: string, color: string): ITakenPointProps => {
        const currentProps = this.getPoint(point)
        const connections = copyObj(currentProps.connections)
        const pointProps = this.totalPoints[point]
        const lineDirections = this.getLineDirections(pointProps.connections, color)
        console.log(connections, pointProps.joinPoint)
        for (const dir in connections) {
            if (lineDirections.includes(dir)) {
                connections[dir] = {
                    color,
                    neighbor: (pointProps.connections)[dir].neighbor
                }
                if (pointProps.joinPoint) {
                    break
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

    getCurrentLine = (color: string, prevPoint: string): string[] => {
        return this.getFullLineFromAnyPoint(prevPoint, color)
    }

    getPuzzleLine = (color: string, point: string): string[] => {
        console.log('get line', color, point, this.lines)
        if (color === DefaultColor) return []
        const linesOfColor = this.lines[color]
        for (let index = 0; index < linesOfColor.length; index++) {
            if (linesOfColor[index].includes(point)) {
                return linesOfColor[index]
            }
        }
        console.error('line did not find', color, point, this.lines)
        return [] as string[]
    }

    getPuzzleLineSecondEndpoint = (point: string, color: string) => {
        const puzzleLine = this.getPuzzleLine(color, point)
        return puzzleLine[0] === point
            ? puzzleLine[puzzleLine.length - 1]
            : puzzleLine[0]
    }

    resolveMouseDown = (point: string, color: string) => {
        const {connections, endpoint, crossLine} = this.getPoint(point) || {}
        if (!connections) return
        const lineNeighbors = this.getLineNeighbors(point, color)
        isDev() && console.log('resolve mouse down', point, color, connections, endpoint)
        if (endpoint) {
            return this.resolveEndPointDown(point, color, lineNeighbors, crossLine)
        }
        this.resolveLinePointDown(point, color, lineNeighbors)
    }

    resolveEndPointDown = (
        point: string,
        color: string,
        neighbors: string[],
        crossLine?: string[],
        joinPoint?: string[]
    ) => {
        isDev() && console.log('resolve endpoint down', point, color, neighbors, crossLine)
        if (crossLine || joinPoint) {
            const line = neighbors.length ? this.getLinePartPoints(color, point) : []
            return line.length && this.removeLinePartResolver(line, color)
        }
        this.resolveMonochromeEndpointDown(point, color, neighbors)
    }

    resolveMonochromeEndpointDown = (point: string, color: string, neighbors: string[]) => {
        const secondEndpoint = this.getPuzzleLineSecondEndpoint(point, color)
        this.highlightedEndpoints.push(secondEndpoint)

        const line = neighbors.length
            ? this.getLinePartPoints(color, point)
            : (this.getLineNeighbors(secondEndpoint).length
                ? this.getLinePartPoints(color, secondEndpoint)
                : [])
        console.log('resolve monochrome', neighbors, point, color, line)
        line.length && this.removeLinePartResolver(line, color)
        this.addTakenPoints({
            [point]: {...this.getPoint(point), startPoint: true},
            [secondEndpoint]: {...this.getPoint(secondEndpoint), startPoint: false}

        })
        console.log('dsfssd', point, this.getPoint(point))
    }

    removeForkingLine = (line: string[], startPoint: string, point: string, color: string) => {
        const orderedLine = line[0] === startPoint
            ? line
            : line.reverse()
        const indexOfPoint = orderedLine.indexOf(point)
        const lineToRemove = orderedLine.slice(indexOfPoint)
        this.removeLinePartResolver(lineToRemove, color)
    }

    resolveDefaultLineDown = (point: string, color: string, neighbors: string[]) => {
        const line = this.getFullLineFromAnyPoint(point, color, neighbors)
        const startPoint = this.getPoint(line[0]).crossLine
            ? line[0]
            : line[line.length - 1]
        this.removeForkingLine(line, startPoint, point, color)
    }

    resolveLinePointDown = (point: string, color: string, neighbors: string[]) => {
        if (color === DefaultColor && neighbors.length > 1) {
            return this.resolveDefaultLineDown(point, color, neighbors)
        }
        const line = this.getFullLineFromAnyPoint(point, color, neighbors)
        const start = line[0]
        const end = line[line.length - 1]
        const startPoint = this.getPoint(start).startPoint ? start : end
        if (!this.getPoint(startPoint).startPoint) {
            return console.error('invalid line', line, point, color, this.totalPoints, this.getPoint(start))
        }
        const secondEndPoint = this.getPuzzleLineSecondEndpoint(startPoint, color)
        this.highlightedEndpoints.push(secondEndPoint)
        if (neighbors.length > 1) {
            this.removeForkingLine(line, startPoint, point, color)
        }
    }

    checkIfLinesHaveSameEndPoints = (line1: string[], line2: string[]) => {
        const sameStart = line1[0] === line2[0] || line1[0] === line2[line2.length - 1]
        const sameEnd = line1[line1.length - 1] === line2[0]
            || line1[line1.length -1] === line2[line2.length - 1]
        return sameEnd && sameStart
    }

    getUnresolvedLine = () => {
        for (const color in this.lines) {
            const linesOfColor = this.lines[color]
            for (const line of linesOfColor) {
                const currentLine = this.getFullLineFromAnyPoint(line[0], color)
                if (currentLine.length !== line.length
                    || !this.checkIfLinesHaveSameEndPoints(line, currentLine)) {
                    return {line, color}
                }
            }
        }
        return {}
    }

    resolveMouseUp = (point: string, color: string) => {
        const {endpoint, crossLine, connections} = this.getPoint(point) || {}
        if (!connections) {
            console.error(point, color, this.totalPoints)
            return
        }
        this.highlightedEndpoints.length = 0
        this.interferedLines = {} as ILines
        const lineNeighbors = this.getLineNeighbors(connections, color)
        if ((endpoint && lineNeighbors.length === 1 && !crossLine) 
            || (crossLine && lineNeighbors.length === 2)) {
            const line = this.getFullLineFromAnyPoint(point, color)
            const lineEnd = line[line.length - 1]
            const puzzleLine = this.getPuzzleLine(color, lineEnd)
            if (!this.checkIfLinesHaveSameEndPoints(line, puzzleLine)) { return }
            if (line[0] === point) {
                this.resolved = this.puzzleFulfilled()
                    && this.checkIfPuzzleIsResolved().resolved;
            }
        }
    }

    checkIfCanJoin = (next: string, prev: string, color: string, possColors?: string[]): string => {
        const {connections, endpoint, joinPoint, crossLine} = this.getPoint(next) || {}
        console.log('check join', color, endpoint, connections, possColors, this.getLineNeighbors(prev))
        if (!connections
            || !endpoint
            || this.getLineNeighbors(prev).includes(next)) {
                return color
        }
        const colors = joinPoint || crossLine || this.getColors(connections)
        if (haveSameColorConnection(connections, possColors || colors)) {
            return ''
        }
        const commonColor = possColors?.length
            ? getCommonColor(colors, possColors)
            : (colors.includes(color) ? color : '')
        // console.log('can join', next, prev, color,
        //     possColors, commonColor, joinPoint, crossLine, endpoint)
        if (joinPoint || (color !== DefaultColor && !crossLine)) {
            return commonColor
        }
        if (color === DefaultColor && endpoint && !joinPoint && !crossLine) {
            return colors[0]
        }
        return color
    }

    resolveMouseEnter = (next: string, prev: string, color: string, newColor?: string) => {
        const {endpoint, connections, joinPoint} = this.getPoint(next) || {}
        isDev() && console.log('enter', next, prev, color, connections, newColor, joinPoint)
        if (!connections) {
            this.updateLineStart(next, prev, color)
            return this.addNextPoint(next, prev, color)
        }
        const circleLine = color === newColor && this.checkIfPointsBelongToSameLine(next, prev, color)
        if (circleLine && circleLine?.length) {
            this.removeLinePartResolver(circleLine, color)
            if (Object.keys(this.interferedLines).length) {
                this.updateInterferedLine(next, prev, color)
            }
            return
        }
        this.updateLineStart(next, prev, color)
        if (endpoint) {
            if (color === newColor) {
                this.createJoinPoint(next, prev, color, true)
            }
            if (newColor && color !== newColor) {
                this.changeColorOfGrayLine(next, prev, newColor)
            }
        }
        const nextColors = this.getColors(connections)
        if (connections && !endpoint && !nextColors.includes(color)) {
            this.saveInterferedLine(next, nextColors[0])
            this.removeInterferedLine(next)
            this.addNextPoint(next, prev, color)
            // currentLine.push(next)
            // this.currentLines[color][currentLine[0]] = {points: currentLine}
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
        line = this.getFullLineFromAnyPoint(point, color)
        if (!line.length) {
            return
        }
        this.interferedLines[color] = this.getFullLine(line)
    }

    removeLinePartResolver = (line: string[], color: string) => {
        console.log('remove line part', line, color)
        this.removeLinePart(line, color, this.updateCrossLineRemovingFork)
    }

    removeLinePointResolver = (
        line: string[],
        color: string,
        i: number,
    ) => {

    }

    changeColorOfGrayLine = (nextPoint: string, prevPoint: string, color: string) => {
        const {connections, endpoint, joinPoint, crossLine} = this.getPoint(nextPoint)
        if (!endpoint) {
            return console.error('invalid method', nextPoint, this.getPoint(nextPoint))
        }
        const updatedPoints = {} as ITakenPoints
        let dir = this.determineDirection(nextPoint, prevPoint)
        updatedPoints[nextPoint] = {
            connections: {
                ...connections,
                [dir]: {color, neighbor: prevPoint}
            },
            endpoint,
            joinPoint,
            crossLine
        }
        const toFn = (key: string) => {
            const {connections, crossLine, endpoint, joinPoint} = this.getPoint(key)
            const directions = this.getLineDirections(connections, DefaultColor)
            const updatedConnections = !endpoint
                ? defaultConnectionsWithColor(color)
                : connections
            directions.forEach(d => {
                updatedConnections[d] = {color, neighbor: connections[d].neighbor}
            })
            updatedPoints[key] = {
                    endpoint,
                    joinPoint,
                    crossLine,
                    connections: updatedConnections
            }
            return endpoint
        }
        this.goToLinePoint(prevPoint, nextPoint, toFn, DefaultColor)
        this.addTakenPoints(updatedPoints)
    }

    checkIfPuzzleIsResolved = () => {
        let resolved = true
        for (const color in this.lines) {
            const linesOfColor = this.lines[color]
            for (const line of linesOfColor) {
                const linePart =  this.getLinePartPoints(color, line[0])
                const lastPoint = linePart[linePart.length - 1]
                if (!lastPoint || lastPoint !== line[line.length - 1]) {
                    console.warn('not resolved', color, lastPoint, line)
                    return {line, color, resolved: false}
                }
            }
        }
        if (resolved) {

        }
        return {resolved}
    }
}
