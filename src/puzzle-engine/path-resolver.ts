import { PuzzleCommons } from "./rect-commons";
import {defaultConnectionsWithColor, getCommonColor, isAppropriateCell} from "../utils/helper-fn";
import {DefaultColor, LineColors} from "../constant/constants";
import {IPath, ITakenPointProps, ITPoints, SA} from "../constant/interfaces";

export class PathResolver extends PuzzleCommons {

    findPath = (sP: string, tP: string, colors: SA, mode = 'soft', forth = false): SA => {
        const key = this.lineEndpoints[`${sP}_${tP}`] ? `${sP}_${tP}` : `${tP}_${sP}`
        console.log('find', sP, tP, colors, mode, key, this.lineEndpoints)
        if (!this.getPoint(sP)
            || (this.getPoint(tP) && !getCommonColor(this.getPossibleColors(tP), colors))
            || !getCommonColor(this.getPossibleColors(sP), colors)) {
            console.error('start point is absent or colors of target and start are different')
            return []
        }
        const lineColor = colors.length > 1 ? DefaultColor : colors[0]
        const startPath = this.getFullLineFromAnyPoint(sP, lineColor).reverse()
        const oneStepTarget = this.checkIOneStepTarget(startPath, [tP], colors, forth)
        if (oneStepTarget.index >= 0) {
            if (mode === 'strict' && oneStepTarget.color !== lineColor) {
                this.removeInterferedLineWhileResolving(tP, oneStepTarget.color)
            }
            return startPath
        }
        let passedFrTg = this.addPassed(tP)
        let passedFrSt = this.addPassed(sP)
        let {stPath, paths: pathsFrSt} = this.getPathsFromStart(startPath, tP, colors, mode, passedFrSt, key)
        if (stPath.length !== startPath.length) {
            this.removeLinePart(startPath.slice(stPath.length - 1), lineColor)
        }
        let ch = this.checkIfPathFound(pathsFrSt, [], sP, startPath, lineColor, true)
        console.warn('look for path', stPath, startPath, lineColor, tP, sP, pathsFrSt)
        if (ch.resultPath) { console.log('result', ch.resultPath); return ch.resultPath }
        let pathsFrTg = this.getFreeCells([tP], passedFrTg, ch.lastStart!, colors, key, mode)
        while (pathsFrTg.length > 0 && pathsFrSt.length > 0) {
            let ch = this.checkIfPathFound(pathsFrSt, pathsFrTg, sP, stPath, lineColor, false)
            if (ch.resultPath) { console.log('result', ch.resultPath); return ch.resultPath }
            pathsFrSt = this.getNext(pathsFrSt, passedFrSt, colors, ch.lastTarget!, stPath, key, mode)
            if (pathsFrSt[0].dist < 0 && stPath.length > 1) {
                const lastPathPoint = stPath.pop()!
                passedFrSt = this.addPassed(lastPathPoint, passedFrSt)
                passedFrTg = this.addPassed(tP)
                const pathStProps= this.getPathsFromStart(stPath, tP, colors, mode, passedFrSt, key)
                pathsFrSt = pathStProps.paths
                stPath = pathStProps.stPath
                ch = this.checkIfPathFound(pathsFrSt, [], sP, stPath, lineColor, true)
                if (ch.resultPath) { console.log('result', ch.resultPath); return ch.resultPath }
                pathsFrTg = this.getFreeCells([tP], passedFrTg, ch.lastStart!, colors, key, mode)
                console.log('restarted', pathsFrSt, pathsFrTg, passedFrSt)
                if (stPath.length !== startPath.length && this.getPoint(startPath[stPath.length])) {
                    this.removeLinePart(startPath.slice(stPath.length - 1), lineColor)
                }
            }
            ch = this.checkIfPathFound(pathsFrSt, pathsFrTg, sP, startPath, lineColor, true)
            if (ch.resultPath) { console.log('result', ch.resultPath); return ch.resultPath }
            pathsFrTg = this.getNext(pathsFrTg, passedFrTg, colors, ch.lastStart!, stPath, key, mode)
        }
        return []
    }

    removeInterferedLineWhileResolving = (point: string, color: string) => {
        const lineToRemove = this.getFullLineFromAnyPoint(point, color)
        this.removeLinePart(lineToRemove, color)
        delete this.lineEndpoints[`${lineToRemove[0]}_${lineToRemove[lineToRemove.length - 1]}`]
        delete this.lineEndpoints[`${lineToRemove[lineToRemove.length - 1]}_${lineToRemove[0]}`]
    }

    getFreeCells = (
        path: SA,
        passed: ITPoints,
        targets: SA,
        colors: SA,
        key: string,
        mode: string,
    ): IPath[] => {
        const point = path[path.length - 1]
        const freeCells = ([] as IPath[]).concat(
            this.getFreeCellsAroundPoint(point, path, passed, targets, colors, key, mode)
        )
        console.log('get free cells', path, targets, freeCells, Object.keys(passed))
        return freeCells.length
            ? freeCells.sort((a, b) => b.dist - a.dist)
            : [{dist: Infinity, path, target: targets[targets.length - 1]}]
    }

