import { DefaultColor } from "../constant/constants";
import {
    defaultConnectionsWithColor,
    getCommonColor,
    isDev
} from "../utils/helper-fn";
import {
    IDLines, IDotConnections,
    ILines,
    IPuzzle,
    ITPoints, SA,
} from "../constant/interfaces";
import {PathResolver} from "./path-resolver";
import {Observable} from "../app-services/observable";


export class PuzzleResolver extends PathResolver {
    puzzleName: string = ''
    difficulty: number = 0
    resolved = false
    highlightedEndpoints = [] as SA
    interferedLines = {} as ILines
    $resolved = new Observable(this.resolved)

    constructor(props: IPuzzle) {
        super(props);
        this.puzzleName = props.name
        this.difficulty = props.difficulty
        this.getLines(props.points)
        this.setStartingPoints()
    }

    getCurrentLine = (color: string, prevPoint: string): SA => {
        return this.getFullLineFromAnyPoint(prevPoint, color)
    }

    getPuzzleLine = (color: string, point: string): SA => {
        for (const key in this.lines) {
            const {line, color: col} = this.lines[key]
            if (color === col && line.includes(point)) {
                return line
            }
        }
        return [] as SA
    }

    getPuzzleLineSecondEndpoint = (point: string, color: string) => {
        const puzzleLine = this.getPuzzleLine(color, point)
        return puzzleLine[0] === point
            ? puzzleLine[puzzleLine.length - 1]
            : puzzleLine[0]
    }

    resolveMouseDown = (point: string, color: string) => {
        const {connections, endpoint, crossLine, joinPoint} = this.getPoint(point) || {}
        if (!connections) return

        isDev() && console.log('resolve mouse down', point, color, connections, endpoint)
        if (endpoint) {
            return this.resolveEndPointDown(point, color, connections, crossLine, joinPoint)
        }
        this.resolveLinePointDown(point, color, connections)
    }

    resolveEndPointDown = (
        point: string,
        color: string,
        connections: IDotConnections,
        crossLine?: SA,
        joinPoint?: SA
    ) => {
        // isDev() && console.log('resolve endpoint down', point, color, neighbors, crossLine)
        if (crossLine || joinPoint) {
            const neighbors = this.getLineNeighbors(connections, DefaultColor)
            if (!neighbors.length) return
            const line = this.getFullLineFromAnyPoint(point, DefaultColor)
            console.log('line to remove', line)
            return line.length && this.removeLinePartResolver(line, DefaultColor)
        }
        const neighbors = this.getLineNeighbors(connections, color)
        this.resolveMonochromeEndpointDown(point, color, neighbors)
    }

    resolveMonochromeEndpointDown = (point: string, color: string, neighbors: SA) => {
        const secondEndpoint = this.getPuzzleLineSecondEndpoint(point, color)
        this.highlightedEndpoints.push(secondEndpoint)
        const line = neighbors.length
            ? this.getLinePartPoints(color, point)
            : (this.getLineNeighbors(secondEndpoint).length
                ? this.getLinePartPoints(color, secondEndpoint)
                : [])
        line.length && this.removeLinePartResolver(line, color)
        this.addTakenPoints({
            [point]: {...this.getPoint(point), startPoint: true},
            [secondEndpoint]: {...this.getPoint(secondEndpoint), startPoint: false}

        })
    }

    removeForkingLine = (line: SA, startPoint: string, point: string, color: string) => {
        const orderedLine = line[0] === startPoint
            ? line
            : line.reverse()
        const indexOfPoint = orderedLine.indexOf(point)
        const lineToRemove = orderedLine.slice(indexOfPoint)
        this.removeLinePartResolver(lineToRemove, color)
    }

    resolveDefaultLineDown = (point: string, color: string, neighbors: SA) => {
        const line = this.getFullLineFromAnyPoint(point, color, neighbors)
        const startPoint = this.getPoint(line[0]).crossLine
            ? line[0]
            : line[line.length - 1]
        this.removeForkingLine(line, startPoint, point, color)
    }

