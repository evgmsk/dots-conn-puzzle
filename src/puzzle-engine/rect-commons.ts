import { DefaultColor } from "../constant/constants";
import { ITakenPointProps, ITakenPoints, LineDirections } from "../constant/interfaces";
import {checkIfPointNeighbor, defaultConnectionsWithColor, isDev, oppositeDirection} from "../utils/helper-fn";
import { LinedRectBase } from "./rect-base";


export class PuzzleCommons extends LinedRectBase {

    prepareEndpointForResolver = (point: ITakenPointProps): ITakenPointProps => {
        const {endpoint, connections} = point
        const colors = this.getColors(connections)
        const lineNeighbors = this.getLineNeighbors(point.connections)
        const firstColorNeighbors = this.getLineNeighbors(point.connections, colors[0])
        const crossLine = lineNeighbors.length === 4
            && firstColorNeighbors.length === 2
            && colors.length === 2
            ? colors
            : undefined
        const joinPoint = endpoint && !crossLine && lineNeighbors.length > 1
            ? colors
            : undefined
        const monochrome = crossLine ? DefaultColor : colors[0]
        const _connections = !joinPoint
            ? defaultConnectionsWithColor(monochrome)
            : {
                ...defaultConnectionsWithColor(joinPoint[0]),
                [LineDirections.right]: {color: joinPoint[1]},
                [LineDirections.left]: {color: joinPoint[2] || joinPoint[0]},
                [LineDirections.bottom]: {color: joinPoint[3] || joinPoint[0]},
            }
        return {
            connections: _connections,
            crossLine,
            joinPoint,
            endpoint
        }
    }

