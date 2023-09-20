import { PuzzleCommons } from "./rect-commons";
import {
    copyObj,
    defaultConnectionsWithColor,
    getCommonColor,
    isDev,
    isEqualArrays,
    loopLimit
} from "../utils/helper-fn";
import {DefaultColor, LineColors} from "../constant/constants";
import {
    IDLineProps, IDotConnections,
    INCheck,
    IPath,
    IPathSelect,
    IPCheck,
    IPCheckR,
    ITakenPProps,
    ITPoints,
    SA
} from "../constant/interfaces";

export class PathResolver extends PuzzleCommons {
    fixedLines = [] as SA
    pathCrossLines = [] as SA
    linesOrder = [] as SA
    altLinePaths = {} as {[k: string]: IDLineProps & {paths: IPath[]}}
    passedSt = {} as ITPoints
    passedTg = {} as ITPoints
    restStTargets = [] as IPath[]
    restTgTargets = [] as IPath[]
    stPaths = [] as IPath[]
    tgPaths = [] as IPath[]
    startTurn = true
    forceRePath = false

    findPathResolver = (sP: string, tP: string, colors: SA, mode = 'soft'): SA => {
        // // // console.log('find', sP, tP, colors, mode, this.lineEndpoints)
        if (!this.getPoint(sP)
            || (this.getPoint(tP) && !getCommonColor(this.getPossibleColors(tP), colors))
            || !getCommonColor(this.getPossibleColors(sP), colors)) {
            // console.error('start point is absent or colors of target and start are different')
            return []
        }
        const lineColor = colors.length > 1 ? DefaultColor : colors[0]
        let startPath = this.getFullLineFromAnyPoint(sP, lineColor).reverse()
        const spn = this.checkNeighbors(startPath, [tP], {}, colors, '')
        if (spn.circle) {
           startPath = this.resolveCircleWhileFindingPath(spn.circle, lineColor)
            console.warn('improved startPath', startPath, this.getPoint(startPath[0]),
                this.getPoint(startPath[startPath.length - 1]))
        }
        let passedFrTg = this.addPassed(tP)
        let passedFrSt = this.addPassed(sP)
        let {stPath, paths: pathsFrSt} = this.getPathsFromStart(startPath, tP, colors, mode, passedFrSt)
        if (stPath.length !== startPath.length) {
            this.removeLinePart(startPath.slice(stPath.length - 1), lineColor)
            // console.log(this.getPoint(stPath[stPath.length - 1]))
        }
        let ch = this.checkIfPathFound(pathsFrSt, [], sP, startPath, lineColor, true)
        // console.warn('look for path', stPath, startPath, lineColor, tP, sP, pathsFrSt, ch)
        if (ch.resultPath) {
            // console.log('result', ch.resultPath);
            return ch.resultPath
        }
        let pathsFrTg = this.getFreeCells([tP], passedFrTg, ch.lastStart!, colors, mode)
        const lim = loopLimit(10)
        while (pathsFrTg.length > 0 && pathsFrSt.length > 0 && lim()) {
            let ch = this.checkIfPathFound(pathsFrSt, pathsFrTg, sP, stPath, lineColor, false)
            if (ch.resultPath) { 
                // console.log('result', ch.resultPath);
                return ch.resultPath
            }
            console.warn(ch, pathsFrSt, pathsFrTg, sP, startPath, lineColor, ch.lastTarget)
            pathsFrSt = this.getNext(pathsFrSt, passedFrSt, colors, ch.lastTarget!, stPath, mode)
            if (pathsFrSt[0].dist < 0 && stPath.length > 1) {
                const lastPathPoint = stPath.pop()!
                passedFrSt = this.addPassed(lastPathPoint, passedFrSt)
                passedFrTg = this.addPassed(tP)
                const pathStProps= this.getPathsFromStart(stPath, tP, colors, mode, passedFrSt)
                pathsFrSt = pathStProps.paths
                stPath = pathStProps.stPath
                ch = this.checkIfPathFound(pathsFrSt, [], sP, stPath, lineColor, true)
                if (ch.resultPath) {
                    // // console.log('result', ch.resultPath); return ch.resultPath 
                }
                pathsFrTg = this.getFreeCells([tP], passedFrTg, ch.lastStart!, colors, mode)
                // // console.log('restarted', pathsFrSt, pathsFrTg, passedFrSt)
                if (stPath.length !== startPath.length && this.getPoint(startPath[stPath.length])) {
                    this.removeLinePart(startPath.slice(stPath.length - 1), lineColor)
                }
            }
            ch = this.checkIfPathFound(pathsFrSt, pathsFrTg, sP, stPath, lineColor, true)
            if (ch.resultPath) { 
                // // console.log('result', ch.resultPath);
                return ch.resultPath
            }
            console.log(ch)
            pathsFrTg = this.getNext(pathsFrTg, passedFrTg, colors, ch.lastStart!, stPath, mode)
        }
        return []
    }

    getPathsFromStart = (
        stPath: SA,
        tP: string,
        colors: SA,
        mode: string,
        passedFrSt: ITPoints,
    ): { paths: IPath[], stPath: SA } => {
        const _stPath = Object.assign([], stPath)
        let pathsFrSt = this.getFreeCells(stPath, passedFrSt, [tP], colors, mode)
        // // console.log('get path from start', pathsFrSt, stPath, tP, colors, passedFrSt)
        if (pathsFrSt[0].dist < Infinity || stPath.length < 2) {
            return {paths: pathsFrSt, stPath: _stPath}
        }
        return this.checkPrevPathPoint(_stPath, tP, pathsFrSt, passedFrSt, colors)
    }