    resolveLinePointDown = (point: string, color: string, connections: IDotConnections) => {
        const neighbors = this.getLineNeighbors(connections, color)
        if (color === DefaultColor && neighbors.length > 1) {
            return this.resolveDefaultLineDown(point, color, neighbors)
        }
        const line = this.getFullLineFromAnyPoint(point, color, neighbors)
        const start = line[0]
        const end = line[line.length - 1]
        const startPoint = this.getPoint(start).startPoint ? start : end
        if (!this.getPoint(startPoint).startPoint && !this.getPoint(startPoint).crossLine) {
            return console.error('invalid line', line, point, color, this.totalPoints, this.getPoint(start))
        }
        const secondEndPoint = this.getPuzzleLineSecondEndpoint(startPoint, color)
        this.highlightedEndpoints.push(secondEndPoint)
        if (neighbors.length > 1) {
            this.removeForkingLine(line, startPoint, point, color)
        }
    }

    checkIfLinesHaveSameEndPoints = (line1: SA, line2: SA) => {
        const sameStart = line1[0] === line2[0] || line1[0] === line2[line2.length - 1]
        const sameEnd = line1[line1.length - 1] === line2[0]
            || line1[line1.length -1] === line2[line2.length - 1]
        return sameEnd && sameStart
    }

    resolveMouseUp = (point: string, stPoint: string) => {
        const {endpoint, crossLine, connections, joinPoint} = this.getPoint(point) || {}
        this.highlightedEndpoints.length = 0
        if (!connections) {
            console.error(point, this.totalPoints)
            return
        }
        const colors = this.getPossibleColors(stPoint)
        const color = colors.length > 1 ? DefaultColor : colors[0]
        this.interferedLines = {} as ILines
        const col = color !== DefaultColor
            ? color
            : getCommonColor(colors, this.getPossibleColors(point)) || DefaultColor
        const lineNeighbors = this.getLineNeighbors(connections, col)
        console.log('res up', endpoint, lineNeighbors, crossLine, joinPoint, point, connections, col)
        if ((endpoint && lineNeighbors.length === 1 && !crossLine) 
            || (crossLine && lineNeighbors.length === 2)
            || joinPoint
        ) {
            const line = this.getFullLineFromAnyPoint(point, col)
            const lineEnd = line[line.length - 1]
            const puzzleLine = this.getPuzzleLine(color, lineEnd)
            // console.log(line, puzzleLine, line[0] === point, this.puzzleFulfilled(), this.lines)
            if (!this.checkIfLinesHaveSameEndPoints(line, puzzleLine)) { return }

            if (line[0] === point) {
                this.resolved = this.puzzleFulfilled()
                    && this.checkIfPuzzleIsResolved().resolved;
                if (this.resolved) {
                    this.$resolved.emit(this.resolved)
                }
                // console.log(this.resolved, this.checkIfPuzzleIsResolved())
            }
        }
    }

    makeIntermediateSteps = (path: SA, color: string) => {
        const pointsToUpdate = {} as ITPoints
        console.warn(path, this.getPoint(path[path.length - 1]), this.getPoint(path[0]))
        if (this.getPoint(path[0]).endpoint) {
            this.removeLinePart(this.getFullLineFromAnyPoint(path[0], color), color)
        }
        const startPointProps = this.getPoint(path[0]) || {}
        const lastPointProps = this.getPoint(path[path.length - 1]) || {}
        let jointPoint = null as unknown as string
        const dir = this.determineDirection(path[0], path[1])
        const dirBack = this.determineDirection(path[path.length - 1], path[path.length - 2])
        let col = color

        pointsToUpdate[path[0]] = {
            ...(startPointProps || {endpoint: false}),
            connections: {
                ...startPointProps.connections,
                [dir]: {color, neighbor: path[1]}
            },
        }
        if (startPointProps.joinPoint) {
            col = DefaultColor
            jointPoint = path[0]
        }
        console.warn('utmost points to update', pointsToUpdate, lastPointProps, startPointProps, path)
        for (let step = 1; step < path.length - 1; step++) {
            const pointProps = this.getPoint(path[step])
            const dirBack = this.determineDirection(path[step], path[step - 1])
            const dir = this.determineDirection(path[step], path[step + 1])
            if (pointProps && pointProps.endpoint && !pointProps.crossLine && !pointProps.joinPoint) {
                isDev() && console.error('endpoint in the middle', step, path, pointProps)
                for (let _step = step; _step >= 0; _step--) {
                    delete pointsToUpdate[path[_step]]
                    if (!this.getPoint(path[_step])?.endpoint) {
                       this.deletePoint(path[_step])
                    } else {
                       const _pointProps = this.getPoint(path[_step])
                       const dir = this.determineDirection(path[_step], path[_step + 1])
                       const conn1 = _step !== step
                           ? {[dir]: {color: col}}
                           : {[dir]: {color: col, neighbor: path[step + 1]}}
                       const conn2 = _step > 0
                           ? {[this.determineDirection(path[_step], path[_step - 1])]: {color: col}}
                           : {}
                       const connections = {
                           ..._pointProps.connections,
                           ...conn1,
                           ...conn2
                       }
                       this.addTakenPoints({
                           [path[_step]]: {
                               ..._pointProps,
                               connections
                           }
                       })
                       isDev() && console.log(_pointProps, path[_step], connections, conn1, conn2)
                    }

                }
                continue
            }
            if (pointProps && pointProps.joinPoint) {
                isDev() && console.error('joinPoint in the middle', step, path, pointProps)
                jointPoint = path[step]
                col = DefaultColor
                pointsToUpdate[path[step]] = {
                    ...pointProps,
                    connections: {
                        ...pointProps.connections,
                        [this.determineDirection(path[step], path[step - 1])]: {
                            color, neighbor: path[step - 1]
                        },
                        [this.determineDirection(path[step], path[step + 1])]: {
                            color: col, neighbor: path[step + 1]
                        },
                    }
                }
                continue
            }
            pointsToUpdate[path[step]] = {
                ...(pointProps || {endpoint: false}),
                connections: {
                    ...(pointProps?.connections || defaultConnectionsWithColor(color)),
                    [dir]: {color: col, neighbor: path[step + 1]},
                    [dirBack]: {color: col, neighbor: path[step - 1]}
                }
            }
        }
        pointsToUpdate[path[path.length - 1]] = {
            ...(lastPointProps || {endpoint: false}),
            connections: {
                ...(lastPointProps?.connections || defaultConnectionsWithColor(color)),
                [dirBack]: {color, neighbor: path[path.length - 2]}
            }
        }
        this.addTakenPoints(pointsToUpdate)
        return jointPoint
    }

