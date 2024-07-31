import { DefaultColor } from "../constant/constants";
import {
    IDLines,
    IDotConnections,
    IEndpoints,
    ITakenPProps,
    ITPoints,
    LineDirections,
    SA
} from "../constant/interfaces";
import {
    copyObj,
    defaultConnectionsWithColor,
    getCommonColor,
    isDev,
    oppositeDirection
} from "../utils/helper-fn";
import { LinedRectBase } from "./rect-base";
import {puzzlesManager} from "../app-services/puzzles-manager";


export class PuzzleCommons extends LinedRectBase {
    lineStartPoint = ''
    lineEndpoints = {} as IEndpoints
    joinPointLines: {[k: string]: SA} = {}

    getLineKey = (point1: string, point2: string) => {
        let key = (this.lineEndpoints[`${point1}_${point2}`] && `${point1}_${point2}`)
                || (this.lineEndpoints[`${point2}_${point1}`] && `${point2}_${point1}`)
                || ''
        if (!key) {
            console.error('invalid points to get line key', point1, point2)
        }
        return key
    }

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

    prepareEndpointForResolver = (point: ITakenPProps, TP = true): ITakenPProps => {
        const {endpoint, connections, lineEndpoints} = point
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
            endpoint,
            lineEndpoints
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

    getLines = (points: ITPoints): IDLines => {
        const lines = {} as IDLines
        const passed = {} as {[key: string]: boolean}
        this.totalPoints = points
        // isDev() && console.log('sep by lines', points)
        for (const point in points) {
            if (passed[point]) { continue }
            const {connections} = points[point]
            if (!connections) return {}
            const colors = this.getColors(connections)
            for (const color of colors) {
                const neighbors = this.getLineNeighbors(point,  color, true)
                const line = this.getFullLineFromAnyPoint(point, color, neighbors, true)
                for (const point of line) {
                    const pointProps = this.totalPoints[point]
                    if (!pointProps) {
                        console.error('line point not found', point)
                        continue
                    }
                    const [first, last] = [line[0], line[line.length - 1]]
                    const toConcat = pointProps.endpoint && !pointProps.crossLine
                        ? (point === first ? last : first)
                        : [first, last]
                    const lineEndpoints = (pointProps.lineEndpoints || []).concat(toConcat)
                    pointProps.endpoint && this.addTakenPoints({[point]: {
                        ...pointProps,
                        lineEndpoints
                    }})
                }
                if (!line.length) return {}
                line.forEach(p => {
                    passed[p] = true
                })
                const lineKey = `${line[0]}_${line[line.length - 1]}`
                lines[lineKey] = {line, color}
            }
        }
        this.lines = lines
        return lines
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

    isEndpoint = (key: string, point: ITakenPProps, color: string) => {
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
    ) => {
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
                // console.log('remove crossLine')
                this.updateCrossLineRemovingFork(color, point, pointProps)
            }
        }
        isDev() && console.warn('line has removed', line, color)
    }

    updateCrossLinePoint = (
        point: string,
        prev: string,
        next: string,
        color: string,
    ): ITakenPProps => {
        const pointProps = this.getPoint(point)
        const connections = copyObj(pointProps.connections) as IDotConnections
        connections[this.determineDirection(point, prev)] = {color, neighbor: prev}
        connections[this.determineDirection(point, next)] = {color, neighbor: next}
        return {...pointProps, connections}
    }

    getColorsOfGreyLineStart = (point: string) => {
        const greyLine = this.getLinePartPoints(DefaultColor, point)
        const middlePoint = greyLine[greyLine.length - 1]
        return this.getPossibleColors(middlePoint)
    }

    getPossibleColors = (point: string | ITakenPProps) => {
        const {connections, crossLine, joinPoint} = (
            typeof point === "string" ? this.getPoint(point) : point
        ) || {}
        if (!connections) return []
        return crossLine || joinPoint || this.getColors(connections)
    }

