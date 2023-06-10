import { Height, Width } from "../constant/constants";
import {
    ICollision,
    IPuzzle,
    IRectDimension,
    ITakenPoints,
    IEndpoints, ISLines,
} from "../constant/interfaces";

import {defaultConnectionsWithColor, isDev, oppositeDirection} from "../helper-fns/helper-fn";
import {PuzzleEvaluator} from "./rect-evaluator";
// import {puzzlesManager} from "../app-services/puzzles-manager";
import {authService} from "../app-services/auth-service";

export class RectCreator extends PuzzleEvaluator {
    steps: ITakenPoints[] = [{}]
    currentStep = 0
    puzzle = {} as IPuzzle

    constructor(props: IRectDimension) {
        super(props);
        // isDev() && console.log(props)
    }

    undo = () => {
        this.currentStep = this.currentStep > 0
            ? this.currentStep - 1
            : 0
        this._takenPoints = this.steps[this.currentStep] || {}
        this.$points.emit(this.takenPoints)
    }

    redo = () => {
        this.currentStep = this.currentStep < this.steps.length - 1
            ? this.currentStep + 1
            : this.steps.length - 1
        this._takenPoints = Object.assign({},this.steps[this.currentStep] || {})
        this.$points.emit(this.takenPoints)
    }

    clearAll = () => {
        this.clearPoints()
        this.steps = [{}] as ITakenPoints[]
        this.lines = {} as ISLines
        this.currentStep = 0
        this.puzzle = {} as IPuzzle
        this.lineError = ''
        this.linesInterfering = {}
        this.lineEndpoints = {} as IEndpoints
        this.$points.emit(this.takenPoints)
    }

    updateSteps = () => {
        this.currentStep = this.steps.length
        const steps = Object.assign([], this.steps.slice(0, this.currentStep))
        steps.push(this.takenPoints)
        this.steps = steps
    }

    lineContinuationIsImpossible = (nextPoint: string, prevPoint: string, color: string) => {
        return !this.getColors(prevPoint).includes(color)
    }

    buildPuzzle = (): IPuzzle | undefined => {
        if (!Object.keys(this.lines).length) {
            return
        }
        const difficulty = this.evaluatePuzzle()
        const {width, height} = this
        const name = `${authService.user.name}_size-${width}x${height}_diff-${difficulty}`
        isDev() && console.log('new puzzle', name)
        const puzzle = {
            name,
            difficulty,
            createdBy: authService.user._id,
            width,
            height,
            points: this.getTotalPoints()
        } as IPuzzle
        this.puzzle = puzzle
        // puzzlesManager.setUnresolved(puzzle)
        return puzzle
    }

    getTotalPoints = () => {
        const takenPoints = this.takenPoints
        const points = {} as ITakenPoints
        for (const point in takenPoints) {
            const { crossLine, joinPoint } = takenPoints[point].endpoint
                ? this.prepareEndpointForResolver(takenPoints[point])
                : {crossLine: undefined, joinPoint: undefined}
            points[point] = {...takenPoints[point], crossLine, joinPoint,}
        }
        return points
    }

    changeLineColor = (key: string, newColor: string, oldColor: string) => {
        const line = this.getLinePartPoints(oldColor, key)
        const updatedPoints = {} as ITakenPoints
        for (const point of line) {
            const pointProps = this.getPoint(point)
            const lineDirections = this.getLineDirections(pointProps.connections, oldColor)
            const connections = {...pointProps.connections}
            const colors = this.getColors(connections)
            if (colors.length === 1) {
                for (const dir in connections) {
                    connections[dir].color = newColor
                }
            } else {
                for (const dir of lineDirections) {
                    connections[dir].color = newColor
                }
            }
            updatedPoints[point] = {...pointProps, connections}
        }
        // isDev() && console.log('ch color', newColor, oldColor, line, key, updatedPoints)
        this.addTakenPoints(updatedPoints)
    }

    resolveMouseUp = (point: string, color: string) => {

        const pointProps = this.getPoint(point)
        if (pointProps.endpoint) {
            return
        }
        const noFeeCell = {sameColor: 0, freeCell: this.rect[point].neighbors.length}
        for (const nei of this.rect[point].neighbors) {
            const neiProps = this.getPoint(nei)
            if (!neiProps) {
                break
            }
            const sameColor = this.getColors(neiProps.connections).includes(color)
            if (!sameColor) {
                noFeeCell.freeCell -= 1
            } else if (!neiProps.endpoint) {
                noFeeCell.sameColor += 1
                if (noFeeCell.sameColor > 1) {
                    break
                }
                noFeeCell.freeCell -= 1
            } else {
                break
            }
        }
        if (noFeeCell.sameColor === 1 && noFeeCell.freeCell === 0) {
            this.convertLastToEndpoint(point)
            this.updateSteps()
            pointProps.endpoint = true
        }
    }

