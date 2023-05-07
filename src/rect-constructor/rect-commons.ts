import { DefaultColor } from "../constant/constants";
import {ISLines, ITakenPointProps, ITakenPoints, LineDirections} from "../constant/interfaces";
import {defaultConnectionsWithColor, isDev, oppositeDirection} from "../helper-fns/helper-fn";
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
                [LineDirections.left]: {color: joinPoint[2] || ''},
                [LineDirections.bottom]: {color: joinPoint[3] || ''},
            }
        return {
            connections: _connections,
            crossLine,
            joinPoint,
            endpoint
        }
    }

    addNextPoint = (nextPoint: string, prevPoint: string, color: string) => {
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
        console.log('continue line', nextPoint, prevPoint, point)
        this.addTakenPoints(point)
    }

    createJoinPoint = (
        nextPoint: string,
        prevPoint: string,
        color: string,
        sameColor = false) => {
            const {connections, endpoint ,joinPoint ,crossLine} = this.getPoint(nextPoint)
            const dir = this.determineDirection(nextPoint, prevPoint)
            console.log('create join')
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

    isLast = (key: string, point: ITakenPointProps, prev: string, endPoint: string, color: string) => {
        const neighbors = this.getLineNeighbors(point.connections, color)
        const neighbor = neighbors[0] === prev ? neighbors[1] : neighbors[0]
        const last = (point.endpoint && !point.crossLine)
            || !neighbor
            || neighbor === endPoint
        isDev() && console.log('last point', point, prev, endPoint, neighbors, neighbor,
            neighbor === endPoint, last, color)
        return last ? (neighbor || key) : ''
    }

    removeLineToEndpoint = (start: string, prev: string, color: string) => {
        console.warn('remove part line to endpoint', start, prev)
        let passed = prev
        const toFn = (key: string) => {
            const {endpoint} = this.getPoint(key)
            !endpoint && this.deletePoint(key)
            if (endpoint) {
                this.updateLastPoint(key, passed, color)
            }
            passed = key
            return endpoint
        }
        this.goToLinePoint(start, prev, toFn, color)
    }
    
    removeLineCirclePart(prevP: string, next: string, color: string) {
        const {connections, endpoint} = this.getPoint(prevP)
        console.warn('remove circle', prevP, next, connections, endpoint)
        if (endpoint) return
        const lineNeighbors = this.getLineNeighbors(connections, color)
        if (lineNeighbors.length > 1) {
            const nextPointExtraNeighbor = this.getLineNeighbors(next)
                .filter(n => n !== prevP)[0]
            if (!nextPointExtraNeighbor) return
            console.warn('next extra')
            const nextDir = this.determineDirection(next, nextPointExtraNeighbor)
            const nextPoint = this.getPoint(next)
            this.addTakenPoints({
                [next]: {
                    ...nextPoint,
                    connections: {
                        ...nextPoint.connections,
                        [nextDir]: {color}
                    }
                }
            })
            return this.removeLineFork(nextPointExtraNeighbor, next, color)
        }
        let prev = ''
        const toFn = (key: string) => {
            const point = this.getPoint(key)
            if (!point?.connections) { return true }
            const last = this.isLast(key, point, prev, next, color)
            prev = key
            this.deletePoint(key)
            if (last) {
                this.updateLastPoint(last, prev, color)
            }
            return last
        }
        this.goToLinePoint(prevP, next, toFn, color)
    }

    removeForks = (start: string, color: string, lineStart?: string) => {
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(start)
        const lineNeighbors = this.getLineNeighbors(start)
        if (lineNeighbors.length < 2) {
            return
        }
        let dirToClean, linePartToRemove = [] as string[]
        const firstLinePart = this.getLinePartPoints(color, lineNeighbors[0], start)
        const secondLinePart = this.getLinePartPoints(color, lineNeighbors[1], start)

        if (lineStart) {
            if (lineStart === firstLinePart[firstLinePart.length - 1]) {
                dirToClean = this.determineDirection(start, lineNeighbors[1])
                linePartToRemove = secondLinePart.slice(1)
            } else {
                dirToClean = this.determineDirection(start, lineNeighbors[0])
                linePartToRemove = firstLinePart.slice(1)
            }
        } else {
            if (this.getPoint(firstLinePart[firstLinePart.length - 1]).endpoint) {
                dirToClean = this.determineDirection(start, lineNeighbors[1])
                linePartToRemove = secondLinePart.slice(1)
            } else {
                dirToClean = this.determineDirection(start, lineNeighbors[0])
                linePartToRemove = firstLinePart.slice(1)
            }
        }
        console.log('rem fork', start, color, lineNeighbors, lineStart, firstLinePart, secondLinePart)
        if (!linePartToRemove.length || !dirToClean) return
        this.removeLinePart(linePartToRemove, color)
        this.addTakenPoints({
            [start]: {
                joinPoint,
                crossLine,
                endpoint,
                connections: {
                    ...connections,
                    [dirToClean]: {color}
                }
            }
        })
    }

    separateDotsByLines = (points: ITakenPoints): ISLines => {
        const passed = {} as {[key: string]: boolean}
        const lines = {} as ISLines
        for (const point in points) {
            if (passed[point]) { continue }
            const {connections} = points[point]
            if (!connections) return {}
            const colors = this.getColors(connections)
            for (const color of colors) {

                lines[color] = lines[color] || []
                const lineNeighbors = this.getLineNeighbors(connections, color, points)
                const line = lineNeighbors.length > 1
                    ? this.getLineFromMiddlePoint(lineNeighbors, point, color, false, points)
                    : this.getLineFromEndpoint(point, color, false, points)
                if (!line.start) return {}
                line.line.forEach(p => {
                    passed[p] = true
                })
                lines[color].push(line.line)
            }
        }
        console.log('lines', lines)
        return lines
    }

    checkPoint = (point: string) => {
        const {endpoint, connections} = this.getPoint(point)
        const {crossLine, joinPoint} = endpoint
            ? this.prepareEndpointForResolver({endpoint, connections})
            : {crossLine: undefined, joinPoint: undefined}
        const colors = this.getColors(connections)
        const neighbors = this.getLineNeighbors(connections)
        if ((!(crossLine || joinPoint) && colors.length !== 1)
            || (endpoint && !(crossLine || joinPoint) && neighbors.length !== 1)
            || colors.includes(DefaultColor)
            || (!joinPoint && colors.length > 2)
        ) {
            return {}
        }
        return {endpoint, crossLine, colors, connections, joinPoint, neighbors}
    }


    addLine = (line: string[], color: string) => {
        if (!this.lines[color]) {
            this.lines[color] = []
        }
        this.lines[color].push(line)
    }

    removeLinePart = (line: string[], color: string) => {
        for (let i = 0; i < line.length; i++) {
            const point = line[i]
            const pointProps = this.getPoint(point)
            if (!pointProps.endpoint) {
                this.deletePoint(point)
            } else if (pointProps.crossLine) {
                this.updateCrossLineRemovingFork(color, point, pointProps)
            } else if (i && pointProps.endpoint) {
                this.updateLastPoint(line[i], line[i - 1])
            }
        }
    }

    removeExtraLine = (next: string, prev: string, color: string) => {
        console.log( 'remove endpoint fork')
        let passed = prev
        const stopFn = (key: string) => {
            const {endpoint, crossLine} = this.getPoint(key) || {}
            const next = this.getLineNeighbors(key, color).filter(n => n !== prev)[0]
            !endpoint && this.deletePoint(key)
            const col = crossLine ? DefaultColor : color
            endpoint && this.updateLastPoint(key, passed, col)
            return !next
        }
        this.goToLinePoint(next, prev, stopFn, color)
    }

    removeLineFork = (next: string, prev: string, color: string) => {
        console.warn('remove forked line', next, prev)
        let passed = prev
        const toFn = (key: string) => {
            const point = this.getPoint(key)
            const last = this.isLast(key, point, passed, 'none', color)
            !point.endpoint && this.deletePoint(key)
            point.crossLine && this.updateCrossLineRemovingFork(color, key, point)
            if (last && point.endpoint) {
                this.updateLastPoint(last, passed, color)
            }
            passed = key
            return last
        }
        this.goToLinePoint(next, prev, toFn, color)
    }

    updateCrossLineRemovingFork = (color: string, key: string, point: ITakenPointProps) => {
        const {crossLine, connections, endpoint, joinPoint} = point
        if (!point.crossLine || !point.connections) {
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
        removeFork = true
    ) => {
        const {connections, endpoint, joinPoint, crossLine} = this.getPoint(prevPoint)
            || {} as ITakenPointProps
        if (!connections) return
        const dir = this.determineDirection(prevPoint, nextPoint)
        if (removeFork && endpoint && !crossLine && !joinPoint) {
            const neighbors = this.getLineNeighbors(connections, color)
                .filter(n => n !== connections[dir].neighbor)
            console.warn('rem endpoint fork', nextPoint, prevPoint, color, neighbors, crossLine)
            for (const nei of neighbors) {
                const dir = this.determineDirection(prevPoint, nei)
                this.addTakenPoints({
                    [prevPoint]: {
                        endpoint,
                        connections: {
                            ...connections,
                            [dir]: {color: connections[dir].color}
                        },
                        crossLine,
                        joinPoint
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
                connections: {
                    ...this.getPoint(prevPoint).connections,
                    [dir]: {
                        color,
                        neighbor: nextPoint
                    }
                }
            }
        } as ITakenPoints
        isDev() && console.log('update line start', dir, updatedPoint, this.getPoint(prevPoint).connections, nextPoint, prevPoint, endpoint, removeFork)
        this.addTakenPoints(updatedPoint)
    }

    puzzleFulfilled = () => Object.keys(this.takenPoints).length === this.width * this.height

    updateLastPoint = (last: string, prev: string, color?: string) => {
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(last) || {}
        if (!connections) {
            return console.error('invalid last', last, prev, color, this.takenPoints)
        }
        const dir = this.determineDirection(last, prev)
        const sectorColor = color || connections[dir].color
        const directions = this.getLineDirections(connections, sectorColor)
        const extraDir = directions.filter(d => d !== dir)[0]
        const extraNeighbor = connections[extraDir]?.neighbor
        isDev() && console.warn('update last', last, prev, color, this.getPoint(last),
            'dir', dir, directions, 'line color', sectorColor, crossLine, extraDir)
        const pointProps = !extraDir
            ? {
                endpoint,
                crossLine,
                joinPoint,
                connections: {
                    ...connections,
                    [dir]: {color: crossLine ? DefaultColor : sectorColor}
                }
            }
            : {
                endpoint,
                crossLine,
                joinPoint,
                connections: {
                    ...connections,
                    [dir]: {color: DefaultColor},
                    [extraDir]: {color: DefaultColor}
                }
            }
        this.addTakenPoints({[last]: pointProps})
        extraNeighbor && this.removeLineFork(extraNeighbor, last, sectorColor)
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

    getLineFromMiddlePoint = (
        neighbors: string[],
        prev: string,
        color: string,
        creation = true,
        points = this._takenPoints,
    ) => {
        const firstPart = this.getLinePartPoints(color, neighbors[0], prev, points)
        const secondPart = this.getLinePartPoints(color, neighbors[1], prev, points).slice(1)
        const start = firstPart[firstPart.length - 1]
        const end = secondPart[secondPart.length - 1]
        const line = firstPart.reverse().concat(secondPart)
        if (creation) {
            if (!firstPart.length || !secondPart.length) {
                console.error('line broken', color, prev, this.takenPoints, line)
                return {}
            }
            this.convertLastToEndpoint(start)
            this.convertLastToEndpoint(end)
        }
        return {start, end, color, line}
    }

    getLineFromEndpoint = (
        point: string,
        color: string,
        creation = true,
        points = this._takenPoints,
    ) => {
        const line = this.getLinePartPoints(color, point, '', points)
        const start = line[0]
        const end = line[line.length - 1]
        if (line.length < 3) {
            isDev() && console.error('line broken', color, points, line)
            return {}
        }
        creation && this.convertLastToEndpoint(end)

        return {start, end, color, line}
    }

    removeInterferedLine = (start: string) => {
        const startConnections = this.getPoint(start).connections
        const lineNeighbors = this.getLineNeighbors(startConnections)
        const lineColor = this.getColors(start)[0]
        this.deletePoint(start)
        let prevPoint = [start, start, start, start]
        console.log('remove interfere', start, startConnections)
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