    addNextPoint = (nextPoint: string, prevPoint: string, color: string) => {
        if (!nextPoint || !prevPoint) {
            console.error('invalid props to determine direction in add next fun', nextPoint, prevPoint)
            return
        }
        const dir = this.determineDirection(nextPoint, prevPoint)
        const point = {
            [nextPoint]: {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(color),
                    [dir]: {color, neighbor: prevPoint}
                }
            }
        }
        // console.log('continue line', nextPoint, prevPoint, point)
        this.addTakenPoints(point)
    }

    createJoinPoint = (
        nextPoint: string,
        prevPoint: string,
        color: string,
        sameColor = false) => {
            const {connections, endpoint, joinPoint, crossLine} = this.getPoint(nextPoint)
            if (!nextPoint || !prevPoint) {
                console.error('invalid props to determine direction in create join fun', nextPoint, prevPoint)
                return
            }
            const dir = this.determineDirection(nextPoint, prevPoint)
            // isDev() && console.log('create join', nextPoint)
            const updatedPointProps = { 
                endpoint: !sameColor || endpoint,
                connections: {
                    ...connections,
                    [dir]: {color, neighbor: prevPoint}
                },
                joinPoint,
                crossLine
            }
            this.addTakenPoints({[nextPoint]: updatedPointProps})
    }

    tryContinueLine = (next: string, prev: string, color: string): string => {
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(prev) || {}
        if (!connections) {
            console.error('invalid props for the dots connecting')
            return ''
        }
        const nextNeighbors = this.rect[next].neighbors
        const prevNeighbors = this.rect[prev].neighbors
        for (const neighbor of nextNeighbors) {
            if (prevNeighbors.includes(neighbor) && !this.getPoint(neighbor)) {
                const dirToPrev = this.determineDirection(neighbor, prev)
                this.addTakenPoints({
                    [neighbor]: {
                        endpoint: false,
                        connections: {
                            ...defaultConnectionsWithColor(color),
                            [dirToPrev]: {color, neighbor: prev}
                        }
                    },
                    [prev]: {
                        endpoint,
                        crossLine,
                        joinPoint,
                        connections: {
                            ...connections,
                            [oppositeDirection(dirToPrev)]: {
                                color, neighbor: neighbor
                            }
                        }
                    }
                })
                return neighbor
            }
        }
        return ''
    }

    isEndpoint = (key: string, point: ITakenPointProps, color: string) => {
        const last = (point.endpoint && !point.crossLine)
        isDev() && last && console.log('endpoint point', point, last, color)
        return last ? key : ''
    }

    removeLinePart = (line: string[], color: string, fn = this.updateCrossLineRemovingFork) => {
        if (line.length <= 1) return
        for (let i = 0; i < line.length; i++) {
            const point = line[i]
            const pointProps = this.getPoint(point)
            if (!pointProps) {return}
            const {connections, endpoint, crossLine, joinPoint} = pointProps
            const lineNeighbors = this.getLineNeighbors(connections, color)
            const colors = crossLine || joinPoint || this.getColors(connections)
            const lastPoints = !i || i === line.length - 1
            if (lastPoints && (lineNeighbors.length > 1 || endpoint)) {
                const prev = i === 0 ? line[i + 1] : line[i - 1]
                const dir = this.determineDirection(line[i], prev)
                const Props = {
                    ...pointProps,
                    connections: {
                        ...connections,
                        [dir]: {color: crossLine ? DefaultColor : color}
                    }
                }
                // console.log(prev, line[i], i, line, dir, Props)
                this.addTakenPoints({[point]: Props})
            } else if (!endpoint) {
                this.deletePoint(point)
            } else if (crossLine || (colors.length === 2 && !lastPoints)) {
                fn(color, point, pointProps)
            }
        }
    }

    validateFreeCell = (point: string, path: string[], color: string) => {
        const totalNeighbors = this.rect[point].neighbors
        let pathNeighbors = 0
        for (const n of totalNeighbors) {
            if (path.includes(n)) {
                if (pathNeighbors) {
                    return false
                }
                pathNeighbors += 1
                continue
            }
            const {crossLine} = this.getPoint(n) || {}
            if (crossLine) {
                return !path.includes(n) ? crossLine.includes(color) : true
            }
        }
        return true
    }

    getFreeCells = (
        point: string,
        path: string[],
        passed: Partial<ITakenPoints> = this.takenPoints,
        color = DefaultColor,
        target = ''
    ) => {
        const totalNeighbors = this.rect[point]?.neighbors
        if (!totalNeighbors) return []
        if (totalNeighbors.includes(target)) return ['fin', point]
        const freeCells = [] as string[]
        for (const nei of totalNeighbors) {
            if (path.includes(nei)) continue
            const neiProps = passed[nei]
            if (neiProps) {
                if (neiProps.crossLine && neiProps.crossLine.includes(color)) return [nei]
                continue
            }
            const validCell = this.validateFreeCell(nei, path.concat(point), color)
            console.warn(nei, path, point, totalNeighbors, validCell, neiProps)
            if (!neiProps && validCell) {
                freeCells.push(nei)
            }
        }
        return freeCells
    }

    findPath = (startPoint: string, targetPoint: string, color: string) => {
        const targetProps = this.getPoint(targetPoint)
        if (targetProps) {
            const targetColors = targetProps.crossLine
                || targetProps.joinPoint
                || this.getColors(targetProps.connections)
            if (!targetColors.includes(color)) {
                return []
            }
        }
        let passed = Object.assign({}, this.takenPoints) as Partial<ITakenPoints>
        let path = [startPoint]
        let neighbors = this.getFreeCells(startPoint, path, passed, color, targetPoint)
        console.warn(neighbors, path)
        if (!neighbors.length) {
            return []
        }
        if (neighbors[0] === 'fin') {
            console.log(neighbors, path)
            return path
        }
        passed[startPoint] = passed[startPoint] || {
            connections: defaultConnectionsWithColor(DefaultColor),
            endpoint: false
        }
        while (neighbors.length) {
            const nextPointProps = this.getNearestPoint(path, passed, neighbors, targetPoint, color)
            console.warn('qq', neighbors, path, nextPointProps.path, nextPointProps.neighbors)
            if (nextPointProps.finished) {
                return nextPointProps.path
            }
            if (!nextPointProps.neighbors.length) {
                return []
            }
            if (checkIfPointNeighbor(nextPointProps.neighbors, targetPoint)) {
                return nextPointProps.path
            }
            path = nextPointProps.path
            passed = nextPointProps.passed
            neighbors = nextPointProps.neighbors
        }
        return []
    }

    getDistantBetweenPoints = (point1: string, point2: string, diag = true) => {
        const ps1 = this.rect[point1].point
        const ps2 = this.rect[point2].point
        return !diag
            ? Math.abs(ps1[0] - ps2[0]) + Math.abs(ps1[1] - ps2[1])
            : Math.sqrt((ps1[0] - ps2[0]) * (ps1[0] - ps2[0]) + (ps1[1] - ps2[1]) * (ps1[1] - ps2[1]))
    }

    getNearestPoint = (
        path: string[],
        passed: Partial<ITakenPoints>,
        startPointNeighbors: string[],
        targetPoint: string,
        color: string
    ): {path: string[], passed: Partial<ITakenPoints>, neighbors: string[], finished: boolean} => {
        const _passed = Object.assign({}, passed) as Partial<ITakenPoints>
        const _path = Object.assign([], path)
        const next = {pathPoint: '', dist: Infinity, neighbors: [] as string[], finished: false}
        if (startPointNeighbors.length === 1) {
            next.neighbors = this.getFreeCells(startPointNeighbors[0], path, _passed, color, targetPoint)
            if (next.neighbors[0] === 'fin') {
                return {
                    path: _path.concat(startPointNeighbors[0]),
                    passed: _passed,
                    neighbors: next.neighbors,
                    finished: true
                }
            }
            next.pathPoint = next.neighbors.length ? startPointNeighbors[0] : ''
            _passed[startPointNeighbors[0]] = _passed[startPointNeighbors[0]] || {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true
            }
        } else {
            for (const n of startPointNeighbors) {
                const dist = this.getDistantBetweenPoints(n, targetPoint)
                const nextFree = this.getFreeCells(n, path, _passed, color, targetPoint)
                if (nextFree[0] === 'fin') {
                    _path.push(n)
                    return {path: _path, passed, neighbors: [], finished: true}
                }
                if (next.dist > dist && nextFree.length) {
                    next.dist = dist
                    next.pathPoint = n
                    next.neighbors = nextFree
                } else if (!nextFree.length) {
                    _passed[n] = _passed[n] || {
                        connections: defaultConnectionsWithColor(DefaultColor),
                        endpoint: true
                    }
                }
            }
        }
        if (next.pathPoint) {
            const dir = this.determineDirection(next.pathPoint, path[path.length - 1])
            const crossLine = _passed[next.pathPoint]?.crossLine
            _passed[next.pathPoint] = {
                connections: {
                    ...defaultConnectionsWithColor(color),
                    [dir]: {color, neighbor: next.pathPoint}
                },
                endpoint: !!crossLine,
                crossLine
            }
            _path.push(next.pathPoint)
            // console.error(startPointNeighbors, _path)
            return {path: _path, passed: _passed, neighbors: next.neighbors, finished: false}
        }
        startPointNeighbors.forEach(n => {
            _passed[n] = _passed[n] || {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true
            }
        })
        return this.getNearestFromPreviousSteps(path, _passed, targetPoint, color)
    }

    getNearestFromPreviousSteps = (
        path: string[],
        passed: Partial<ITakenPoints>,
        targetPoint: string,
        color: string
    ): {path: string[], passed: Partial<ITakenPoints>, neighbors: string[], finished: boolean} => {
        let _path = path.slice(0, -1)
        while (_path.length) {
            const lastP = _path[_path.length - 1]
            const prevStepFreeNeighbors = this.getFreeCells(lastP, _path, passed, color, targetPoint)
            if (prevStepFreeNeighbors[0] === 'fin') {
                return {finished: true, path: _path, passed, neighbors: []}
            }
            if (prevStepFreeNeighbors) {
                return this.getNearestPoint(_path, passed, prevStepFreeNeighbors, targetPoint, color)
            }
            _path = _path.slice(0, -1)
        }
        return {path, passed, neighbors: [], finished: false}
    }

    removeExtraLine = (next: string, prev: string, color: string) => {
        const line = this.getLinePartPoints(color, next, prev)
        this.removeLinePart(line, color)
    }

    updateCrossLineRemovingFork = (color: string, key: string, point: ITakenPointProps) => {
        const {crossLine, connections, endpoint, joinPoint} = point
        if (!point.connections) {
            console.error('invalid props to update crossLine', point, color)
            return
        }
        for (const dir in connections) {
            const sec = connections[dir]
            if (sec.color === color) {
                connections[dir] = {color: DefaultColor}
            }
        }
        this.addTakenPoints({[key]: {endpoint, joinPoint, crossLine, connections}})
    }

    updateLineStart = (
        nextPoint: string,
        prevPoint: string,
        color: string,
        creator = false
    ) => {
        const {connections, endpoint, joinPoint, crossLine, startPoint} = this.getPoint(prevPoint)
            || {} as ITakenPointProps
        if (!connections) return
        const dir = this.determineDirection(prevPoint, nextPoint)
        if (endpoint && !crossLine && !creator) {
            const neighbors = this.getLineNeighbors(connections, color)
            // console.warn('rem endpoint fork', nextPoint, prevPoint, color, neighbors, crossLine)
            for (const nei of neighbors) {
                if (nei === connections[dir].neighbor) {
                    continue
                }
                const forkDir = this.determineDirection(prevPoint, nei)
                this.addTakenPoints({
                    [prevPoint]: {
                        endpoint,
                        connections: {
                            ...connections,
                            [forkDir]: {color: connections[forkDir].color}
                        },
                        crossLine,
                        joinPoint,
                        startPoint
                    }
                })
                this.removeExtraLine(nei, prevPoint, color)
            }
        }
        const updatedPoint = {
            [prevPoint]: {
                crossLine,
                joinPoint,
                endpoint,
                startPoint,
                connections: {
                    ...this.getPoint(prevPoint).connections,
                    [dir]: {
                        color,
                        neighbor: nextPoint
                    }
                }
            }
        } as ITakenPoints
        // isDev() && console.log('update line start', dir, updatedPoint, this.getPoint(prevPoint).connections, nextPoint, prevPoint, endpoint)
        this.addTakenPoints(updatedPoint)
    }

    puzzleFulfilled = () => Object.keys(this.takenPoints).length >= this.width * this.height

    // updateLastPoint = (last: string, prev: string, color: string) => {
    //     const {endpoint, connections, crossLine, joinPoint} = this.getPoint(last) || {}
    //     if (!connections) {
    //         return console.error('invalid last', last, prev, color, this.takenPoints)
    //     }
    //     if (endpoint && !crossLine) {
    //         return this.updateEndPoint(last, prev, color)
    //     }
    //     const dir = this.determineDirection(last, prev)
    //     const pointProps: ITakenPointProps = {
    //         endpoint,
    //         crossLine,
    //         joinPoint,
    //         connections: {
    //             ...connections,
    //             [dir]: {color}
    //         } as IDotConnections
    //     }
    //     this.addTakenPoints({[last]: pointProps})
    // }

    updateEndPoint = (last: string, prev: string, color: string) => {
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(last) || {}
        if (!connections) {
            return console.error('invalid last', last, prev, color, this.takenPoints)
        }
        const dir = this.determineDirection(last, prev)
        const pointProps = {
            endpoint,
            crossLine,
            joinPoint,
            connections: {
                ...connections,
                [dir]: {color}
            }
        }
        this.addTakenPoints({[last]: pointProps})
        // extraNeighbor && this.removeLineFork(extraNeighbor, last, sectorColor)
    }

    convertLastToEndpoint = (point: string) => {
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(point)
        if (!endpoint){
            this.addTakenPoints({
                [point]: {
                    connections,
                    joinPoint,
                    crossLine,
                    endpoint: true
                }
            })
        }
    }

    removeInterferedLine = (start: string) => {
        const startConnections = this.getPoint(start).connections
        const lineNeighbors = this.getLineNeighbors(startConnections)
        const lineColor = this.getColors(start)[0]
        this.deletePoint(start)
        let prevPoint = [start, start, start, start]
        // console.log('remove interfere', start, startConnections)
        const stopFn = (pointKey: string, index = 0) => {
            const {connections, endpoint, crossLine, joinPoint} = this.getPoint(pointKey)
            const lineNeighbors = this.getLineNeighbors(connections)
            // const colors = this.getColors(connections)
            const last = endpoint || lineNeighbors.length < 2
            if (!endpoint) {
                this.deletePoint(pointKey)
                prevPoint[index] = pointKey
            } else {
                const dir = this.determineDirection(pointKey, prevPoint[index])
                const LastPointProps: ITakenPointProps = {
                    endpoint,
                    joinPoint,
                    crossLine,
                    connections: {
                            ...connections,
                            [dir]: {
                                color: crossLine
                                    ? DefaultColor
                                    : connections[dir].color
                            }
                        }
                }
                this.addTakenPoints({[pointKey]: LastPointProps})
            }
            return last
        }
        for (let i = 0;  i < lineNeighbors.length; i++) {
            const neighbor = lineNeighbors[i]
            this.goToLinePoint(neighbor, start, stopFn, lineColor, i)
        }
    }

    getFullLine = (line: string[]): ITakenPoints => {
        const fullLine = {} as ITakenPoints
        for (const point of line) {
            const pointProps = this.getPoint(point)
            if (!pointProps) {
                console.error('line point not found')
                return {}
            }
            fullLine[point] = {...pointProps}
        }
        return fullLine
    }
}
