import {DefaultColor, Height, Width} from "../constant/constants";
import {
    ICollision,
    IPuzzle, ITakenPointProps,
    ITakenPoints,
} from "../constant/interfaces";
import { PuzzleCommons } from "./rect-commons";
import { defaultConnectionsWithColor } from "../helper-fns/helper-fn";

export class RectCreator extends PuzzleCommons {
    steps: ITakenPoints[] = [{}]
    currentStep = 0
    puzzle = {} as IPuzzle

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
        this.steps = [{}]
        this.steps.length = 0
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
            return 'empty cells'
        }
        if (!linesContinuity) {
            return 'broken lines'
        }
        return 'valid'
    }

    prepareUtmostPointForResolver = (point: ITakenPointProps): ITakenPointProps => {
        const {utmost, connections} = point
        const lineNeighbors = this.getLineNeighbors(point.connections)
        const colors = this.getColors(connections)
        const crossLine = lineNeighbors.length === 4 && colors.length === 2
            ? colors
            : undefined
        const joinPoint = utmost && !crossLine && lineNeighbors.length > 1
            ? colors
            : undefined
        const color = crossLine || joinPoint ? DefaultColor : colors[0]
        return {
            connections: defaultConnectionsWithColor(color),
            crossLine,
            joinPoint,
            utmost
        }
    }

    changePointColorCreator = (key: string, newColor: string, oldColor: string) => {
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
        let neighbors = this.changePointColorCreator(key, newColor, oldColor)
        const stopFn = (point: string) => {
            neighbors = this.changePointColorCreator(point, newColor, oldColor)
            console.log('fn ch col', neighbors, newColor, point)
            return neighbors.length < 2
        }
        for (const neighbor of neighbors) {
            this.goToLinePoint(neighbor, key, stopFn, oldColor)
        }
    }

    buildPuzzle = () => {
        const {takenPoints, width, height} = rc
        const points = takenPoints
        const startPoints = {} as ITakenPoints
        const dotsSegregatedByColor = {} as {[color: string]: ITakenPoints}
        for (const key in points) {
            const {utmost, connections} = this.getPoint(key)
            if (utmost) {
                startPoints[key] = this.prepareUtmostPointForResolver(points[key])
            } 
            for (const dir in connections) {
                const color = connections[dir].color
                const coloredDots = dotsSegregatedByColor[color] || {}
                dotsSegregatedByColor[color] = {
                    ...coloredDots, [key]: points[key]
                }
            }
        }
        const date = new Date()
        const colors = Object.keys(dotsSegregatedByColor).length
        const name = `puzzle${width}x${height}_colors${colors}_date${date}`
        const puzzle = {
            name,
            startPoints,
            dotsSegregatedByColor,
            width,
            height
        } as IPuzzle
        this.puzzle = puzzle
        return puzzle
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
            this.continueLine(next, prev, color)
        } else if (!joinPoint && !sameLine && !sameColor) {
            this.removeInterferedLines(next)
            this.continueLine(next, prev, color)
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
        this.continueLine(next, prev, color)
    }

    checkLineContinuity = (start: string, color: string) => {
        const fn = (point: string) => {
            const utmost = this.getPoint(point).utmost && point !== start
            const circle = this.checkCircleLine(point, color)
            return circle || utmost
        }
        const end = this.goToLinePoint(start, '', fn, color)
        return end || this.getPoint(end).utmost
    }

    checkLinesContinuity = () => {
        let valid = true
        for (const color in this._utmostPoints) {
            const points = this._utmostPoints[color]
            for (const point of points) {
                valid = !!this.checkLineContinuity(point.key, color)
                if (!valid) {
                    break
                }
            }
        }
        return valid
    }
}

export const rc = new RectCreator({width: Width, height: Height / 2})