    resolveMouseEnter = (next: string, prev: string, color: string, newColor: string) => {
        const {endpoint, connections, joinPoint, crossLine} = this.getPoint(next) || {}
        if (!this.getPoint(prev)) return
        isDev() && console.log('enter', next, prev, color, newColor, connections, this.getPoint(next))
        if (!connections) {
            const {endpoint, crossLine, joinPoint} = this.getPoint(prev)
            if (endpoint) {
                const sameColorNeighbors = this.getLineNeighbors(prev, color)
                if ((sameColorNeighbors.length && !(crossLine || joinPoint))
                    || (sameColorNeighbors.length > 1 && (crossLine || joinPoint))) {
                    sameColorNeighbors.forEach(n => {
                        const lineToRemove = this.getLinePartPoints(color, n, prev)
                        this.removeLinePart(lineToRemove, color)
                    })
                }
            }
            this.updateLineStart(next, prev, color)
            return this.addNextPoint(next, prev, color)
        }
        const nextColors = this.getPossibleColors(next)
        const circleLine = color === newColor && this.checkIfPointsBelongToSameLine(next, prev, color)
        if (circleLine && circleLine?.length) {
            console.log('circle', this.interferedLines, circleLine)
            this.removeLinePartResolver(circleLine, color)
            if (Object.keys(this.interferedLines).length) {
                this.updateInterferedLine(next, prev, color)
            }
            return
        }
        if (endpoint) {
            if (color === newColor) {
                this.createJoinPoint(next, prev, color, true)
                this.updateLineStart(next, prev, color)
            }
            if (newColor && color !== newColor) {
                this.updateLineStart(next, prev, color)
                !crossLine && !joinPoint && this.checkEndpointForksToRemove(connections, next)
                this.changeColorOfGrayLine(next, prev, newColor)
            }
        }
        const nextColor = nextColors.length > 1 ? DefaultColor : nextColors[0]
        if (connections && !endpoint && !nextColors.includes(color)) {
            this.saveInterferedLine(next, nextColor)
            this.removeInterferedLine(next)
            this.addNextPoint(next, prev, color)
            this.updateLineStart(next, prev, color)
        }
    }

    checkEndpointForksToRemove = (connections: IDotConnections, point: string) => {
        for (const dir in connections) {
            const {color, neighbor} = connections[dir]
            if (neighbor) {
                const lineToRemove = this.getLinePartPoints(color, neighbor, point)
                this.removeLinePart(lineToRemove, color)
            }
        }

    }

