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

    removeLastOnePoint = (point: string, color: string) => {
        const pointProps = this.getPoint(point)
        const neighbors = this.getLineNeighbors(pointProps.connections)
        if (!pointProps.endpoint) {
            this.deletePoint(point)
        }
        console.log('rem one last', point, neighbors)
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

    removeLinePart = (line: string[], color: string, fn = this.updateCrossLineRemovingFork) => {
        console.log('rem line part', line, color)
        if (line.length === 1 && !this.getPoint(line[0])?.endpoint) {
            return this.removeLastOnePoint(line[0], color)
        }
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
                console.log(i, line[i], Props, dir)
                this.addTakenPoints({[point]: Props})
            } else if (!endpoint) {
                this.deletePoint(point)
            } else if (crossLine || (colors.length === 2 && !lastPoints)) {
                fn(color, point, pointProps)
            }
        }
        console.log(this.getPoint(line[0]))
    }

    validateFreeCell = (path: string[], colors: string[], pathMode: string) => {
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
            const {crossLine} = this.getPoint(n) || {}
            if (crossLine && pathMode === 'strict') {
                return !path.includes(n) ? !!getCommonColor(crossLine, colors) : true
            }
        }
        return true
    }

    checkStartAndTarget = (start: string, target: string, colors: string[], mode = 'soft') => {
        const startProps = this.getPoint(start)
        const startNeighbors = this.rect[start].neighbors
        const targetProps = this.getPoint(target)
        const targetNeighbors = this.rect[target].neighbors
        if (startProps) {
            if ( startProps.endpoint
                && !startProps.crossLine
                && !startProps.joinPoint
                && this.getLineNeighbors(startProps.connections).length > 0
            ) {
                return false
            }
        }
        if (targetProps) {
            const targetColors = this.getPossibleColors(target)
            if (targetProps.endpoint
                && !targetProps.crossLine
                && !targetProps.joinPoint
                && this.getLineNeighbors(targetProps.connections).length > 0
                && getCommonColor(colors, targetColors)
            ) {
                return false
            }
            if (!targetProps.endpoint) {
                if (getCommonColor(colors, targetColors)) return false
            }
        }
        if (mode === 'strict') {
            for (const nei of startNeighbors) {
                const neiProps = this.getPoint(nei)
                if (!neiProps) continue
                const neiColors = this.getPossibleColors(nei)
                if (neiColors.length > 1 && !getCommonColor(neiColors, colors)) {
                    return false
                }
            }
            for (const nei of targetNeighbors) {
                const neiProps = this.getPoint(nei)
                if (!neiProps) continue
                const neiColors = this.getPossibleColors(nei)
                if (neiColors.length > 1 && !getCommonColor(neiColors, colors)) {
                    return false
                }
            }
        }
        return true
    }

    getFreeCells = (
        path: string[],
        passed: ITakenPoints,
        targets: string[],
        colors: string[],
        mode: string,
    ): IPath[] => {
        const point = path[path.length - 1]
        const freeCells = [] as IPath[]
        console.log(path, targets)
        const target = targets[targets.length - 1]
        for (const neighbor of this.rect[point].neighbors) {
            if (passed[neighbor] || path.includes(neighbor)) {
                continue
            }
            const neiProps = this.getPoint(neighbor)
            const commonColor = getCommonColor(this.getPossibleColors(neighbor), colors)
            const indexOfNeighbor = targets.indexOf(neighbor)
            if (indexOfNeighbor >= 0) {
                const appropriateTarget = !neiProps
                    || (!neiProps.endpoint && mode !== 'strict')
                    || (neiProps.endpoint && !!commonColor)
                console.warn('fin', neighbor, indexOfNeighbor, path, targets, 'apt', appropriateTarget)
                return appropriateTarget
                        ? [{dist: 0, path, target: neighbor, index: indexOfNeighbor}]
                        : [{dist: Infinity, path, target: neighbor}]
            }
            if (commonColor
                && this.getLineNeighbors(neiProps.connections!, commonColor).length
            ) {
                const circle = this.checkIfPointsBelongToSameLine(neighbor, point, commonColor)
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
                const dist = this.getDistantBetweenPoints(neighbor, target)
                return commonColor
                        ? [{path: path.concat(neighbor), dist, target}]
                        : [{dist: Infinity, path, target}]
            }
            if (!neiProps
                || (!neiProps.endpoint && !commonColor && !mode)
                || ((neiProps.joinPoint || neiProps.crossLine) && commonColor)
            ) {
                const validFreeCell = this.validateFreeCell(path.concat(neighbor), colors, mode)
                if (validFreeCell || (neiProps?.endpoint && commonColor)) {
                    const dist = this.getDistantBetweenPoints(neighbor, target)
                    freeCells.push({dist, path: path.concat(neighbor), target})
                }
            }
        }
        return freeCells.length
            ? freeCells.sort((a, b) => b.dist - a.dist)
            : [{dist: Infinity, path, target}]
    }

    findPath = (startPoint: string, targetPoint: string, colors: string[], pathMode = 'soft'): string[] => {
        if (!this.checkStartAndTarget(startPoint, targetPoint, colors, pathMode)) {
            return []
        }
        console.log('find path')
        let passedFromTarget = this.setFirstPassed(targetPoint)
        let passedFromStart = this.setFirstPassed(startPoint)
        const lineColor = colors.length > 1 ? DefaultColor : colors[0]
        const startPath = this.getFullLineFromAnyPoint(startPoint, lineColor).reverse()
        let pathsFromStart =
            this.getFreeCells(startPath, passedFromStart, [targetPoint], colors, pathMode)
        let ch = this.checkIfPathFound(pathsFromStart, [], startPoint)
        if (ch.resultPath) return ch.resultPath
        let pathsFromTarget =
            this.getFreeCells([targetPoint], passedFromTarget, ch.lastStart!, colors, pathMode)
        while (pathsFromTarget.length > 0 && pathsFromStart.length > 0) {
            let ch = this.checkIfPathFound(pathsFromStart, pathsFromTarget, startPoint, false)
            if (ch.resultPath) return ch.resultPath
            pathsFromStart =
                this.getNext(pathsFromStart, passedFromStart, colors, ch.lastTarget!, pathMode)
            if (pathsFromStart[0].dist < 0) {
                if (startPath.length > 1) {
                    console.log('restart', pathsFromStart, pathsFromTarget)
                    const path = startPath.slice(0, 1)
                    passedFromStart = this.setFirstPassed(startPath[0])
                    passedFromTarget = this.setFirstPassed(targetPoint)
                    pathsFromStart = this.getFreeCells(
                        path, passedFromStart, [targetPoint], colors, pathMode
                    )
                }
                if (!pathsFromStart.length || startPath.length === 1) {
                    return []
                }
                this.removeLinePart(startPath, lineColor)
            }
            ch = this.checkIfPathFound(pathsFromStart, pathsFromTarget, startPoint)
            if (ch.resultPath) return ch.resultPath
            pathsFromTarget =
                this.getNext(pathsFromTarget, passedFromTarget, colors, ch.lastStart!, pathMode)
        }
        return []
    }

    setFirstPassed = (point: string) => ({
        [point]: {
            ...(this.getPoint(point) || {
                endpoint: true})
            ,connections: {
                ...defaultConnectionsWithColor(),
                ...this.getPoint(point)?.connections,
            }
        }
    })

    checkIfPathFound = (
        startPaths: IPath[],
        targetPaths: IPath[],
        startPoint: string,
        start = true
    ) => {
        console.log('check path', startPaths, targetPaths, start)
        const lastStartPath = startPaths[startPaths.length - 1]
        const lastTargetPath = targetPaths[targetPaths.length - 1]
        const pathToCheck = start ? lastStartPath : lastTargetPath
        const pathFromTarget = lastTargetPath?.path || []
        if (pathToCheck?.dist === Infinity) {
            return {resultPath: []}
        }
        if (pathToCheck?.dist === 0) {
            console.log('get result path', targetPaths, startPaths, pathToCheck.index)
            const startPath = start
                ? lastStartPath.path
                : lastStartPath.path.slice(0, pathToCheck.index! + 1)
            if (startPath[0] !== startPoint && !startPath.includes(startPoint)) {
                this.removeLinePart(
                    lastStartPath.path.slice(pathToCheck.index!),
                    this.getPossibleColors(startPoint)[0]
                )
            }
            const endPath = start
                ? lastTargetPath.path.slice(1, pathToCheck.index! + 1).reverse()
                : lastTargetPath.path.slice(1).reverse()
            return {
                resultPath: startPath.concat(endPath)
            }
        }
        const lastStart = lastStartPath.path
        return {lastStart, lastTarget: pathFromTarget}
    }

    getNext = (paths: IPath[], passed: ITakenPoints, colors: string[], targets: string[], pathMode: string) => {
        const _paths = Object.assign([], paths) as IPath[]
        while (paths.length > 0) {
            const path = _paths.pop()!.path
            const nextPaths = this.getFreeCells(path, passed, targets, colors, pathMode)
            // console.log('next', path, nextPaths, paths)
            if (nextPaths.length) {
                return _paths.concat(nextPaths)
            }
        }
        return [{dist: -1, path: paths[0].path, target: targets[targets.length -1]}]
    }

    getLineColor = (startLinePoint: string, point: string) => {
        const startColors = this.getPossibleColors(startLinePoint)
        const colors = this.getPossibleColors(point)
        const commonColor = getCommonColor(startColors, colors)
        if (commonColor) return commonColor
        if (colors.length === 1) {
            return colors[0]
        }
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

    getDistantBetweenPoints = (point1: string, point2: string, diag = true) => {
        const ps1 = this.rect[point1].point
        const ps2 = this.rect[point2].point
        return !diag
            ? Math.abs(ps1[0] - ps2[0]) + Math.abs(ps1[1] - ps2[1])
            : Math.sqrt((ps1[0] - ps2[0]) * (ps1[0] - ps2[0]) + (ps1[1] - ps2[1]) * (ps1[1] - ps2[1]))
    }

    // getNearestPoint = (
    //     path: string[],
    //     passed: Partial<ITakenPoints>,
    //     startPointNeighbors: string[],
    //     targetPoint: string,
    //     colors: string[],
    //     pathMode = 'strict'
    // ): {path: string[], passed: Partial<ITakenPoints>, neighbors: string[], finished: boolean} => {
    //     const _passed = Object.assign({}, passed) as Partial<ITakenPoints>
    //     const _path = Object.assign([], path)
    //     const next = {pathPoint: '', dist: Infinity, neighbors: [] as string[], finished: false}
    //     for (const n of startPointNeighbors) {
    //         const dist = this.getDistantBetweenPoints(n, targetPoint)
    //         const nextFree = this.getFreeCells(path.concat(n), _passed, targetPoint, colors, pathMode)
    //         if (nextFree[0] === 'fin') {
    //             _path.push(n)
    //             return {path: _path, passed, neighbors: [], finished: true}
    //         }
    //         if (next.dist > dist && nextFree.length) {
    //             next.dist = dist
    //             next.pathPoint = n
    //             next.neighbors = nextFree
    //         } else if (!nextFree.length) {
    //             _passed[n] = _passed[n] || {
    //                 connections: defaultConnectionsWithColor(DefaultColor),
    //                 endpoint: true
    //             }
    //         }
    //     }
    //     if (next.pathPoint) {
    //         const dir = this.determineDirection(next.pathPoint, path[path.length - 1])
    //         const crossLine = _passed[next.pathPoint]?.crossLine
    //         const color = colors[1] ? DefaultColor : colors[0]
    //         _passed[next.pathPoint] = {
    //             connections: {
    //                 ...defaultConnectionsWithColor(color),
    //                 [dir]: {color, neighbor: next.pathPoint}
    //             },
    //             endpoint: !!crossLine,
    //             crossLine
    //         }
    //         _path.push(next.pathPoint)
    //         return {path: _path, passed: _passed, neighbors: next.neighbors, finished: false}
    //     }
    //     if (!next.pathPoint)
    //     startPointNeighbors.forEach(n => {
    //         _passed[n] = _passed[n] || {
    //             connections: defaultConnectionsWithColor(),
    //             endpoint: true
    //         }
    //     })
    //     return this.getNearestFromPreviousSteps(path, _passed, targetPoint, colors, pathMode)
    // }

    // getNearestFromPreviousSteps = (
    //     path: string[],
    //     passed: Partial<ITakenPoints>,
    //     targetPoint: string,
    //     colors: string[],
    //     trueLine = 'strict'
    // ): {path: string[], passed: Partial<ITakenPoints>, neighbors: string[], finished: boolean} => {
    //     let _path = path.slice(0, -1)
    //     while (_path.length) {
    //         const lastP = _path[_path.length - 1]
    //         this.deletePoint(path[path.length - 1])
    //         const lastPointProps = this.getPoint(lastP)
    //         if (lastPointProps) {
    //             const dir = this.determineDirection(lastP, path[path.length - 1])
    //             this.addTakenPoints({[lastP]: {
    //                 ...lastPointProps,
    //                 connections: {
    //                     ...lastPointProps.connections,
    //                     [dir]: {color: colors.length > 1 ? DefaultColor : colors[0]}
    //                 }
    //             }})
    //         }
    //         const prevStepFreeNeighbors = this.getFreeCells(_path.concat(lastP), passed, targetPoint, colors, trueLine)
    //         if (prevStepFreeNeighbors[0] === 'fin') {
    //             return {finished: true, path: _path, passed, neighbors: []}
    //         }
    //         if (prevStepFreeNeighbors) {
    //             return this.getNearestPoint(_path, passed, prevStepFreeNeighbors, targetPoint, colors, trueLine)
    //         }
    //         _path = _path.slice(0, -1)
    //     }
    //     return {path, passed, neighbors: [], finished: false}
    // }

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
