import {DefaultColor, Height, Width} from "../constant/constants";
import {
    ICollision,
    ILines,
    IPuzzle,
    IRectDimension, IStartPoints,
    ITakenPointProps,
    ITakenPoints,
    IUtmostPoints,
    IUtmostPointsValue
} from "../constant/interfaces";
import { defaultConnectionsWithColor } from "../helper-fns/helper-fn";
import {PuzzleEvaluator} from "./rect-evaluator";


export class RectCreator extends PuzzleEvaluator {
    steps: ITakenPoints[] = [{}]
    currentStep = 0
    puzzle = {} as IPuzzle

    constructor(props: IRectDimension) {
        super(props);
        // console.log(this)
    }

    undo = () => {
        this.currentStep = this.currentStep > 0
            ? this.currentStep - 1
            : 0
        this._takenPoints = this.steps[this.currentStep] || {}
        console.warn('undo', this.currentStep, this.steps, this.takenPoints)
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
        this._lines = {}
        this.currentStep = 0
        this.puzzle = {} as IPuzzle
        this.lineError = ''
        this.linesInterfering = {}
        this.utmostPoints = {} as IUtmostPoints
        this.lineStartPoints = {} as IStartPoints
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

    separatePointsByLines = () => {
        const lines = {} as ILines
        console.warn('sep1', this.takenPoints, lines)
        for (const key in this.takenPoints) {
            const {utmost, connections} = this.getPoint(key)
            let pointProps = this.getPoint(key)
            if (utmost
                || (this.getLineNeighbors(connections).length === 1
                    && !this.rect[key].neighbors.filter(n => !this.getPoint(n)).length)) {
                pointProps.utmost = true
                const {crossLine, joinPoint} = this.prepareUtmostPointForResolver(pointProps)
                pointProps.joinPoint = joinPoint
                pointProps.crossLine = crossLine
                if (!pointProps.crossLine) {
                    this.addToStartPoints(key, pointProps)
                }

            }
            for (const dir in connections) {
                const color = connections[dir].color
                const line = lines[color] || {}
                lines[color] = {
                    ...line, [key]: pointProps
                }
            }
        }
        this._lines = lines
        console.log('lines', this._lines)
    }


    buildPuzzle = (): IPuzzle | undefined => {
        this.separatePointsByLines()
        if (!this.getLinesUtmostPoints()) {
            console.error(this.lineError)
            return
        }

        const difficulty = this.evaluatePuzzle()
        const {width, height, _lines : lines} = this
        const date = new Date()
        const colors = Object.keys(lines).length
        const name = `puzzle_${width}x${height}_colors-${colors}_diff-${difficulty}`
        const puzzle = {
            date,
            name,
            difficulty,
            lines,
            width,
            height
        } as IPuzzle
        this.puzzle = puzzle
        return puzzle
    }

    changePointColor = (key: string, newColor: string, oldColor: string) => {
        let {utmost, connections} = this.getPoint(key)
        const colors = this.getColors(key)
        const lineNeighbors = this.getLineNeighbors(key, oldColor)
        console.log('ch col point', lineNeighbors, key, newColor, oldColor, colors)
        for (const dir in connections) {
            const sector = connections[dir]
            if (!utmost || sector.color === oldColor) {
                sector.color = newColor
            }
            connections[dir] = sector
        }
        this.addTakenPoints({[key]: {utmost, connections}})
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
        const freeCells = this.rect[point].neighbors.filter(n => !this.getPoint(n)).length
        if (!freeCells) {
            this.convertLastPointToUtmost(point)
            this.updateSteps()
        }
    }

    convertLastPointToUtmost = (key: string) => {
        this.addTakenPoints({
            [key]: {
                utmost: true,
                connections: this.getPoint(key).connections
            }
        })
        // const point = this.getPoint(key)

    }

    resolveNewPointDown(key: string, color: string) {
        if (!key) {
            return
        }
        this.addTakenPoints({[key]: {
            utmost: true,
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
        this.updateLineStart(next, prev, color, false)
        if (joinPoint) {
            this.createJoinPoint(next, prev, color, sameColor)
        }
        if (!interfere) {
            this.addNextPoint(next, prev, color)
        } else if (!joinPoint && !sameLine && !sameColor) {
            this.removeInterferedLines(next)
            this.addNextPoint(next, prev, color)
        } else if (!joinPoint && !sameLine && sameColor) {
            this.resolveSameColorInterfering(next, prev, color)
        }
        this.updateSteps()
    }

    resolveSameColorInterfering = (next: string, prev: string, color: string) => {
        const {connections, utmost} = this.getPoint(next)
        if (utmost) {
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
        console.log('check line continue before', start, color)
        let circle = false
        const fn = (point: string) => {
            const {utmost, crossLine} = this.getPoint(point)
            const last = utmost && point !== start && !crossLine
            const circle = this.checkCircleLine(point, color)
            return circle || last
        }
        const end = this.goToLinePoint(start, '', fn, color)
        console.log('check line continue after', start, color, 'cir', circle, 'end', end)
        return !circle ? end : ''
    }

    checkLinesContinuity = () => {
        let valid = true
        for (const color in this.utmostPoints) {
            const points = this.utmostPoints[color]
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

export const rc = new RectCreator({width: Width, height: Height / 2})