    updateInterferedLine = (next: string, prev: string, color: string) => {
        const point = this.getPoint(next) ? next : prev
        console.log('update interfered', next, prev)
        const restOfLine = this.getFullLineFromAnyPoint(point, color)
        for (const col in this.interferedLines) {
            let interfered = false
            for (const point of restOfLine) {
                if (this.interferedLines[col][point] && this.getPossibleColors(point).length < 2) {
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
        let line: SA
        line = this.getFullLineFromAnyPoint(point, color)
        if (!line.length) {
            return
        }
        console.log('interline', point, line, this.getFullLine(line))
        this.interferedLines[color] = this.getFullLine(line)
    }

    removeLinePartResolver = (line: SA, color: string) => {
        this.removeLinePart(line, color)
    }

    determineColor = (startLinePoint: string, prevPoint: string, nextPoint: string): string => {
        const startColors = this.getPossibleColors(startLinePoint)
        const startPointProps = this.getPoint(startLinePoint)
        const {connections, joinPoint, crossLine} = this.getPoint(prevPoint) || {}
        if (!connections) return ''
        const prevColors = this.getPossibleColors(prevPoint)
        const nextPointProps = this.getPoint(nextPoint)
        const nextColors = this.getPossibleColors(nextPoint)
        console.log('determine colors', startColors, prevColors, nextColors, startPointProps?.crossLine)
        if (!nextPointProps || !nextPointProps.endpoint) {
            if (joinPoint || (crossLine && startColors.length > 1)) {
                return DefaultColor
            }
            if (prevColors.length > 1
                && prevPoint !== startLinePoint
            ) {
                return getCommonColor(prevColors, startColors) || DefaultColor
            }
            if (prevPoint === startLinePoint) {
                return startColors.length > 1 ? DefaultColor : startColors[0]
            }
            return prevColors[0]
        }
        if (nextColors.length === 1 && prevColors.length === 1 && prevColors[0] !== DefaultColor) {
            return getCommonColor(nextColors, prevColors)
        }
        if ((crossLine && nextPointProps.crossLine)
            || (prevColors[0] === DefaultColor && nextPointProps.crossLine)) {
            if (getCommonColor(prevColors, [getCommonColor(startColors, nextColors)])
                && (startColors.length === 1)) {
                return getCommonColor(prevColors, [getCommonColor(startColors, nextColors)])
            }
            return DefaultColor
        }
        if (startColors.length === 1) {
            if (prevColors[0] === DefaultColor) {
                return getCommonColor(this.getColorsOfGreyLineStart(prevPoint), nextColors)
            }
            if (nextPointProps.crossLine) {
                return startColors[0]
            }
            return getCommonColor(startColors, nextColors)
        }
        if (nextPoint === startLinePoint && prevColors.length === 1) {
            console.log('special case')
            return prevColors[0]
        }
        return getCommonColor(startColors, nextColors)
    }

    changeColorOfGrayLine = (nextPoint: string, prevPoint: string, color: string) => {
        const {connections, endpoint, joinPoint, crossLine} = this.getPoint(nextPoint)
        console.log('ch gray color', nextPoint, prevPoint, color)
        if (!endpoint) {
            return console.error('invalid method', nextPoint, this.getPoint(nextPoint))
        }
        const pointsToUpdate = {} as ITPoints
        let dir = this.determineDirection(nextPoint, prevPoint)
        pointsToUpdate[nextPoint] = {
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
            pointsToUpdate[key] = {
                    endpoint,
                    joinPoint,
                    crossLine,
                    connections: updatedConnections
            }
            return endpoint && !crossLine
        }
        this.goToLinePoint(prevPoint, nextPoint, toFn, DefaultColor)
        this.addTakenPoints(pointsToUpdate)
    }

    revealLine = () => {
        const { line, color } = this.checkIfPuzzleIsResolved()
        console.log('reveal', line)
        if (!line) {
            return true
        }
        const existedLine = this.getFullLineFromAnyPoint(line[0], color)
        if (existedLine.length > 1) {
            this.removeLinePart(existedLine, color)
        }
        this.drawLine(line, color)
        this.resolved = this.checkIfPuzzleIsResolved().resolved
        if (this.resolved) {
            this.$resolved.emit(this.resolved)
        }
    }

    checkIfPuzzleIsResolved = () => {
        for (const key in this.lines) {
            const {line, color} = this.lines[key]
            const linePart =  this.getLinePartPoints(color, line[0])
            if (linePart[linePart.length - 1] !== line[line.length - 1]
                || line.length !== linePart.length) {
                console.warn('not resolved', color, line, linePart)
                return {line, color, resolved: false}
            }
        }
        return {resolved: true}
    }
}