    checkPrevPathPoint = (
        stPath: SA,
        target: string,
        pathsFrSt: IPath[],
        passedFrSt: ITPoints,
        colors: SA,
    ): { paths: IPath[], stPath: SA } => {
        while (stPath.length) {
            const point = stPath.pop()!
            passedFrSt[point] = {endpoint: true, connections: defaultConnectionsWithColor()}
            const pathsFrSt = this.getFreeCells(stPath, passedFrSt, [target], colors)
            // // console.log('path from start2', pathsFrSt, stPath, target)
            if (pathsFrSt[0].dist < Infinity) return {paths: pathsFrSt, stPath}
        }
        return {paths: [{dist: Infinity, path: stPath}], stPath}
    }

    resolveCircleWhileFindingPath = (circle: SA, color: string, extraPoint?: string) => {
        this.removeLinePart(circle, color)
        const sP = circle[0]
        const pP = circle[circle.length - 1]
        const pProps = this.getPoint(pP)
        const pointToAdd = extraPoint
            ? {
                [pP]: {
                    ...pProps,
                    connections: {
                        ...pProps.connections,
                        [this.determineDirection(pP, extraPoint)]: {color, neighbor: extraPoint}
                    }
                },
                [extraPoint]: {
                    endpoint: false,
                    connections: {
                        ...defaultConnectionsWithColor(color),
                        [this.determineDirection(extraPoint, pP)]: {color, neighbor: pP},
                        [this.determineDirection(extraPoint, sP)]: {color, neighbor: sP}
                    },
                },
                [sP]: {
                    endpoint: false,
                    connections: {
                        ...defaultConnectionsWithColor(color),
                        [this.determineDirection(sP, extraPoint)]: {color, neighbor: extraPoint}
                    }
                }
            }
            : {
                [pP]: {
                    ...pProps,
                    connections: {
                        ...pProps.connections,
                        [this.determineDirection(pP, sP)]: {color, neighbor: sP}
                    }
                },
                [sP]: {
                    endpoint: false,
                    connections: {
                        ...defaultConnectionsWithColor(color),
                        [this.determineDirection(sP, pP)]: {
                            color, neighbor: pP
                        }
                    }
                }
            }
        this.addTakenPoints(pointToAdd)
        return this.getFullLineFromAnyPoint(sP, color).reverse()
    }

    getFreeCells = (
        path: SA,
        passed: ITPoints,
        targets: SA,
        colors: SA,
        mode = 'soft',
    ): IPath[] => {
        const point = path[path.length - 1]
        const freeCells = ([] as IPath[]).concat(
            this.getFreeCellsAroundPoint(point, path, passed, targets, colors, mode)
        )
        // // console.log('get free cells', path, targets, freeCells, Object.keys(passed))
        return freeCells.length
            ? freeCells.sort((a, b) => b.dist - a.dist)
            : [{dist: Infinity, path}]
    }

    getNext = (
        paths: IPath[],
        passed: ITPoints,
        colors: SA,
        targets: SA,
        stPath: SA,
        pathMode: string,
    ) => {
        console.warn(targets)
        const _paths = Object.assign([], paths) as IPath[]
        const lim = loopLimit(10)
        while (_paths.length > 0 && lim()) {
            let path = _paths.pop()!.path
            const nextPaths = this.getFreeCells(path, passed, targets, colors, pathMode)
            // // console.log('next', path, nextPaths, paths, stPath, colors, targets)
            if (nextPaths[nextPaths.length - 1].dist !== Infinity) {
                return _paths.concat(nextPaths)
            }
            if (_paths.length < 1 && stPath.length > 1) {
                // // console.log('path to restart', _paths, path, nextPaths, paths[0].path)
                return [{dist: -1, path: paths[0].path, target: targets[targets.length -1]}]
            }
        }
        return [{dist: Infinity, path: paths[0].path, target: targets[targets.length -1]}]
    }

    validateFreeCell = (
        path: SA,
        colors: SA,
        mode?: string,
    ) => {
        const point = path[path.length - 1]
        const totalNeighbors = this.rect[point].neighbors

        for (const n of totalNeighbors) {
            if (n === path[path.length - 2]) continue
            if (path.includes(n)) {
                return false
            }
            const {crossLine} = this.getPoint(point) || {}
            if (crossLine && mode && !getCommonColor(crossLine, colors)) {
                return false
            }
        }
        return true
    }

    checkNeighborS = (
        point: string,
        tgs: SA,
        colors: SA,
        path: SA,
        result: INCheck,
        passed: ITPoints,
    ) => {
        passed[point] = {} as ITakenPProps
        const {endpoint, connections, crossLine} = this.getPoint(point) || {}
        const {pathInd, index, dist, commonColor} =
            this.getNeighborProps(point, colors, path, tgs)
        const {fin, onlyPath} = result.paths[0] || {}
        if ((endpoint && !crossLine && !commonColor) || onlyPath) { return }
        const nextPath = { dist, index, path: path.concat(point) } as IPath
        if (path.length > 3 && pathInd >= 0) {
            if (!this.getPoint(point) || !this.getPoint(path[pathInd])) { return }
            const color = colors.length === 1 ? colors[0] : DefaultColor
            const circle = this.checkIfPointsBelongToSameLine(path[pathInd], point, color)
            result.circle = circle.length ? circle : undefined
        }
        if (dist === 0) {
            result.paths.length = !fin ? 0 : result.paths.length
            nextPath.fin = true
            result.fin = Infinity
            result.paths.push(nextPath)
            return result
        }
        if (!connections || (crossLine && !commonColor)) {
            result.paths.push(nextPath)
        } else if (commonColor) {
            nextPath.onlyPath = point
            result.onlyPath = point
            result.paths.push(nextPath)
        }
        return result
    }


