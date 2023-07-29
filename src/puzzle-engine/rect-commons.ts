import { DefaultColor } from "../constant/constants";
import {IEndpoints, ITakenPointProps, ITPoints, LineDirections, SA} from "../constant/interfaces";
import {
    copyObj,
    defaultConnectionsWithColor,
    getCommonColor,
    isDev,
    oppositeDirection
} from "../utils/helper-fn";
import { LinedRectBase } from "./rect-base";


export class PuzzleCommons extends LinedRectBase {
    lineStartPoint = ''
    lineEndpoints = {} as IEndpoints

    setLineStartPoint = (point: string) => {
        this.lineStartPoint = point
    }

    setStartingPoints = (TP = true): ITPoints => {
        const points = copyObj(this.totalPoints) as ITPoints
        for (const point in points) {
            const pointProps = points[point]
            if (pointProps.endpoint) {
                this.addTakenPoints({
                    [point]: this.prepareEndpointForResolver(pointProps, TP)
                })
            }
        }
        return points
    }

    getTotalPoints = () => {
        const takenPoints = this.takenPoints
        const points = {} as ITPoints
        for (const point in takenPoints) {
            const { crossLine, joinPoint } = takenPoints[point].endpoint
                ? this.prepareEndpointForResolver(takenPoints[point])
                : {crossLine: undefined, joinPoint: undefined}
            points[point] = {...takenPoints[point], crossLine, joinPoint,}
        }
        return points
    }

