import { DefaultColor } from "../constant/constants";
import {IDotConnections, ISLines, ITakenPointProps, ITakenPoints, LineDirections} from "../constant/interfaces";
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
            const {connections, endpoint, joinPoint, crossLine} = this.getPoint(nextPoint)
            const dir = this.determineDirection(nextPoint, prevPoint)
            isDev() && console.log('create join', nextPoint)
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

    isTargetOrLastPoint = (
        key: string,
        point: ITakenPointProps,
        prev: string,
        target: string,
        color: string
    ) => {
        const neighbors = this.getLineNeighbors(point.connections, color)
        const last = neighbors.length  === 1 || key === target
        isDev() && last && console.log('last point', point, last, color)
        return last ? key : ''
    }

    isEndpoint = (key: string, point: ITakenPointProps, color: string) => {
        const last = (point.endpoint && !point.crossLine)
        isDev() && last && console.log('endpoint point', point, last, color)
        return last ? key : ''
    }

    removeForks = (start: string, color: string, lineStart?: string, lessThen = 2) => {
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(start)
        const lineNeighbors = this.getLineNeighbors(start)
        isDev() && console.log('remove fork', start, color, lineNeighbors, lineStart, lessThen)
        if (lineNeighbors.length < lessThen) {
            return
        }
        let dirToClean, linePartToRemove = [] as string[]
        const firstLinePart = this.getLinePartPoints(color, lineNeighbors[0], start)
        const secondLinePart = lineNeighbors[1]
            ? this.getLinePartPoints(color, lineNeighbors[1], start)
            : []
        if (lessThen === 1 && !lineNeighbors[1]) {
            linePartToRemove = firstLinePart.slice(1)
            dirToClean = this.determineDirection(start, lineNeighbors[0])

        } else if (lineStart && lineNeighbors[1]) {
            if (lineStart === firstLinePart[firstLinePart.length - 1]) {
                dirToClean = this.determineDirection(start, lineNeighbors[1])
                linePartToRemove = secondLinePart.slice(1)
            } else {
                dirToClean = this.determineDirection(start, lineNeighbors[0])
                linePartToRemove = firstLinePart.slice(1)
            }
        } else if (lineNeighbors[1]) {
            if (this.getPoint(firstLinePart[firstLinePart.length - 1]).endpoint) {
                dirToClean = this.determineDirection(start, lineNeighbors[1])
                linePartToRemove = secondLinePart.slice(1)
            } else {
                dirToClean = this.determineDirection(start, lineNeighbors[0])
                linePartToRemove = firstLinePart.slice(1)
            }
        }
        isDev() && console.log('rem fork', dirToClean, start, color, lineNeighbors, lineStart, firstLinePart, secondLinePart)
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
        isDev() && console.log('sep by lines', points)
        for (const point in points) {
            if (passed[point]) { continue }
            const {connections} = points[point]
            if (!connections) return {}
            const colors = this.getColors(connections)
            for (const color of colors) {
                lines[color] = lines[color] || []
                const neighbors = this.getLineNeighbors(point,  color, points)
                const line = this.getFullLineFromAnyPoint(point, color, neighbors, points)
                if (!line.length) return {}
                line.forEach(p => {
                    passed[p] = true
                })
                lines[color].push(line)
            }
        }
        return lines
    }

    removeLinePart = (line: string[], color: string, startPoint?: string) => {
        console.log('remove line part', line, startPoint, color)
        if (!line.length) return
        for (let i = 0; i < line.length; i++) {
            const point = line[i]
            const pointProps = this.getPoint(point)
            const {endpoint, connections, crossLine} = pointProps || {}
            if (!pointProps) { return }
            const lineNeighbors = this.getLineNeighbors(line[i], color)
            if ((!i || i === line.length - 1)
                && (lineNeighbors.length > 1 || pointProps.endpoint)) {
                const prev = !i ? line[i + 1] :  line[i - 1]
                const dir = this.determineDirection(line[i], prev)
                const Props = {
                    ...pointProps,
                    connections: {
                        ...connections,
                        [dir]: {color: crossLine ? DefaultColor : color}
                    }
                }
                this.addTakenPoints({[point]: Props})
            } else if (!endpoint && point !== startPoint) {
                this.deletePoint(point)
            } else if (crossLine && !startPoint) {
                this.updateCrossLineRemovingFork(color, point, pointProps)
            } else if ( i && point === startPoint) {
                this.updateLastPoint(line[i], line[i - 1], color)
            } else if (endpoint) {
                console.log('update last', startPoint, i, line[i], line[i - 1], i && point === startPoint)
                this.updateEndPoint(line[i], line[i - 1], color)
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
            endpoint && this.updateEndPoint(key, passed, col)
            return !next
        }
        this.goToLinePoint(next, prev, stopFn, color)
    }

    removeLineFork = (next: string, prev: string, color: string) => {
        console.warn('remove forked line', next, prev)
        let passed = prev
        const toFn = (key: string) => {
            const point = this.getPoint(key)
            const last = this.isEndpoint(key, point, color)
            !last && !point.crossLine && this.deletePoint(key)
            point.crossLine && this.updateCrossLineRemovingFork(color, key, point)
            last && this.updateEndPoint(last, passed, color)
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
        const {connections, endpoint, joinPoint, crossLine, startPoint} = this.getPoint(prevPoint)
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
        isDev() && console.log('update line start', dir, updatedPoint, this.getPoint(prevPoint).connections, nextPoint, prevPoint, endpoint, removeFork)
        this.addTakenPoints(updatedPoint)
    }

    puzzleFulfilled = () => Object.keys(this.takenPoints).length === this.width * this.height

    updateLastPoint = (last: string, prev: string, color: string) => {
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(last) || {}
        if (!connections) {
            return console.error('invalid last', last, prev, color, this.takenPoints)
        }
        if (endpoint && !crossLine) {
            return this.updateEndPoint(last, prev, color)
        }
        const dir = this.determineDirection(last, prev)
        const pointProps: ITakenPointProps = {
            endpoint,
            crossLine,
            joinPoint,
            connections: {
                ...connections,
                [dir]: {color}
            } as IDotConnections
        }
        this.addTakenPoints({[last]: pointProps})
    }

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