    checkTwoStepTarget = (
        path: SA,
        targets: SA,
        passed: ITPoints,
        colors: SA,
        forth: boolean
    ) => {
        const checkedNeighbors = [] as any[]
        for (const neighbor of this.rect[path[path.length -1]].neighbors) {
            if (passed[neighbor] || path.includes(neighbor) || this.getPoint(neighbor)) {
                continue
            }
            const _path = path.concat(neighbor)
            // const {index, color} = this.checkIOneStepTarget(_path, targets, colors)
            // if (index < 0) continue
        }
    }

    // getNeighborsOfTargets = (
    //     path: SA,
    //     targets: SA,
    //     passed: ITPoints,
    // ) => {
    //     const point = path[path.length - 1]
    //     const neighborsOfTarget = [] as any[]
    //     const neighbors = this.rect[point].neighbors
    //     for (const neighbor of neighbors) {
    //         if (passed[neighbor] || path.includes(neighbor)) continue
    //         const index = this.isNeighborOfTarget(neighbor, targets)
    //         if (index >= 0) {
    //             neighborsOfTarget.push({index, point: neighbor})
    //         }
    //     }
    //     return neighborsOfTarget
    // }

    checkIOneStepTarget = (path: SA, targets: SA, colors: SA, forth: boolean) => {
        const point = path[path.length - 1]
        const index = this.isNeighborOfTarget(point, targets)
        if (index >= 0) {
            const pointProps = this.getPoint(point)
            const colorsToCompare = pointProps ? this.getPossibleColors(pointProps) : LineColors
            const commonColor = forth ? colors[0] : getCommonColor(colors, colorsToCompare)
            return !pointProps
                    || (pointProps.endpoint && !!commonColor)
                    || (!pointProps.endpoint && forth)
                ? {index, color: commonColor}
                : {index, color: this.getColors(pointProps.connections)[0]}
        }
        return {index: -1, color: ''}
    }

    checkIfValidNeighbor = (point: string, passed: ITPoints, mode: string) => {

    }

