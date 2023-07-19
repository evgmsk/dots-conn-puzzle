import { DefaultColor } from "../constant/constants";
import {IPath, ITakenPointProps, ITakenPoints, LineDirections} from "../constant/interfaces";
import {
    defaultConnectionsWithColor,
    getCommonColor,
    isDev,
    oppositeDirection
} from "../utils/helper-fn";
import { LinedRectBase } from "./rect-base";


export class PuzzleCommons extends LinedRectBase {
    lineStartPoint = ''

    setLineStartPoint = (point: string) => {
        this.lineStartPoint = point
    }

    setStartingPoints = (points: ITakenPoints, TP = false): ITakenPoints => {
        const addPoints = TP ? this.addTemporalPoints : this.addTakenPoints
        for (const point in points) {
            const pointProps = points[point]
            if (pointProps.endpoint) {
                addPoints({
                    [point]: this.prepareEndpointForResolver(pointProps)
                })
            }
        }
        return points
    }

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
        isDev() && last && console.log('endpoint', point, last, color)
        return last ? key : ''
    }

    removeLastOnePoint = (
        point: string,
        color: string,
        temporalPoints = false
    ) => {
        const [points, addPoints, deletePoint] = temporalPoints
            ? [this.temporalPoints, this.addTemporalPoints, this.deleteTemporalPoint]
            : [this.takenPoints, this.addTakenPoints, this.deletePoint]
        const pointProps = points[point]
        if (!pointProps?.connections) {
            return console.error('no point to delete', point, points)
        }
        const neighbors = this.getLineNeighbors(pointProps.connections, color, temporalPoints)
        if (!pointProps.endpoint) {
            deletePoint(point)
        }
        if (!neighbors.length) return
        for (const nei of neighbors) {
            const neighborPoint = points[nei]
            const dir = this.determineDirection(nei, point)
            addPoints({
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
        line: string[],
        color: string,
        temporalPoints = false,
        fn = this.updateCrossLineRemovingFork) => {
        isDev() && console.log('rem line part', line, color, temporalPoints)
        const [points, addPoints, deletePoint] = temporalPoints
            ? [this.temporalPoints, this.addTemporalPoints, this.deleteTemporalPoint]
            : [this.takenPoints, this.addTakenPoints, this.deletePoint]
        if (line.length === 1 && !points[line[0]]?.endpoint) {
            return this.removeLastOnePoint(line[0], color, temporalPoints)
        }
        if (line[line.length -1] === this.lineStartPoint && points[line[0]]?.endpoint) {
            this.setLineStartPoint(line[0])
        }
        for (let i = 0; i < line.length; i++) {
            const point = line[i]
            const pointProps = points[point]
            if (!pointProps) {return}
            const {connections, endpoint, crossLine, joinPoint} = pointProps
            const lineNeighbors = this.getLineNeighbors(connections, color, temporalPoints)
            const colors = crossLine || joinPoint || this.getColors(connections)
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
                addPoints({[point]: Props})
            } else if (!endpoint) {
                deletePoint(point)
            } else if (crossLine || (colors.length === 2 && !lastPoints)) {
                fn(color, point, pointProps)
            }
        }
    }

    validateFreeCell = (
        path: string[],
        colors: string[],
        pathMode: string,
        temporalPoints = false
    ) => {
        const points = temporalPoints ? this.temporalPoints : this.takenPoints
        const point = path[path.length - 1]
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
            const {crossLine} = points[n] || {}
            if (crossLine && pathMode === 'strict') {
                return !path.includes(n) ? !!getCommonColor(crossLine, colors) : true
            }
        }
        return true
    }

    getFreeCellsAroundPoint = (
        point: string,
        path: string[],
        passed: ITakenPoints,
        targets: string[],
        colors: string[],
        mode: string,
        TP = false,
        distFn = this.getDistantBetweenPoints
    ): IPath[] => {
        const points = TP ? this.temporalPoints : this.takenPoints
        const freeCells = [] as IPath[]
        const target = targets[targets.length - 1]
        // console.log(point, path)
        for (const neighbor of this.rect[point].neighbors) {
            if (passed[neighbor] || path.includes(neighbor)) {
                continue
            }
            const neiProps = points[neighbor]
            const commonColor = getCommonColor(this.getPossibleColors(neighbor, TP), colors)
            const indexOfNeighbor = targets.indexOf(neighbor)
            if (indexOfNeighbor >= 0) {
                const appropriateTarget = !neiProps
                    || (!neiProps.endpoint && mode !== 'strict')
                    || (neiProps.endpoint && !!commonColor)
                console.warn('fin', neighbor, indexOfNeighbor, path, 'apt', appropriateTarget)
                return appropriateTarget
                    ? [{dist: 0, path, target: neighbor, index: indexOfNeighbor}]
                    : [{dist: Infinity, path, target: neighbor}]
            }
            if (commonColor
                && this.getLineNeighbors(neiProps.connections!, commonColor, TP).length
            ) {
                const circle = this.checkIfPointsBelongToSameLine(neighbor, point, commonColor, TP)
                if (circle?.length) {
                    console.error('circle', circle, path, point, neighbor, targets)
                    return [{dist: Infinity, path, target}]
                }
            }
            passed[neighbor] = {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(),
                }
            }
            if (mode === 'strict'
                && neiProps
                && (neiProps.crossLine || neiProps.joinPoint)
                && !path.includes(neighbor)) {
                const dist = distFn(neighbor, target)
                return commonColor
                    ? [{path: path.concat(neighbor), dist, target}]
                    : [{dist: Infinity, path, target}]
            }
            if (!neiProps
                || (!neiProps.endpoint && !commonColor && !mode)
                || ((neiProps.joinPoint || neiProps.crossLine) && commonColor)
            ) {
                const validFreeCell = this.validateFreeCell(path.concat(neighbor), colors, mode, TP)
                if (validFreeCell || (neiProps?.endpoint && commonColor)) {
                    const dist = distFn(neighbor, target)
                    freeCells.push({dist, path: path.concat(neighbor), target})
                }
            }
        }
        return freeCells.length
            ? freeCells.sort((a, b) => b.dist - a.dist)
            : [{dist: Infinity, path, target: targets[targets.length - 1]}]
    }

    getFreeCells = (
        path: string[],
        passed: ITakenPoints,
        targets: string[],
        colors: string[],
        mode: string,
        TP =false,
        distFn = this.getDistantBetweenPoints
    ): IPath[] => {
        const point = path[path.length - 1]
        let freeCells = [] as IPath[]
        // console.log('get free cells', path, passed, targets, colors)
        freeCells = freeCells.concat(
            this.getFreeCellsAroundPoint(point, path, passed, targets, colors, mode, TP, distFn)
        )
        return freeCells.length
            ? freeCells.sort((a, b) => b.dist - a.dist)
            : [{dist: Infinity, path, target: targets[targets.length - 1]}]
    }

    findPath = (
        startPoint: string,
        targetPoint: string,
        colors: string[],
        pathMode = 'soft',
        TP = false,
        distFn = this.getDistantBetweenPoints
    ): string[] => {
        const points = TP ? this.temporalPoints : this.takenPoints
        console.log('find path', startPoint, targetPoint, colors)
        let passedFromTarget = this.setFirstPassed(targetPoint, TP)
        let passedFromStart = this.setFirstPassed(startPoint, TP)
        const lineColor = colors.length > 1 ? DefaultColor : colors[0]
        const nei = null as unknown as string[]
        const startPath = points[startPoint]
            ? this.getFullLineFromAnyPoint(startPoint, lineColor, nei, TP).reverse()
            : [startPoint]
        if (!startPath.length) {
            console.error(startPath, startPoint)
        }
        let pathsFromStart = this.getPathsFromStart(
            startPath,
            targetPoint,
            colors,
            pathMode,
            passedFromStart,
            TP,
            distFn,
        )
        let ch = this.checkIfPathFound(pathsFromStart, [], startPoint, startPath,true, TP)
        if (ch.resultPath) return ch.resultPath
        let pathsFromTarget = this.getFreeCells(
            [targetPoint], passedFromTarget, ch.lastStart!, colors, pathMode, TP, distFn
        )
        while (pathsFromTarget.length > 0 && pathsFromStart.length > 0) {
            let ch = this.checkIfPathFound(
                pathsFromStart, pathsFromTarget, startPoint, startPath, false, TP
            )
            if (ch.resultPath) return ch.resultPath
            pathsFromStart = this.getNext(
                pathsFromStart, passedFromStart, colors, ch.lastTarget!, pathMode, TP, distFn
            )
            if (pathsFromStart[0].dist < 0) {
                if (startPath.length > 1) {
                    console.log('restart', pathsFromStart, pathsFromTarget)
                    passedFromStart = this.setFirstPassed(startPath[0], TP)
                    passedFromTarget = this.setFirstPassed(targetPoint, TP)
                    pathsFromStart = this.getPathsFromStart(
                        startPath.slice(0, -1),
                        targetPoint,
                        colors,
                        pathMode,
                        passedFromStart,
                        TP,
                        distFn
                    )
                }
                if (!pathsFromStart.length || startPath.length === 1) {
                    return []
                }
                this.removeLinePart(startPath, lineColor, TP)
            }
            ch = this.checkIfPathFound(pathsFromStart, pathsFromTarget, startPoint, startPath, true, TP)
            if (ch.resultPath) return ch.resultPath
            pathsFromTarget = this.getNext(
                pathsFromTarget, passedFromTarget, colors, ch.lastStart!, pathMode, TP, distFn
            )
        }
        return []
    }

    getPathsFromStart = (
        startPath: string[],
        targetPoint: string,
        colors: string[],
        pathMode: string,
        passedFromStart: ITakenPoints,
        TP = false,
        distFn = this.getDistantBetweenPoints,
    ) => {
        const lineColor = colors.length > 1 ? DefaultColor : colors[0]
        const _stP = [...startPath]
        let pathsFromStart = this.getFreeCells(
            _stP,
            this.setFirstPassed(startPath[startPath.length - 1], TP),
            [targetPoint],
            colors,
            pathMode,
            TP,
            distFn
        )
        console.log('path from start', pathsFromStart, startPath, targetPoint, colors,
            pathsFromStart[0].dist < Infinity)
        if (pathsFromStart.length && (pathsFromStart[0].dist < Infinity || startPath.length < 2)) {
            return pathsFromStart
        }
        while (startPath.length) {
            const lineToRemove = [_stP.pop()!]
            pathsFromStart = this.getFreeCells(
                _stP,
                this.setFirstPassed(startPath[startPath.length - 1], TP),
                [targetPoint],
                colors,
                pathMode,
                TP,
                distFn
            )
            console.log('path from start2', pathsFromStart, _stP, targetPoint)
            this.removeLinePart(lineToRemove, lineColor, TP)
            if (pathsFromStart.length) return pathsFromStart
        }
        return [{dist: Infinity, path: startPath, target: targetPoint}]

    }

    setFirstPassed = (point: string, TP = false) => {
        const points = TP ? this.temporalPoints : this.takenPoints
        return {
            [point]: {
                ...(points[point] || {
                    endpoint: true})
                ,connections: {
                    ...defaultConnectionsWithColor(),
                    ...points[point]?.connections,
                }
            }
        }
    }

    checkIfPathFound = (
        startPaths: IPath[],
        targetPaths: IPath[],
        startPoint: string,
        startPath: string[],
        start = true,
        TP = false
    ) => {
        const lastStartPath = startPaths[startPaths.length - 1]
        const lastTargetPath = targetPaths[targetPaths.length - 1]
        const pathToCheck = start ? lastStartPath : lastTargetPath
        const pathFromTarget = lastTargetPath?.path || []
        // console.log('check path', startPaths, targetPaths, start)
        if (pathToCheck?.dist === Infinity) {
            return {resultPath: []}
        }
        if (pathToCheck?.dist === 0) {
            const startPath = start
                ? lastStartPath.path
                : lastStartPath.path.slice(0, pathToCheck.index! + 1)
            if (startPath[0] !== startPoint && !startPath.includes(startPoint)) {
                this.removeLinePart(
                    lastStartPath.path.slice(pathToCheck.index!),
                    this.getPossibleColors(startPoint, TP)[0],
                    TP
                )
            }
            const endPath = start
                ? lastTargetPath?.path.slice(1, pathToCheck.index! + 1).reverse()
                : lastTargetPath?.path.slice(1).reverse()
            // console.log('check path 2', startPath.concat(endPath))
            return endPath?.length
                ? {
                    resultPath: startPath.concat(endPath)
                }
                : {
                    resultPath: startPath
                }
        }
        const lastStart = lastStartPath.path
        return {lastStart, lastTarget: pathFromTarget}
    }

    getNext = (
        paths: IPath[],
        passed: ITakenPoints,
        colors: string[],
        targets: string[],
        pathMode: string,
        TP = false,
        distFn = this.getDistantBetweenPoints
    ) => {
        const _paths = Object.assign([], paths) as IPath[]
        while (paths.length > 0) {
            let path = _paths.pop()!.path
            const nextPaths = this.getFreeCells(path, passed, targets, colors, pathMode, TP, distFn)
            // console.log('next', path, nextPaths, paths)
            if (nextPaths.length && nextPaths[nextPaths.length - 1].dist !== Infinity) {
                return _paths.concat(nextPaths)
            }
            if (_paths.length < 1 && path.length > 1) {
                console.log('path', _paths, path)
                return [{dist: -1, path: paths[0].path, target: targets[targets.length -1]}]
            }
        }
        return [{dist: -1, path: paths[0].path, target: targets[targets.length -1]}]
    }

    // getLineColor = (startLinePoint: string, point: string) => {
    //     const startColors = this.getPossibleColors(startLinePoint)
    //     const colors = this.getPossibleColors(point)
    //     const commonColor = getCommonColor(startColors, colors)
    //     if (commonColor) return commonColor
    //     if (colors.length === 1) {
    //         return colors[0]
    //     }
    // }


    getColorsOfGreyLineStart = (point: string) => {
        const greyLine = this.getLinePartPoints(DefaultColor, point)
        const middlePoint = greyLine[greyLine.length - 1]
        return this.getPossibleColors(middlePoint)
    }

    getPossibleColors = (point: string | ITakenPointProps, temporalPoints = false) => {
        const points = temporalPoints ? this.temporalPoints : this.takenPoints
        const {connections, crossLine, joinPoint} = (typeof point === "string"
            ? points[point]
            : point) || {}
        // console.log(connections, crossLine || joinPoint || this.getColors(connections))
        if (!connections) return []
        return crossLine || joinPoint || this.getColors(connections)
    }

    getDistantBetweenPoints = (point1: string, point2: string, diag = true) => {
        const ps1 = this.rect[point1].point
        const ps2 = this.rect[point2].point
        return !diag
            ? Math.abs(ps1[0] - ps2[0]) + Math.abs(ps1[1] - ps2[1])
            : Math.sqrt((ps1[0] - ps2[0]) * (ps1[0] - ps2[0]) + (ps1[1] - ps2[1]) * (ps1[1] - ps2[1]))
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