    getFreeCellsAroundPoint = (
        point: string,
        path: SA,
        passed: ITPoints,
        targets: SA,
        colors: SA,
        mode: string
    ): IPath[] => {
        const distFn = this.getDistantBetweenPoints
        const freeCells = [] as IPath[]
        if (!targets) {
            console.error(path, targets)
        }
        const target = targets[targets.length - 1]
        // // console.log('look for free cells', point, path, this.rect[point].neighbors,
        // this.rect[point].neighbors.filter(x => !this.getPoint(x)), Object.keys(this.takenPoints))
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
                // // console.warn('fin', neighbor, indexOfNeighbor, path, 'apt', appropriateTarget)
                return appropriateTarget
                    ? [{dist: 0, path, index: indexOfNeighbor}]
                    : [{dist: Infinity, path}]
            }
            if (commonColor
                && this.getLineNeighbors(neiProps.connections!, commonColor).length
            ) {
                const circle = this.checkIfPointsBelongToSameLine(neighbor, point, commonColor)
                if (circle?.length) {
                    // // console.error('circle', circle, path, point, neighbor, targets, passed)
                    return [{dist: Infinity, path}]
                }
            }
            this.addPassed(neighbor, passed)
            if (mode === 'strict'
                && neiProps
                && (neiProps.crossLine || neiProps.joinPoint)
                && !path.includes(neighbor)
                && !this.getPoint(point)?.endpoint
            ) {
                const dist = distFn(neighbor, target)
                return commonColor
                    ? [{path: path.concat(neighbor), dist}]
                    : [{dist: Infinity, path}]
            }
            if (!neiProps
                || (!neiProps.endpoint && !commonColor && !mode)
                || ((neiProps.joinPoint || neiProps.crossLine) && commonColor)
            ) {
                const validFreeCell = this.validateFreeCell(path.concat(neighbor), colors, mode)
                if (validFreeCell || (neiProps?.endpoint && commonColor)) {
                    const dist = distFn(neighbor, target)
                    freeCells.push({dist, path: path.concat(neighbor)})
                }
            }
        }
        return freeCells.length
            ? freeCells.sort((a, b) => b.dist - a.dist)
            : [{dist: Infinity, path,}]
    }

    addPassed = (point: string, passed = {} as ITPoints) => {
        passed[point] = {} as ITakenPProps
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
        // // console.log('check path', startPaths, targetPaths, start, startPoint, startPath, pathToCheck)
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

            if (start && startPath.length - 1 > index) {
                console.warn('line to remove', startPaths, index, color, start)
                this.removeLinePart(startPath.slice(index), color)
            }
            return pathEnding?.length
                ? { resultPath: pathBeginning.concat(pathEnding) }
                : { resultPath: pathBeginning }
        }
        const lastStart = lastStartPath.path
        return {lastStart, lastTarget: pathFromTarget}
    }

    // function for puzzle creator
    findPath = (sP: string, tP: string, colors: SA, key: string, ll = 0): SA => {
        ll++
        if (!this.getPoint(sP)?.endpoint || !this.getPoint(tP)?.endpoint) {
            return []
        }
        let {checkResT, checkRes, nextTg, stTargets} = this.preFind(sP, tP, colors, key)
        const end = checkResT.paths.filter(p => p.fin)[0]
        if (end) {
            const line = this.concatPath(stTargets, end.path, end.index!)
            const restPaths =  checkResT.paths.filter(p => !p.fin)
            this.addAltLinePaths(line, colors[0], restPaths, key)
            return line
        }
        this.stPaths = checkRes.paths
        this.tgPaths = checkResT.paths
        const lim = loopLimit()
        while (checkRes.paths.length > 0 && checkResT.paths.length > 0 && lim()) {
            console.log('paths', checkRes, checkResT, copyObj(this.altLinePaths))
            this.startTurn = true
            const targets = nextTg.path || this.chooseTargets(checkResT.paths).path
            checkRes = this.getNextPaths(this.passedSt, colors, key)
            this.stPaths = checkRes.paths
            console.log('paths 2', this.stPaths, this.tgPaths)
            if (!checkRes.paths.length) { return [] }
            if (checkRes.restart) {
                return this.resolveRestart(ll, sP, tP, colors, key)
            }
            this.resolveOnlyPath(checkRes)
            this.startTurn = false
            const nextSt = this.chooseTargets(checkRes.paths)
            if (this.restStTargets.length !== checkRes.paths.length - 1) {
                console.error('choose target fails', this.restStTargets, copyObj(checkRes), nextSt)
            }
            if (nextSt.fin) {
                const line = this.concatPath(nextSt.path, targets, nextSt.index!)
                const restPaths =  checkRes.paths.filter(p => !p.fin)
                this.addAltLinePaths(line, colors[0], restPaths, key)
                return line
            }
            checkResT = this.getNextPaths(this.passedTg, colors, key)
            this.tgPaths = checkResT.paths
            console.log('paths 3', this.stPaths, this.tgPaths, checkResT)
            if (!checkResT.paths.length) { return [] }
            this.resolveOnlyPath(checkResT)
            if (checkResT.restart) {
                return this.resolveRestart(ll, sP, tP, colors, key)
            }
            this.startTurn = true
            nextTg = this.chooseTargets(checkResT.paths)
            if (this.restTgTargets.length !== checkResT.paths.length - 1) {
                console.error('choose target fails', this.restTgTargets, copyObj(checkResT), nextTg)
            }
            if (nextTg.fin) {
                const line = this.concatPath(nextSt.path, nextTg.path, nextTg.index!, false)
                const restPaths =  checkResT.paths.filter(p => !p.fin)
                this.addAltLinePaths(line, colors[0], restPaths, key)
                return line
            }
        }
        return []
    }

    preFind = (sP: string, tP: string, colors: SA, key: string) => {
        const targets = this.pathCrossLines.length ? this.pathCrossLines : [tP]
        this.passedSt = this.addPassed(sP)
        this.passedTg = this.addPassed(tP)
        const checkRes =
            this.checkNeighbors([sP], targets, this.passedSt, colors, key)
        this.resolveOnlyPath(checkRes)
        this.startTurn = false
        const stTargets = this.pathCrossLines.length
            ? this.pathCrossLines
            : this.chooseTargets(checkRes.paths).path
        const checkResT =
            this.checkNeighbors([tP], stTargets, this.passedTg, colors, key)
        this.resolveOnlyPath(checkResT)
        const nextTg = {} as IPath
        return {checkRes, checkResT, nextTg, stTargets}
    }

    resolveRestart = (loop: number, sP: string, tP: string, colors: SA, key: string) => {
        isDev() && console.error('restart', copyObj(this.altLinePaths))
        return loop < LineColors.length
            ? this.findPath(sP, tP, colors, key, loop)
            : []
    }

    getNextPaths = (
        passed: ITPoints,
        colors: SA,
        key: string,
    ): INCheck => {
        if (!this.stPaths.length || !this.tgPaths.length) {
            console.error('no paths 0 ', colors)
        }
        let pathToCheck = {} as IPath, oneLoop = true
        while (oneLoop || pathToCheck) {
            let nSP = this.chooseStsTgs()
            !oneLoop && this.changePath(pathToCheck.path, nSP.pathToCheck.path)
            pathToCheck = nSP.pathToCheck
            this[this.startTurn ? 'stPaths' : 'tgPaths'] = nSP.restPaths
            isDev() && console.log('get next', this.stPaths, this.startTurn, this.tgPaths, nSP, colors)
            if (!pathToCheck.path.length) {
                return {paths: []}
            }
            if (nSP.lineRemoved) {
                return {paths: [{} as IPath], restart: true}
            }
            const { paths: nextPaths, noPath } =
                this.checkNeighbors(pathToCheck.path, nSP.targets, passed, colors, key)
            isDev() && console.log('get next check neis', nextPaths, noPath, this.stPaths, this.tgPaths, )
            if (noPath) {
                console.error('no path', nextPaths)
                return {noPath, paths: []}
            }
            if (nextPaths.length) {
                this[this.startTurn ? 'stPaths' : 'tgPaths'] = nextPaths
                console.log('next res', nextPaths, pathToCheck, nextPaths.concat(nSP.restPaths))
                return {paths: nextPaths.concat(nSP.restPaths)}
            }
            oneLoop = false
        }
        return {noPath: true, paths: []}
    }

    // getNextPaths = (
    //     passed: ITPoints,
    //     colors: SA,
    //     key: string,
    // ): INCheck => {
    //     if (!this.stPaths.length || !this.tgPaths.length) {
    //         console.error('no paths 0 ', colors)
    //     }
    //     let {targets, pathToCheck, lineRemoved, restPaths} = this.chooseStsTgs()
    //     if (!pathToCheck.path.length) {
    //         console.error('no path length', restPaths, pathToCheck, this.stPaths, this.tgPaths, this.startTurn)
    //         return {paths: []}
    //     }
    //     console.log('get next', this.stPaths, this.startTurn, this.tgPaths, restPaths, pathToCheck, colors, lineRemoved)
    //     if (lineRemoved) {
    //         return {paths: [{} as IPath], restart: true}
    //     }
    //     this[this.startTurn ? 'stPaths' : 'tgPaths'] = restPaths
    //     while (pathToCheck) {
    //         const { paths: nextPaths, noPath } =
    //             this.checkNeighbors(pathToCheck.path, targets, passed, colors, key)
    //         console.log('get next check neis', nextPaths, this.stPaths, this.tgPaths, this.startTurn, pathToCheck)
    //         if (noPath) {
    //             console.error('no path', nextPaths, this.stPaths, this.tgPaths, this.startTurn)
    //             return {noPath, paths: []}
    //         }
    //         if (nextPaths.length) {
    //             this[this.startTurn ? 'stPaths' : 'tgPaths'] = nextPaths
    //             console.log('next res', nextPaths, pathToCheck, nextPaths.concat(restPaths))
    //             return {paths: nextPaths.concat(restPaths)}
    //         }
    //         const nextStepProps = this.chooseStsTgs()
    //         if (!nextStepProps.pathToCheck.path.length) {
    //             console.error('no path length', restPaths, pathToCheck, this.stPaths, this.tgPaths, this.startTurn)
    //             return {paths: []}
    //         }
    //         this.changePath(pathToCheck.path, nextStepProps.pathToCheck.path)
    //         if (nextStepProps.lineRemoved) {
    //             return {paths: [{} as IPath], restart: true}
    //         }
    //         if (!nextStepProps.pathToCheck.path.length && !restPaths.length) {
    //             return {noPath: true, paths: []}
    //         }
    //         restPaths = nextStepProps.restPaths
    //         this[this.startTurn ? 'stPaths' : 'tgPaths'] = restPaths
    //         targets = nextStepProps.targets
    //         pathToCheck = nextStepProps.pathToCheck
    //     }
    //     return {noPath: true, paths: []}
    // }

    //
    // getNextPaths1 = (
    //     paths: IPath[],
    //     targets: SA,
    //     passed: ITPoints,
    //     colors: SA,
    //     key: string,
    // ): INCheck => {
    //     let {paths: restPaths, pathToCheck, lineRemoved} = this.choosePath(paths, key)
    //     if (lineRemoved) {
    //         return {paths, restart: true}
    //     }
    //     console.log('get next', paths, targets, restPaths, pathToCheck, colors, lineRemoved)
    //     if (!pathToCheck.path.length) {
    //         console.error('no path length', paths, pathToCheck, restPaths)
    //         return {paths: []}
    //     }
    //     // const lim = loopLimit(10)
    //     while (pathToCheck) {
    //         const {
    //             paths: nextPaths,
    //             circle,
    //         } = this.checkNeighbors(pathToCheck.path, targets, passed, colors, key, )
    //         if (nextPaths.length || !paths.length) {
    //             console.log('next res', nextPaths, pathToCheck)
    //             return {paths: nextPaths, circle}
    //         }
    //         const nextProps = this.choosePath(paths, key)
    //         if (nextProps.lineRemoved) {
    //             return {paths, restart: true}
    //         }
    //         if (!nextProps.pathToCheck.path.length) {
    //             return {noPath: true, paths: []}
    //         }
    //         paths = nextProps.paths
    //         pathToCheck = nextProps.pathToCheck
    //     }
    //     return {noPath: true, paths: []}
    // }

    addAltLinePaths = (line: SA, color: string, paths: IPath[], key: string) => {
        this.altLinePaths[key] = {line, color, paths}
        console.log('alt line added', copyObj(this.altLinePaths))
    }

    resolveOnlyPath = (result: INCheck) => {
        const onlyPath = result.onlyPath
            || result.paths.filter(p => p.onlyPath)[0]?.onlyPath
        if (onlyPath) {
            this.pathCrossLines = this.pathCrossLines.filter(p => p !== onlyPath)
        }
    }

    checkIfPointReplaceable = (
        point: string,
        colors: SA,
        prev: string,
        counter = loopLimit(5)) => {
        const neighbors = this.rect[point].neighbors
        const furtherPaths = [] as {onlyPath?: string}[]
        for (const neighbor of neighbors) {
            if (neighbor === prev) continue
            const {crossLine, joinPoint, endpoint, connections} = this.getPoint(neighbor) || {}
            if (crossLine || joinPoint) {
                if(!getCommonColor((crossLine || joinPoint)!, colors)) {
                    return null
                }
                return {onlyPath: neighbor}
            } else if (!connections) {
                furtherPaths.push({})
            } else if (!endpoint) {
                const count = counter()
                const furtherPath = count
                    ? this.checkIfPointReplaceable(neighbor, colors, point, counter)
                    : null
                if (furtherPath) {
                    furtherPaths.push(furtherPath)
                }
            }
        }
        return furtherPaths.length > 0 ? furtherPaths[0] : null
    }

    choosePath = (paths: IPath[]) => {
        let {freePaths, blockedPaths} = this.splitPaths(paths)
        const selectedResult = !freePaths.length
            ? this.resolveBlockedPath(blockedPaths)
            : this.resolveFreePath(freePaths)
        const pathToCheck = selectedResult.pathToCheck
        freePaths = selectedResult.freePaths || freePaths
        blockedPaths = selectedResult.blockedPaths || blockedPaths

        return {
            pathToCheck,
            paths: freePaths.concat(blockedPaths),
            lineRemoved: selectedResult.lineRemoved
        }
    }

    chooseTargets = (paths: IPath[]): IPath => {
        if (this.pathCrossLines.length) {
            return {path: this.pathCrossLines, index: -1} as IPath
        }
        let {freePaths, blockedPaths} = this.splitPaths(paths)
        const selectedPath = !freePaths.length && blockedPaths.length
            ? this.chooseBlockedPath(blockedPaths)
            : freePaths.sort((a, b) => a.dist - b.dist).shift()!
        const prop = this.startTurn ? 'restTgTargets' : 'restStTargets'
        this[prop] = selectedPath.blocked
            ? freePaths.concat(blockedPaths.filter(p => !isEqualArrays(selectedPath.path, p.path)))
            : freePaths.concat(blockedPaths)
        if (this[prop].length !== paths.length - 1) {
            console.error('fail select target', selectedPath, paths, this[prop], freePaths, blockedPaths)
        }
        return selectedPath
    }

    chooseStsTgs = () => {
        const [stPs, tgPs] = this.startTurn
            ? [this.stPaths, this.tgPaths]
            : [this.tgPaths, this.stPaths]
        if (!stPs.length || !tgPs.length) {
            console.error('no paths', this.stPaths, this.tgPaths, this.startTurn)
            throw new Error('no paths to select next')
        }
        const targets = this.chooseTargets(tgPs).path
        const {pathToCheck, paths: restPaths, lineRemoved} = this.choosePath(stPs)
        return {targets, pathToCheck, restPaths, lineRemoved}
    }

    concatPath = (start: SA, end: SA, index: number, st = true) => {
        const res = st
            ? start.concat(end.slice(0, index).reverse())
            : start.slice(0, index).concat(end.reverse())
        console.warn('concat result', start, end, index, res, st, res)
        return res
    }

    // t.514593131 konstantin

    splitPaths = (paths: IPath[]) => {
        return paths.reduce((acc, p) => {
            if (p.blocked) {
                acc.blockedPaths.push(p)
            } else {
                acc.freePaths.push(p)
            }
            return acc
        }, {freePaths: [] as IPath[], blockedPaths: [] as IPath[]})
    }

    resolveFreePath = (paths: IPath[]): IPathSelect => {
        const freePaths = paths
        const onlyPathIndex = freePaths
            .sort((a, b) => a.dist - b.dist)
            .findIndex(p => p.onlyPath)
        if (onlyPathIndex >= 0) {
            return {
                pathToCheck: freePaths[onlyPathIndex],
                freePaths: freePaths.filter((p, i) => i !== onlyPathIndex)
            }
        }
        const pathToCheck = paths.sort((a, b) => a.dist - b.dist).shift()!
        return {freePaths, pathToCheck}
    }

    resolveBlockedPathToCheck = (blockedPaths: IPath[], pathToCheck: IPath) => {
        const key = pathToCheck.blocked!
        if (!pathToCheck.blocked || !this.altLinePaths[key]) {
            console.error(pathToCheck, this.altLinePaths, blockedPaths)
            throw new Error('blocked line absent')
        }
        const lineToRemove = this.altLinePaths[key].line
        const color = this.altLinePaths[key].color
        const path = pathToCheck.path
        const point = path[path.length - 1]
        const {connections, crossLine} = this.getPoint(point) || {}
        if (connections && !crossLine && this.getColors(connections)[0] === color) {
            this.removeInterferingLineWhileFinding(key, lineToRemove, color)
            console.warn('remove interfer', color, Object.keys(this.altLinePaths),
                [...this.fixedLines], pathToCheck)
        }
        return pathToCheck.path.length
            ? {pathToCheck, blockedPaths, lineRemoved: true}
            : {pathToCheck, blockedPaths: []}
    }

    resolveBlockedPath = (paths: IPath[]): IPathSelect => {
        let blockedPaths = (Object.assign([], paths) as IPath[])
            .sort((a, b) => a.dist - b.dist)
        let pathToCheck = {path: [] as SA, dist: Infinity} as IPath
        for (let i = 0; i < blockedPaths.length; i++) {
            const key = blockedPaths[i].blocked!
            if (!this.fixedLines?.includes(blockedPaths[i].blocked!)
                && !isEqualArrays(this.altLinePaths[key].line, this.lineEndpoints[key].line)) {
                pathToCheck = blockedPaths[i]
                blockedPaths = blockedPaths.filter((p,j) => i !== j)
                break
            }
        }
        if (!pathToCheck.path.length) {
            console.error('no blocked path to remove', this.fixedLines, blockedPaths, paths,)
        }
        return pathToCheck.path.length
            ? this.resolveBlockedPathToCheck(blockedPaths, pathToCheck)
            : {pathToCheck, blockedPaths}
    }

    chooseBlockedPath = (paths: IPath[], start = true) => {
        const pathsToCheck = paths.sort((a, b) => a.dist - b.dist)
        let pathToCheck = pathsToCheck[0]
        for (let j = 1; j < pathsToCheck.length; j++) {
            if (!this.fixedLines?.includes(pathsToCheck[j].blocked!)) {
                pathToCheck = pathsToCheck[j]
                break
            }
        }
        return pathToCheck
    }

    checkNeighbors = (
        path: SA,
        tgs: SA,
        passed: ITPoints,
        colors: SA,
        key = '',
        result = {paths: []} as INCheck
    ): INCheck => {
        const point = path[path.length - 1]
        const neighbors = this.rect[point].neighbors
        // console.log('start check neighbors', neighbors, path, tgs)
        for (const neighbor of neighbors) {
            if (neighbor === path[path.length - 2] || passed[neighbor]) {
                continue
            }
            key &&  this.checkNeighbor(neighbor, tgs, colors, path, result, passed, key)
            !key && this.checkNeighborS(neighbor, tgs, colors, path, result, passed)
            console.warn('checking neigh res', neighbor, tgs, path, copyObj(result))
        }
        result.paths.sort((a, b) => a.dist! - b.dist!)
        console.warn('checking neighbors result', path, tgs, neighbors, copyObj(result.paths))
        return result
    }

    getNeighborProps = (point: string, colors: SA, path: SA, tgs: SA) => {
        const distFn = this.getDistantBetweenPoints
        const commonColor = getCommonColor(this.getPossibleColors(point), colors)
        const index = tgs.indexOf(point)
        const pathInd = path.slice(0, -2).indexOf(point)
        const target = tgs[tgs.length - 1]
        const dist = index >= 0 ? 0 : distFn(point, target,  '1')
        return {index, target, dist, pathInd, commonColor}
    }

    changePath = (oldPath: SA, newPath: SA) => {
        for (const point of oldPath) {
            if (!newPath.includes(point)) {
                delete this[this.startTurn ? 'passedSt' : 'passedTg'][point]
            }
        }
    }

    checkNeighbor = (
        point: string,
        tgs: SA,
        colors: SA,
        path: SA,
        result: INCheck,
        passed: ITPoints,
        key: string
    ) => {
        const lastOfPath = path[path.length - 1]
        passed[point] = {} as ITakenPProps
        const {endpoint, connections, crossLine, joinPoint} = this.getPoint(point) || {}
        const {index, commonColor, dist, target} =
            this.getNeighborProps(point, colors, path, tgs)
        const {fin, onlyPath} = result.paths[0] || {}
        // console.log('check path', point, path, tgs, colors, copyObj(result), dist, index, commonColor)
        if ((endpoint && !commonColor) || result.noPath || (fin && dist !== 0)) {
            if (crossLine && !this.getPoint(lastOfPath) && !commonColor) {
                result.noPath = true
                result.paths.length = 0
            }
            return
        }
        const nextPath = { dist, index, path: [...path].concat(point) } as IPath
        if (dist === 0) {
            nextPath.fin = !this.pathCrossLines.length
        }
        if (connections && !endpoint) {
            if (commonColor) { return }
            return this.resolveReplaceable(point, colors, nextPath, result, lastOfPath)
        }
        if (commonColor) {
            const mCon = crossLine || joinPoint
            return this.resolveEndpoint(point, nextPath, result, mCon, onlyPath, fin)
        }
        if (!connections
            && this.rect[point].neighbors.length === 2
            && this.getPoint(lastOfPath)?.endpoint) {
            nextPath.onlyPath = point
            result.onlyPath = point
            result.paths.length = 0
            result.paths.push(nextPath)
            return
        }
        // console.log('result before path validation', copyObj(result), nextPath)
        const valPath = this.validatePath(nextPath.path, tgs, colors, key)
        // console.log('result after path validation', copyObj(result), valPath)
        if (!valPath.path.length) {
            console.error('path validation failed', copyObj(result), point)
            return result
        }
        if (valPath.rePaths?.length) {
            this.resolveTrueRePath(valPath,result, nextPath, target)
        } else {
            nextPath.path = valPath.path
        }
        if (dist === 0) result.paths.length = !fin ? 0 : result.paths.length
        result.paths.push(nextPath)
        console.log('path validation passed', path, point, valPath,
            copyObj(result), copyObj(nextPath))
        return result
    }

    resolveTrueRePath = (valRes: IPCheck, result: INCheck, nextPath: IPath, tg: string) => {
        valRes.rePaths!.forEach(rePath => {
            nextPath.path = rePath
            const rePoint = rePath[rePath.length - 1]
            nextPath.dist = this.getDistantBetweenPoints(rePoint, tg)
            // console.error('new dist', copyObj(nextPath), rePath, point, dist)
        })
    }

    resolveEndpoint = (
        point: string,
        nextPath: IPath,
        result: INCheck,
        multiConn?: SA,
        onlyPath?: string,
        fin?: boolean,
    ) => {
        if (!multiConn && !nextPath.fin) {
            return result
        }
        if (multiConn && !onlyPath && !fin) {
            result.paths.length = 0
        }
        if (!nextPath.fin) {
            nextPath.onlyPath = point
            result.onlyPath = point
        }
        result.paths.push(nextPath)
        return result
    }

    resolveReplaceable = (
        point: string,
        colors: SA,
        nextPath: IPath,
        result: INCheck,
        lastOfPath: string
    ) => {
        const LE = this.getPoint(point).lineEndpoints!
        const isReplaceable = this.checkIfPointReplaceable(point, colors, lastOfPath)
        const nKey = this.getLineKey(LE[0], LE[1])
        if (isReplaceable) {
            nextPath.blocked = nKey
            nextPath.onlyPath = isReplaceable.onlyPath || ''
            result.paths.push(nextPath)
        }
        return
    }

    checkEndpoint = (
        nei: string,
        props: ITakenPProps,
        path: SA,
        tgs:SA,
        key: string
    ): boolean => {
        if (props.crossLine) {
            return this.fitEndpoint(props.lineEndpoints || [], key)
        }
        const numOfColors = this.getPossibleColors(nei).length
        let targets = tgs
        let numOfFreeNeighbors = this.freeNeighborsNumber(nei, path, targets)
        let restTargets = this.startTurn ? this.restTgTargets : this.restStTargets
        let valid = numOfFreeNeighbors >= numOfColors
        while (restTargets.length && !valid) {
            targets = this.chooseTargets(restTargets).path
            restTargets = this.startTurn ? this.restTgTargets : this.restStTargets
            numOfFreeNeighbors = this.freeNeighborsNumber(nei, path, targets)
            valid = numOfFreeNeighbors >= numOfColors
            const prop = this.startTurn ? 'tgPaths' : 'stPaths'
            const index = this[prop].findIndex(p => isEqualArrays(p.path, targets)) // = this[prop].filter(p => !isEqualArrays(p.path, targets))
            console.error('index to change dist', index, prop, this[prop], valid, path)
            this[prop][index].dist = valid ? .01 : Infinity
        }
        return valid
    }

    checkLinePoint = (props: ITakenPProps, colors: SA) => {
        return !getCommonColor(colors, this.getColors(props.connections))
    }

    fitEndpoint = (le: SA, key: string) => {
        return !!le.filter(p => key.includes(p)).length
    }

    removeInterferingLineWhileFinding = (key: string, line: SA, color: string) => {
        this.removeLinePart(line, color)
        delete this.altLinePaths[key]
    }

    validatePath = (path: SA, tgs: SA, colors: SA, key: string): IPCheck => {
        const result = {
            path: Object.assign([], path) as SA,
            rePaths: [] as SA[],
        } as IPCheck
        console.error('val path', path, copyObj(result))
        for (const neighbor of this.rect[path[path.length - 1]].neighbors) {
            if (neighbor === path[path.length - 2] || tgs.includes(neighbor)) continue
            const index = path.indexOf(neighbor)
            if (index >= 0) {
                console.error('circle', path, index, neighbor)
                result.path = path.slice(0, index + 1).concat(path[path.length - 1])
            }
            const nProps = this.getPoint(neighbor) || {}
            // console.error('nei', neighbor, nProps)
            if (nProps.connections) {
                const checkRes = nProps.endpoint
                    ? this.checkEndpoint(neighbor, nProps, path, tgs, key)
                    : this.checkLinePoint(nProps, colors)
                if (!checkRes) {
                    result.path.length = 0
                    break
                }
            } else {
                const pocket = this.checkPocket(path, neighbor, colors, tgs)
                if (pocket.rePath?.length) {
                    result.rePaths?.push(pocket.rePath)
                }
                if (!pocket.path.length) {
                    result.path = []
                }
                console.warn('pocket res', pocket, path, neighbor, copyObj(result))
            }
        }
        console.log('path validation', path, tgs, copyObj(result))
        return result
    }



    checkPocket = (path: SA, neighbor: string, colors: SA, tgs:SA): IPCheck => {
        const res = {path} as IPCheck
        const pockData = this.collectPocketData(neighbor, path, colors, tgs) as IPCheckR
        let {
            freePath,
            pathsToJoin,
            noPath: neiNoPath,
            isolated,
            taken,
            indexes
        } = pockData
        // console.log('pocket data', pockData, neighbor, path)
        const diffColors =  new Set(pathsToJoin).size
        const pairPoints = diffColors < pathsToJoin.length
        if ((((freePath.length === 1 && !pathsToJoin.length)
            || (!pairPoints && !freePath.length))
            && neiNoPath.length)
            || isolated.length
        ) {
            return {path: []}
        }
        if (this.forceRePath
            && (freePath.length === 1
            && !pathsToJoin.length
            && !this.getPoint(neighbor)
            && !tgs.includes(neighbor))
        ) {
            let rePath
            if (taken.length === 1) {
                rePath = path.concat(neighbor)
            } else if (taken.length === 2) {
                const firstIndex = Math.min(
                    indexes[0],
                    (indexes.length === 2 ? indexes[1] : Infinity)
                )
                rePath = indexes.length === 1
                    ? path.slice(0, firstIndex + 1).concat(neighbor)
                    : this.concatRePath(neighbor, path)
            }
            if (rePath) {
                const valRePath = this.validateRePath(rePath, tgs, colors, path.slice(0, -1))
                this.resolveRePathCase(rePath, res, valRePath)
            }
        }
        return res
    }

    resolveRePathCase = (rePath: SA, res: IPCheck, validRePath: boolean) => {
        if (validRePath) {
            console.error('re-path',  rePath)
            res.rePath = rePath
        } else {
            console.error('failed re-path', rePath)
            res.rePath = []
            res.path = []
        }
    }

    checkPathForNoose = (path: SA): boolean => {
        for (let i = 0; i < path.length; i++) {
            const {neighbors} = this.rect[path[i]] || {}
            for (const nei of neighbors) {
                if (nei === path[i - 1] || nei === path[i + 1]) continue
                if (path.includes(nei)) return false
            }
        }
        return true
    }

    concatRePath = (newLinePoint: string , path: SA) => {
        return path.slice(0, -2).concat(newLinePoint).concat(path[path.length - 1])
    }

    validateRePathPoint = (point: string, path: SA, tgs: SA, colors: SA, first = false) => {
        console.warn('validate re-path point', point , path, tgs, colors)
        for (const nei of this.rect[point].neighbors) {
            if (this.getPoint(nei) || path.includes(nei)) {
                continue
            }
            if (tgs.includes(nei)) {
                return true
            }
            const {
                freePath,
                pathsToJoin,
                taken,
                indexes,
            } = this.collectPocketData(nei, path, colors, tgs)
            console.warn('validate re path point2', nei, freePath, pathsToJoin, indexes, taken)
            if (first && taken.length === indexes.length && indexes.length < 2) {
                continue
            }
            if ((freePath.length === 1 && !pathsToJoin.length)
                || (!freePath.length && new Set(pathsToJoin).size === pathsToJoin.length)
            ) {
                return false
            }
        }
        return true
    }

    validateRePath = (rePath: SA, tgs: SA, colors: SA, path: SA) => {
        console.warn('val re path', rePath, path, tgs)
        const noNoose = this.checkPathForNoose(rePath)
        if (!noNoose) return false
        if (this.getPoint(path[path.length - 2])
            && !rePath.includes(path[path.length - 2]))
            return false
        for (const point of rePath.slice(0, -1)) {
            console.warn('val re path point', point, rePath)
            if (!this.validateRePathPoint(point, rePath, tgs, colors, point === rePath[0])) {
                return false
            }
        }
        return true
    }

    freeNeighborsNumber = (point: string, path: SA, tgs: SA) => {
        const freePaths = [] as number[]
        const neighbors = this.rect[point].neighbors
        for (const neighbor of neighbors) {
            const neiProps = this.getPoint(neighbor) || {}
            if (!neiProps.endpoint
                && !path.includes(neighbor)
                && !tgs.includes(neighbor)) {
                freePaths.push(1)
            }
        }
        return freePaths.length
    }

    collectPocketData = (lineNeighbor: string, path: SA, colors: SA, tgs: SA) =>  {
        // console.warn('collect data', lineNeighbor)
        const result = {
            freePath: [] as SA,
            resolved: []  as SA,
            isolated: [] as SA,
            noPath: [] as SA,
            pathsToJoin: [] as SA,
            blocked: [] as SA,
            indexes: [] as number[],
            taken: [] as SA
        } as IPCheckR
        const neighbors = this.rect[lineNeighbor].neighbors
        for (const nei of neighbors) {
            const {
                crossLine,
                connections,
                endpoint,
                joinPoint,
                lineEndpoints
            } = this.getPoint(nei) || {}
            const pInd = path.indexOf(nei)
            const tInd = tgs.indexOf(nei)
            pInd >= 0 && !result.taken.includes(path[pInd]) && result.taken.push(path[pInd])
            tInd >= 0 && !result.taken.includes(tgs[tInd]) && result.taken.push(tgs[tInd])
            if (pInd >= 0) {
                result.indexes?.push(pInd)
            }
            if (endpoint) {
                const neiColors = crossLine || joinPoint || this.getColors(connections)
                const commonColor = getCommonColor(colors, neiColors)
                const lines = neiColors.map(color => ({
                    line: this.getFullLineFromAnyPoint(nei, color),
                    color
                }))
                const unresolvedLines = lines.filter(l => l.line.length < 2
                    && l.color !== colors[0])
                const pathToJoin = unresolvedLines.map(l => l.color)
                const freeNie = pathToJoin.length
                    ? this.freeNeighborsNumber(nei, path, tgs)
                    : Infinity
                let property = !pathToJoin.length ? 'resolved' : 'pathToJoin' as
                    'noPath' | 'resolved' | 'isolated' | 'pathToJoin'
                property = pathToJoin.length > freeNie ? 'isolated' : property
                property = !commonColor && pathToJoin.length >= freeNie
                    ? 'noPath'
                    : property
                if (property === 'pathToJoin' || (pathToJoin.length && property !== 'isolated')) {
                    if (crossLine && commonColor) {
                        result.freePath.push(nei)
                    }
                    result.pathsToJoin = result.pathsToJoin.concat(pathToJoin)
                } else {
                    result[property].push(nei)
                }
                    // console.warn('nei endpoint', nei, this.getPoint(nei), colors, neiColors, property, lines, result)
            } else if (connections && lineEndpoints) {
                const nKey = this.getLineKey(lineEndpoints[0], lineEndpoints[1])
                const isEqual =
                    isEqualArrays(this.altLinePaths[nKey].line, this.lineEndpoints[nKey].line)
                result.blocked.push(nei)
                !isEqual && result.freePath.push(nei)
            } else if (pInd < 0 && tInd < 0) {
                result.freePath.push(nei)
            }
        }
        return result
    }

    checkLine = (key1: string, key2: string) => {
        return !!this.altLinePaths[`${key1}_${key2}`]
            || !!this.altLinePaths[`${key2}_${key1}`]
    }

    checkEndpoints = (key1: string, key2: string) => {
        return !!this.lineEndpoints[`${key1}_${key2}`] || !!this.lineEndpoints[`${key2}_${key1}`]
    }

    validateTotalPath = (path: SA, colors: SA) => {
        const checked = {} as {[k: string]: boolean}
        for (const point of path) {
            const neighbors = this.rect[point].neighbors
            for (const nei of neighbors) {
                if (!this.getPoint(nei) && !path.includes(nei) && !checked[nei]) {
                    const pocket = this.checkPocket(path, nei, colors, [])
                    checked[nei] = true
                    console.warn('total path validation', path, nei, pocket)
                    if (!pocket.path.length || pocket.rePath?.length) {
                        return false
                    }
                }
            }
        }
        return true
    }
}