    updateCrossLinePointToRevealLine = (point: string, color: string): ITakenPProps => {
        const pointProps = this.totalPoints[point]
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

    drawLine = (line: SA, color: string) => {
        const lineToShow = {} as ITPoints
        for (const point of line) {
            const existedPoint = this.getPoint(point)
            if (existedPoint && !existedPoint.endpoint) {
                const pointColor = this.getColors(existedPoint.connections)[0]
                const lineToRemove = this.getFullLineFromAnyPoint(point, pointColor)
                this.removeLinePart(lineToRemove, pointColor)
            }
            if (this.totalPoints[point].crossLine || this.totalPoints[point].joinPoint) {
                lineToShow[point] = this.updateCrossLinePointToRevealLine(point, color)
            } else {
                lineToShow[point] = this.totalPoints[point] as ITakenPProps
            }
        }
        console.log('draw line', line)
        this.addTakenPoints(lineToShow)
    }

    getDistantBetweenPoints = (point1: string, point2: string, diag = '1') => {
        const ps1 = this.rect[point1].point
        const ps2 = this.rect[point2].point
        return !diag
            ? Math.abs(ps1[0] - ps2[0]) + Math.abs(ps1[1] - ps2[1])
            : Math.sqrt((ps1[0] - ps2[0]) * (ps1[0] - ps2[0]) + (ps1[1] - ps2[1]) * (ps1[1] - ps2[1]))
    }

    // getDistantWithMeddling = (point: string, target: string, key: string, diag = '1') => {
    //     const dist = this.getDistantBetweenPoints(point, target, diag)
    //     if (dist === 0) {
    //         return 0
    //     }
    //     return this.getPointMeddling(point, key) / 100 + dist
    // }

    getPointMeddling(point: string, _key: string) {
        const coords = this.rect[point].point
        let meddling = 0
        // let lines = 0
        for (const key in this.lineEndpoints) {
            if (_key === key) continue
            // lines++
            const lineProps = this.lineEndpoints[key]
            const sortedX = [lineProps.coords1[0], lineProps.coords2[0]].sort()
            const sortedY = [lineProps.coords1[1], lineProps.coords2[1]].sort()
            if (sortedX[0] <= coords[0] && sortedX[1] >= coords[0]
                && sortedY[0] <= coords[1] && sortedY[1] >= coords[1]) {
                // if (this.altLines[key] && !this.getPoint(point)) {
                //     meddling -= .5
                //     continue
                // }
                meddling += 1
            }
        }
        // if (lines < 1) {
        //     console.error('not evaluated', this.lineEndpoints, meddling)
        // }
        return meddling
    }

    removeExtraLine = (next: string, prev: string, color: string) => {
        const line = this.getLinePartPoints(color, next, prev)
        this.removeLinePart(line, color)
    }

    updateCrossLineRemovingFork = (color: string, point: string, pointProps: ITakenPProps) => {
        const {crossLine, connections, endpoint, joinPoint, lineEndpoints} = pointProps
        console.warn('update, crossline point', color, point, pointProps)
        if (!pointProps.connections) {
            console.error('invalid props to update crossLine', pointProps, color)
            return
        }
        for (const dir in connections) {
            const sec = connections[dir]
            if (sec.color === color) {
                connections[dir] = {color: DefaultColor}
            }
        }
        this.addTakenPoints({[point]: {endpoint, joinPoint, crossLine, connections, lineEndpoints}})
    }

    updateLineStart = (
        nextPoint: string,
        prevPoint: string,
        color: string,
        creator = false
    ) => {
        const {connections, endpoint, joinPoint, crossLine, startPoint} = this.getPoint(prevPoint)
            || {} as ITakenPProps
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
    }

    checkPoint = (point: string, TP = false): ITakenPProps & {colors: SA, neighbors: SA} => {
        const {endpoint, connections} = (TP ? this.totalPoints[point] : this.getPoint(point)) || {}
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
            puzzlesManager.saveError(`${colors[0]} line broken`)
            return {connections, endpoint, colors, neighbors}
        }
        return {endpoint, crossLine, colors, connections, joinPoint, neighbors}
    }

    convertLastToEndpoint = (point1: string, point2: string) => {
        // const key = point2 ? `${point1}_${point2}` : ''
        const points = point2 ? [point1, point2] : [point1]
        for (const point of points) {
            const {endpoint, connections, crossLine, joinPoint} = this.checkPoint(point)
            // if (joinPoint && key) {
            //     this.joinPointLines[point] = this.joinPointLines[point] || []
            //     this.joinPointLines[point].push(key)
            // }
            if (!endpoint){
                this.addTakenPoints({
                    [point]: {
                        connections,
                        crossLine,
                        joinPoint,
                        endpoint: true
                    }
                })
            }
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
                const LastPointProps: ITakenPProps = {
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
