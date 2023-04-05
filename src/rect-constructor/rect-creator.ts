import {Height, Width} from "../constant/constants";
import {
    ICollision,
    IPuzzle,
    IRectDimension,
    ITakenPoints,
    IEndpoints, ISLines,
} from "../constant/interfaces";

import {defaultConnectionsWithColor, isDev, oppositeDirection} from "../helper-fns/helper-fn";
import {PuzzleEvaluator} from "./rect-evaluator";

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
    }

    redo = () => {
        this.currentStep = this.currentStep < this.steps.length - 1
            ? this.currentStep + 1
            : this.steps.length - 1
        this._takenPoints = Object.assign({},this.steps[this.currentStep] || {})
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
    }

    updateSteps = () => {
        this.currentStep = this.steps.length
        const steps = Object.assign([], this.steps.slice(0, this.currentStep))
        steps.push(this._takenPoints)
        this.steps = steps
    }

    checkPuzzle = (): string => {
        const linesContinuity = this.checkLinesContinuity()
        if (this.width * this.height - Object.keys(this.takenPoints).length) {
            console.log(Object.keys(this.takenPoints).length)
            return 'empty cells'
        }
        if (!linesContinuity) {
            return 'broken lines'
        }
        return 'valid'
    }

    lineContinuationIsImpossible = (nextPoint: string, prevPoint: string, color: string) => {
        return !this.getColors(prevPoint).includes(color)
    }

    buildPuzzle = (): IPuzzle | undefined => {
        console.log(Object.keys(this.lines).length)
        if (!Object.keys(this.lines).length) {
            return
        }
        const difficulty = this.evaluatePuzzle()
        const {width, height, lines} = this
        const date = new Date()
        const colors = Object.keys(lines).length
        const name = `puzzle_${width}x${height}_colors-${colors}_diff-${difficulty}`
        const puzzle = {
            date,
            name,
            difficulty,
            lines,
            width,
            height,
            points: this.getTotalPoints()
        } as IPuzzle
        this.puzzle = puzzle
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

    changePointColor = (key: string, newColor: string, oldColor: string) => {
        let {endpoint, connections} = this.getPoint(key)
        const colors = this.getColors(key)
        const lineNeighbors = this.getLineNeighbors(key, oldColor)
        console.log('ch col point', lineNeighbors, key, newColor, oldColor, colors)
        for (const dir in connections) {
            const sector = connections[dir]
            if (!endpoint || sector.color === oldColor) {
                sector.color = newColor
            }
            connections[dir] = sector
        }
        this.addTakenPoints({[key]: {endpoint, connections}})
        return lineNeighbors
    }

    changeLineColor = (key: string, newColor: string, oldColor: string) => {
        console.log('change line color', key, newColor)
        let neighbors = this.changePointColor(key, newColor, oldColor)
        const stopFn = (point: string) => {
            neighbors = this.changePointColor(point, newColor, oldColor)
            console.log('fn ch col', neighbors, newColor, point)
            return neighbors.length < 2
        }
        for (const neighbor of neighbors) {
            this.goToLinePoint(neighbor, key, stopFn, oldColor)
        }
    }

    resolveMouseUp = (point: string, color: string) => {
        console.log('up', point, color)
        const pointProps = this.getPoint(point)
        const freeCells = this.rect[point].neighbors.filter(n => !this.getPoint(n)).length
        if (!pointProps.endpoint && !freeCells) {
            this.convertLastToEndpoint(point)
            this.updateSteps()
            pointProps.endpoint = true
        }
        if (pointProps.endpoint && pC.puzzleFulfilled() && this.separateDotsByLines()) {
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
        if (sameLine) {
            this.removeLineCirclePart(prev, next, color)
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

    checkLineContinuity = (start: string, color: string) => {
        // console.log('check line continue before', start, color)
        let circle = false
        const fn = (point: string) => {
            const {endpoint, crossLine} = this.getPoint(point)
            const last = endpoint && point !== start && !crossLine
            const circle = this.checkCircleLine(point, color)
            return circle || last
        }
        const end = this.goToLinePoint(start, '', fn, color)
        // console.log('check line continue after', start, color, 'cir', circle, 'end', end)
        return !circle ? end : ''
    }

    checkLinesContinuity = () => {
        let valid = true
        for (const color in this.lineEndpoints) {
            const points = this.lineEndpoints[color]
            for (const point in points) {
                valid = !!this.checkLineContinuity(point, color)
                if (!valid) {
                    break
                }
            }
        }
        return valid
    }
}


export const pC = new RectCreator({width: Width, height: Height / 2})