    prepareEndpointForResolver = (point: ITakenPointProps, TP = true): ITakenPointProps => {
        const {endpoint, connections} = point
        const colors = this.getColors(connections)
        const lineNeighbors = this.getLineNeighbors(point.connections, '', TP)
        const firstColorNeighbors = this.getLineNeighbors(point.connections, colors[0], TP)
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
            let {endpoint, joinPoint, crossLine} = this.getPoint(nextPoint)
            const sameColorNeighbors = this.getLineNeighbors(nextPoint, color)
            if ((!joinPoint && !crossLine && sameColorNeighbors.length)
                || ((joinPoint || crossLine) && sameColorNeighbors.length > 1)) {
                sameColorNeighbors.forEach(n => {
                    const lineToRemove = this.getLinePartPoints(color, n, nextPoint)
                    this.removeLinePart(lineToRemove, color)
                })
            }
            const dir = this.determineDirection(nextPoint, prevPoint)
            isDev() && console.log('create join', this.getPoint(nextPoint))
            const connections = this.getPoint(nextPoint).connections
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
        let lineToRemove = [] as SA
        if (endpoint) {
            lineToRemove = this.getFullLineFromAnyPoint(prev, color)
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
                lineToRemove.length && this.removeLinePart(lineToRemove, color)
                return neighbor
            }
        }
        return ''
    }

    isEndpoint = (key: string, point: ITakenPointProps, color: string) => {
        const last = (point.endpoint && !point.crossLine)
        isDev() && last && console.log('endpoint', point, last, color)
        return last ? key : ''
    }

    removeLastOnePoint = (
        point: string,
        color: string,
    ) => {
        const pointProps = this.getPoint(point)
        if (!pointProps?.connections) {
            return console.error('no point to delete', point)
        }
        const neighbors = this.getLineNeighbors(pointProps.connections, color)
        if (!pointProps.endpoint) {
            this.deletePoint(point)
        }
        if (!neighbors.length) return
        for (const nei of neighbors) {
            const neighborPoint = this.getPoint(nei)
            const dir = this.determineDirection(nei, point)
            this.addTakenPoints({
                [nei]: {
                    ...neighborPoint,
                    connections: {
                        ...neighborPoint.connections,
                        [dir]: {color}
                    }
                }
            })
        }
    }

    removeLinePart = (
        line: SA,
        color: string,
        fn = this.updateCrossLineRemovingFork) => {
        isDev() && console.log('rem line part', line, color)
        const points = this.takenPoints
        if (line.length === 1 && !points[line[0]]?.endpoint) {
            return this.removeLastOnePoint(line[0], color)
        }
        if (line[line.length -1] === this.lineStartPoint && points[line[0]]?.endpoint) {
            this.setLineStartPoint(line[0])
        }
        for (let i = 0; i < line.length; i++) {
            const point = line[i]
            const pointProps = points[point]
            if (!pointProps) {return}
            const {connections, endpoint, crossLine, joinPoint} = pointProps
            const lineNeighbors = this.getLineNeighbors(connections, color)
            const lastPoints = !i || i === line.length - 1

            if (lastPoints && (lineNeighbors.length > 1 || endpoint)) {
                const prev = i === 0 ? line[i + 1] : line[i - 1]
                const dir = this.determineDirection(line[i], prev)
                const colors = this.getColors(connections)
                const _color = colors.length === 1 && !crossLine
                    ? getCommonColor(colors, [color]) || colors[0]
                    : color
                const Props = {
                    ...pointProps,
                    connections: {
                        ...connections,
                        [dir]: {color: crossLine ? DefaultColor : _color}
                    }
                }
                this.addTakenPoints({[point]: Props})
            } else if (!endpoint) {
                this.deletePoint(point)
            } else if (crossLine || (joinPoint && !lastPoints)) {
                fn(color, point, pointProps)
            }
        }
    }

     updateCrossLinePoint = (
        point: string,
        color: string,
        pointProps: ITakenPointProps,
    ): ITakenPointProps => {
        const currentProps = this.getPoint(point)
        const connections = copyObj(currentProps.connections)
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

    getColorsOfGreyLineStart = (point: string) => {
        const greyLine = this.getLinePartPoints(DefaultColor, point)
        const middlePoint = greyLine[greyLine.length - 1]
        return this.getPossibleColors(middlePoint)
    }

    getPossibleColors = (point: string | ITakenPointProps) => {
        const {connections, crossLine, joinPoint} = (typeof point === "string"
            ? this.getPoint(point)
            : point) || {}
        // console.log(connections, crossLine || joinPoint || this.getColors(connections))
        if (!connections) return []
        return crossLine || joinPoint || this.getColors(connections)
    }

    getDistantBetweenPoints = (point1: string, point2: string, diag = '1') => {
        const ps1 = this.rect[point1].point
        const ps2 = this.rect[point2].point
        return !diag
            ? Math.abs(ps1[0] - ps2[0]) + Math.abs(ps1[1] - ps2[1])
            : Math.sqrt((ps1[0] - ps2[0]) * (ps1[0] - ps2[0]) + (ps1[1] - ps2[1]) * (ps1[1] - ps2[1]))
    }

    getDistantWithMeddling = (point: string, target: string, key: string) => {
        const dist = this.getDistantBetweenPoints(point, target, key)
        if (dist === 0) {
            return 0
        }
        return this.getPointMeddling(point, key) + dist / 100
    }

    getPointMeddling(point: string, _key: string) {
        const coords = this.rect[point].point
        let meddling = 0
        let lines = 0
        for (const key in this.lineEndpoints) {
            if (_key === key) continue
            lines++
            const lineProps = this.lineEndpoints[key]
            const sortedX = [lineProps.coords1[0], lineProps.coords2[0]].sort()
            const sortedY = [lineProps.coords1[1], lineProps.coords2[1]].sort()
            if (sortedX[0] <= coords[0] && sortedX[1] >= coords[0]
                && sortedY[0] <= coords[1] && sortedY[1] >= coords[1]) {
                meddling += 1
            }
        }
        if (lines < 1) {
            console.error('not evaluated', this.lineEndpoints)
        }
        return meddling
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
                console.log('fork', forkDir)
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
        } as ITPoints
        // isDev() && console.log('update line start', dir, updatedPoint, this.getPoint(prevPoint).connections, nextPoint, prevPoint, endpoint)
        this.addTakenPoints(updatedPoint)
    }

    puzzleFulfilled = () => Object.keys(this.takenPoints).length >= this.width * this.height

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
        const startConnections = this.getPoint(start)?.connections
        console.log('remove interfere', start, startConnections)
        if (!startConnections) {return console.error('no start point to remove')}
        const lineNeighbors = this.getLineNeighbors(startConnections)
        const lineColor = this.getColors(start)[0]
        this.deletePoint(start)
        let prevPoint = [start, start, start, start]

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

    getFullLine = (line: SA): ITPoints => {
        const fullLine = {} as ITPoints
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