    getFreeCellsAroundPoint = (
        point: string,
        path: SA,
        passed: ITPoints,
        targets: SA,
        colors: SA,
        key: string,
        mode: string
    ): IPath[] => {
        const distFn = mode === 'strict' ? this.getDistantWithMeddling : this.getDistantBetweenPoints
        const freeCells = [] as IPath[]
        const target = targets[targets.length - 1]
        console.log('look for free cells', point, path, this.rect[point].neighbors,
            this.rect[point].neighbors.filter(x => !this.getPoint(x)), Object.keys(this.takenPoints))
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
                console.warn('fin', neighbor, indexOfNeighbor, path, 'apt', appropriateTarget)
                return appropriateTarget
                    ? [{dist: 0, path, target: neighbor, index: indexOfNeighbor}]
                    : [{dist: Infinity, path, target: neighbor}]
            }
            if (commonColor
                && this.getLineNeighbors(neiProps.connections!, commonColor).length
            ) {
                const circle = this.checkIfPointsBelongToSameLine(neighbor, point, commonColor)
                if (circle?.length) {
                    console.error('circle', circle, path, point, neighbor, targets, passed)
                    return [{dist: Infinity, path, target}]
                }
            }
            this.addPassed(neighbor, passed)
            if (mode === 'strict'
                && neiProps
                && (neiProps.crossLine || neiProps.joinPoint)
                && !path.includes(neighbor)
                && !this.getPoint(point)?.endpoint
            ) {
                const dist = distFn(neighbor, target, key)
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
                    const dist = distFn(neighbor, target, key)
                    freeCells.push({dist, path: path.concat(neighbor), target})
                }
            }
        }
        return freeCells.length
            ? freeCells.sort((a, b) => b.dist - a.dist)
            : [{dist: Infinity, path, target: targets[targets.length - 1]}]
    }

    getPathsFromStart = (
        stPath: SA,
        tP: string,
        colors: SA,
        mode: string,
        passedFrSt: ITPoints,
        key: string
    ): {paths: IPath[], stPath: SA} => {
        const _stPath = Object.assign([], stPath)
        let pathsFrSt = this.getFreeCells(stPath, passedFrSt, [tP], colors, key, mode)
        console.log('get path from start', pathsFrSt, stPath, tP, colors, passedFrSt)
        if (pathsFrSt[0].dist < Infinity || stPath.length < 2) {
            return {paths: pathsFrSt, stPath: _stPath}
        }
        while (_stPath.length) {
            const point = _stPath.pop()!
            passedFrSt[point] = {endpoint: true, connections: defaultConnectionsWithColor()}
            pathsFrSt = this.getFreeCells(_stPath, passedFrSt, [tP], colors, key, mode)
            console.log('path from start2', pathsFrSt, _stPath, tP)
            if (pathsFrSt[0].dist < Infinity) return {paths: pathsFrSt, stPath: _stPath}
        }
        return {paths: [{dist: Infinity, path: stPath, target: tP}], stPath: _stPath}
    }

    addPassed = (point: string, passed = {} as ITPoints) => {
        passed[point] = {} as ITakenPointProps
        return passed
    }

    checkIfPathFound = (
        startPaths: IPath[],
        targetPaths: IPath[],
        startPoint: string,
        startPath: SA,
        color: string,
        start = true,
    ) => {
        const lastStartPath = startPaths[startPaths.length - 1]
        const lastTargetPath = targetPaths[targetPaths.length - 1]
        const pathToCheck = start ? lastStartPath : lastTargetPath
        const pathFromTarget = lastTargetPath?.path || []
        console.log('check path', startPaths, targetPaths, start, startPoint, startPath, pathToCheck)
        if (pathToCheck?.dist === Infinity) {
            return {resultPath: []}
        }
        if (pathToCheck?.dist === 0) {
            const index = pathToCheck.index!
            const pathBeginning = start
                ? lastStartPath.path
                : lastStartPath.path.slice(0, pathToCheck.index! + 1)
            const pathEnding = start
                ? lastTargetPath?.path.slice(1, pathToCheck.index! + 1).reverse()
                : lastTargetPath?.path.slice(1).reverse()

            if (start && startPath.length > index) {
                console.warn('line to remove', startPath, index, color, start)
                this.removeLinePart(startPath.slice(index), color)
            }
            return pathEnding?.length
                ? { resultPath: pathBeginning.concat(pathEnding) }
                : { resultPath: pathBeginning }
        }
        const lastStart = lastStartPath.path
        return {lastStart, lastTarget: pathFromTarget}
    }

    getNext = (
        paths: IPath[],
        passed: ITPoints,
        colors: SA,
        targets: SA,
        stPath: SA,
        key: string,
        pathMode: string,
    ) => {
        const _paths = Object.assign([], paths) as IPath[]
        while (_paths.length > 0) {
            let path = _paths.pop()!.path
            const nextPaths = this.getFreeCells(path, passed, targets, colors, key, pathMode)
            console.log('next', path, nextPaths, paths, stPath, colors, targets)
            if (nextPaths[nextPaths.length - 1].dist !== Infinity) {
                return _paths.concat(nextPaths)
            }
            if (_paths.length < 1 && stPath.length > 1) {
                console.log('path to restart', _paths, path, nextPaths, paths[0].path)
                return [{dist: -1, path: paths[0].path, target: targets[targets.length -1]}]
            }
        }
        return [{dist: Infinity, path: paths[0].path, target: targets[targets.length -1]}]
    }

    validateFreeCell = (
        path: SA,
        colors: SA,
        pathMode: string,
    ) => {
        const points = this.takenPoints
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

    isNeighborOfTarget = (point: string, targets: SA): number => {
        for (const nei of this.rect[point].neighbors) {
            const index = targets.indexOf(nei)
            if (index > 0) {
                return index
            }
        }
        return -1
    }


    resolveFinalPoint = (
        neighborsOfTarget: {point:string, index: number}[],
        colors: SA,
        path: SA,
        mode: string,
        targets: SA
    ) => {
        let {point, index} = neighborsOfTarget[0]
        let nextPointProps = this.getPoint(point)
        const commonColor = getCommonColor(this.getPossibleColors(point), colors)
        let appropriateTarget = isAppropriateCell(nextPointProps, mode, !!commonColor)
        console.log(point, index, path)
        if (neighborsOfTarget.length === 1) {
            console.warn('fin', neighborsOfTarget, path, appropriateTarget)
            return appropriateTarget
                ? [{dist: 0, path: path.concat(point), target: targets[index], index}]
                : [{dist: Infinity, path, target: point}]
        }
        if (neighborsOfTarget.length === 2) {
            const bestPoint = neighborsOfTarget.reduce((acc, n) => {
                if (isAppropriateCell(this.getPoint(n.point), mode, !!commonColor)) {
                    acc.ap = true
                    const dist = this.getDistantBetweenPoints(n.point, targets[n.index])
                    if (acc.dist > dist) {
                        acc.dist = dist
                        acc.point = {point: n.point, index: n.index}
                    }
                }
                return acc
            }, {dist: Infinity, ap: false, point: {point: '', index: -1}})
            return bestPoint.ap
                ? [{
                    dist: 0,
                    path: path.concat(bestPoint.point.point),
                    target: targets[bestPoint.point.index]
                }]
                : [{dist: Infinity, path, target: point}]
        }
        return [{dist: Infinity, path, target: point}]
    }



}