    resolveNewPointDown(key: string, color: string) {
        if (!key) {
            return
        }
        this.addTakenPoints({[key]: {
            endpoint: true,
            connections: defaultConnectionsWithColor(color)
        }})
    }

    removeForks = (start: string, color: string) => {
        const lineNeighbors = this.getLineNeighbors(start)
        isDev() && console.log('remove fork', start, color, lineNeighbors)
        if (lineNeighbors.length < 2) {
            return
        }
        let dirToClean, linePartToRemove
        const firstLinePart = this.getLinePartPoints(color, lineNeighbors[0], start)
        const secondLinePart = this.getLinePartPoints(color, lineNeighbors[1], start)
        if (this.getPoint(firstLinePart[firstLinePart.length - 1]).endpoint) {
            dirToClean = this.determineDirection(start, lineNeighbors[1])
            linePartToRemove = secondLinePart
        } else {
            dirToClean = this.determineDirection(start, lineNeighbors[0])
            linePartToRemove = firstLinePart
        }
        if (!linePartToRemove.length || !dirToClean) return
        this.removeLinePartCreator(linePartToRemove, color)
    }

    resolveMouseDown = (key: string, color: string, interfere?: ICollision) => {
        console.warn('down rect', key, color, interfere)
        const {sameColor, joinPoint} = interfere || {}
        if (!interfere) {
            this.resolveNewPointDown(key, color)
        } else if (!joinPoint && sameColor) {
            this.removeForks(key, color)
        }
        this.updateSteps()
    }

    resolveMouseEnter = (
        next: string,
        prev: string,
        color: string, 
        interfere?: ICollision) => {
        const {sameLine, joinPoint, sameColor} = interfere || {}
        console.log('enter', next, prev, color, interfere, sameColor, sameLine, joinPoint)
        if (sameLine?.length) {
            this.removeLinePartCreator(sameLine, color)
            return this.updateSteps()
        }
        if (!interfere) {
            this.continueLineWithoutInterfering(next, prev, color)
            return this.updateSteps()
        }
        this.updateLineStart(next, prev, color, true)
        if (joinPoint) {
            this.createJoinPoint(next, prev, color, sameColor)
        } else if (!joinPoint && !sameLine && !sameColor) {
            this.removeInterferedLine(next)
            this.addNextPoint(next, prev, color)
        } else if (!joinPoint && !sameLine && sameColor) {
            this.resolveSameColorInterfering(next, prev, color)
        }
        this.updateSteps()
    }

    continueLineWithoutInterfering = (next: string, prev: string, color: string) => {
        const {connections, endpoint} = this.getPoint(prev)
        console.log('no interfering', connections, endpoint)
        if (endpoint
            && this.getLineNeighbors(connections, color).length > 0
            && this.getColors(connections).length === 1) {
            console.log('move endpoint')
            this.moveEndpoint(next, prev, color)
        } else {
            this.updateLineStart(next, prev, color, true)
            this.addNextPoint(next, prev, color)
        }

    }

    moveEndpoint = (next: string, prev: string, color: string) => {
        const dir = this.determineDirection(prev, next)
        const {connections} = this.getPoint(prev)
        this.addTakenPoints({
            [prev]: {
                connections: {
                    ...connections,
                    [dir]: {color, neighbor: next}
                },
                endpoint: false
            },
            [next]: {
                connections: {
                    ...defaultConnectionsWithColor(color),
                    [oppositeDirection(dir)]: {color, neighbor: prev}
                },
                endpoint: true
            }
        })
    }

    removeLinePartCreator = (line: string[], color: string) => {
        this.removeLinePart(line, color, this.updateCrossLineRemovingFork)
    }

    resolveSameColorInterfering = (next: string, prev: string, color: string) => {
        const {connections, endpoint} = this.getPoint(next)
        isDev() && console.log('same color interfere', color, next, prev)
        if (endpoint) {
            console.error('invalid props or method', next, prev, this.takenPoints)
            return
        }
        const neighbors = this.getLineNeighbors(connections)
        if (neighbors.length < 2) {
            return this.createJoinPoint(next, prev, color, true)
        }
        for (const nei of neighbors) {
            this.removeLineFork(nei, next, color)
        }
        this.addNextPoint(next, prev, color)
    }

    removeLineFork = (next: string, prev: string, color: string) => {
        // console.warn('remove forked line', next, prev)
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
}

export const pC = new RectCreator({width: Width, height: Height})
