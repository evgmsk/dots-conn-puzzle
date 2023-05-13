import {Height, LSName, Width} from "../constant/constants";
import {
    ICollision,
    IPuzzle,
    IRectDimension,
    ITakenPoints,
    IEndpoints, ISLines,
} from "../constant/interfaces";

import {defaultConnectionsWithColor, isDev, oppositeDirection} from "../helper-fns/helper-fn";
import {PuzzleEvaluator} from "./rect-evaluator";
import {puzzlesManager} from "../puzzles-storage/puzzles-manager";
import {Observable} from "../puzzles-storage/observable";

export class RectCreator extends PuzzleEvaluator {
    steps: ITakenPoints[] = [{}]
    currentStep = 0
    puzzle = {} as IPuzzle

    constructor(props: IRectDimension) {
        super(props);
        isDev() && console.log(props)
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
        const name = localStorage.getItem(LSName)
        if (!Object.keys(this.lines).length) {
            return
        }
        const difficulty = this.evaluatePuzzle()
        const {width, height} = this
        const createdAt = new Date()
        const creator = `${name}_size-${width}x${height}_diff-${difficulty}`
        isDev() && console.log('new puzzle', name, creator)
        const puzzle = {
            createdAt,
            creator,
            difficulty,
            width,
            height,
            points: this.getTotalPoints()
        } as IPuzzle
        this.puzzle = puzzle
        puzzlesManager.setUnresolved(puzzle)
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
            if (!pointProps.crossLine && !pointProps.joinPoint) {
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
        isDev() && console.log('ch color', newColor, oldColor, line, key, updatedPoints)
        this.addTakenPoints(updatedPoints)
    }

    resolveMouseUp = (point: string, color: string) => {
        isDev() && console.log('up', point, color)
        const pointProps = this.getPoint(point)
        const freeCells = this.rect[point].neighbors.filter(n => !this.getPoint(n)).length
        if (!pointProps.endpoint && !freeCells) {
            this.convertLastToEndpoint(point)
            this.updateSteps()
            pointProps.endpoint = true
        }
        if (pointProps.endpoint && pC.puzzleFulfilled() && this.preparePuzzleEvaluation()) {
            console.log(this.lines, this.lineEndpoints)
            this.buildPuzzle()
            console.log(this.puzzle)
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
            this.removeLinePart(sameLine, color)
            return this.updateSteps()
        }
        if (!interfere) {
            this.continueLineWithoutInterfering(next, prev, color)
            return this.updateSteps()
        }
        this.updateLineStart(next, prev, color, false)
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
            this.updateLineStart(next, prev, color, false)
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

    resolveSameColorInterfering = (next: string, prev: string, color: string) => {
        const {connections, endpoint} = this.getPoint(next)
        isDev() && console.log('same color interfer', color, next, prev)
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
}

export const pC = new RectCreator({width: Width, height: Height / 2})
