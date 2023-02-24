import { Height, Width } from "../constant/constants";
import { 
    ICollision,
    IDotConnections,
    IPuzzle,
    IStartPoint,
    ITakenPointProps,
    ITakenPoints,
    IUpContext 
} from "../constant/interfaces";
import { PuzzleCommons } from "./rect-commons";
import { defaultSectors, getSectorsData } from "../helper-fns/helper-fn";

export class RectCreator extends PuzzleCommons {
    steps: ITakenPoints[] = []
    currentStep = 0
    puzzle = {} as IPuzzle

    checkPuzzle = (data = rectCreator.takenPoints): string => {
        const linesContinuity = rectCreator.checkLinesContinuity()
        const emptyCelss = rectCreator.checkEmptyCells()
        if (emptyCelss.length) {
            return 'empty cells'
        }
        if (!linesContinuity) {
            return 'broken lines'
        }
        return 'valid'
    }

    createPuzzle = () => {
        const {takenPoints, width, height} = rectCreator
        const points = takenPoints
        const startPoints = {} as ITakenPoints
        const dotsSegragatedByColor = {} as {[key: string]: ITakenPoints}
        for (const key in points) {
            if (points[key].utmost) {
                startPoints[key] = this.cutNeighborsInStartPoints(key, points)
            } 
            for (const color in points[key].connections) {
                const coloredDots = dotsSegragatedByColor[color] || {}
                dotsSegragatedByColor[color] = {
                    ...coloredDots, [key]: points[key]
                }
            }
        }
        const date = new Date()
        const colors = Object.keys(dotsSegragatedByColor).length
        const name = `puzzle${width}x${height}_colors${colors}_date${date}`
        const puzzle = {
            name,
            startPoints,
            dotsSegragatedByColor,
            width,
            height
        } as IPuzzle
        this.puzzle = puzzle
        return puzzle
    }

    resolveMouseUp = (key1: string, key2: string, color: string, context: IUpContext) => {
        console.log('up', key1, key2, color, context)
        const {freeCells, sameColorNeighbors, } = context
        const utmostNeighbor = sameColorNeighbors?.utmost && sameColorNeighbors?.key
        if (utmostNeighbor) {
            this.connectToUtmostNeighbor(key1, key2, utmostNeighbor, color)
        } else if (!freeCells) {
            this.convertLastPointToUtmost(key1, key2, color)
        }
    }

    undo = () => {
        this.currentStep = this.currentStep > 0 ? this.currentStep - 1 : 0
        this._takenPoints = this.steps[this.currentStep]
        for (const val of Object.values(this.takenPoints)) {
            if (!val.connections) {
                console.error(this.currentStep, this._takenPoints, this.steps)
            }
        }
    }

    redo = () => {
        this.currentStep = this.currentStep < this.steps.length - 1 
            ? this.currentStep + 1 
            : this.steps.length - 1
        this._takenPoints = this.steps[this.currentStep]
        
    }

    clearAll = () => {
        this.clearPoints()
        this.steps.length = 0
    }

    updateSteps = () => {
        this.currentStep += 1
        this.steps = this.steps.slice(0, this.currentStep)
        this.steps.push(this._takenPoints)
    }

    addPoints = (points: ITakenPoints) => {
        this.addTakenPoints(points)
        this.updateSteps()
    }

    delPoint = (key: string) => {
        this.deletePoint(key)
        this.updateSteps()
    } 

    connectToUtmostNeighbor = (key1: string, key2: string, utmost: string, color: string) => {
        const pointProps: ITakenPointProps = {
            utmost: false,
            connections: {
                [color]: defaultSectors().map(d => {
                    if (d.dir === this.determineDirection(key1, key2)) {
                        return { dir: d.dir, neighbor: key2 }
                    }
                    if (d.dir === this.determineDirection(key1, utmost)) {
                        return  { dir: d.dir, neighbor: utmost}
                    }
                    return d
                }) 
            }
        }
        const utmostPoint = this.getPoint(utmost)
        let connections = utmostPoint.connections
        const sameColorConnection = connections[color]
        const dir = this.determineDirection(utmost, key1)
        const index = this.getSectorIndex(dir, sameColorConnection)
        sameColorConnection[index] = {dir, neighbor: key1}
        const utmostPointProps: ITakenPointProps = {
            utmost: true,
            connections: {
                ...connections,
                [color]: [
                    ...sameColorConnection,
                ]
            }
        }
        this.addPoints({[utmost]: utmostPointProps})
        this.addPoints({[key1]: pointProps})
    }

    convertLastPointToUtmost = (key: string, key2: string, color: string) => {
        const dir = this.determineDirection(key, key2)
        const sectors = defaultSectors().map(s => {
            return s.dir === dir 
                ? {...s, neighbor: key2}
                : s
        })
        const pointProps: ITakenPointProps = {
                utmost: true,
                connections: {
                    [color]: sectors
            }
        }
        this.addPoints({[key]: pointProps})
    }

    resolveNewPointDown(key: string, color: string) {
        if (!key) {
            return
        }
        const connections = {[color]: defaultSectors()}
        this.addPoints({[key]: {
            utmost: true,
            connections
        }})

    }

    resolveMouseDown = (key: string, color: string, interfere?: ICollision) => {
        console.warn('down rect', key, color, interfere)
        if (!interfere) {
            this.resolveNewPointDown(key, color)
        } else if (interfere.joinPoint) {
            this.resolveJoinOnMouseDown(key, color)
        } else {

        }
    }

    resolveJoinOnMouseDown = (key: string, color: string) => {
        const point = this.getPoint(key)
        const sectors = getSectorsData(point)
        // const directions = this.rect[key].neighbors.map(n => this.determineDirection(key, n))
        sectors.forEach(sec => {
            if (!sec.line) {

            }
        })
    }

    resolveMouseEnter = (
        key: string, 
        key2: string, 
        color: string, 
        interfere?: ICollision) => {
            const {sameLine, joinPoint, sameColor} = interfere || {}
            if (sameLine) {
                return this.removeLinePart(key2, key, color, this.delPoint, this.addPoints)
            }
            const jointToSameColorUtmostPoint = (joinPoint && !sameColor)
               || (sameColor 
               && !sameLine 
               && this.getLineNeighbors(key, color).length < 2
               && this.getLineNeighbors(key2, color).length < 2)
            this.updateLineStart(key, key2, color, this.addPoints)
            if (jointToSameColorUtmostPoint) {
                this.createJoinPoint(key, key2, color, this.addPoints, sameColor)
            }
            if (!interfere) {
                this.continueLine(key, key2, color)
            } else if (!joinPoint && !sameLine && !sameColor) {
                this.removeInterferedLines(key, this.delPoint, this.addPoints)
                this.continueLine(key, key2, color, this.addPoints)
            }            
    }

    changePointColor = (key: string, color: string, colorToReplace: string) => {
        let {utmost, connections} = this.getPoint(key)
        const sectors = connections[colorToReplace]
        const neighbors = this.getLineNeighbors(key, colorToReplace)
        delete connections[colorToReplace]
        connections = {...connections, [color]: sectors}
        this.addPoints({[key]: {utmost, connections}})
        return neighbors
    }

    changeColor = (key: string, color: string, colorToReplace: string) => {
        const neighbors = this.changePointColor(key, color, colorToReplace)
        const stopFn = (point: string) => {
            const neighbors = this.getLineNeighbors(point, colorToReplace)
            this.changePointColor(point, color, colorToReplace)
            return neighbors.length < 2
        }
        for (const neighbor of neighbors) {
            this.goToLinePoint(neighbor, key, colorToReplace, stopFn)
        }
    }

    
    checkLineContinuity = (start: string, color: string) => {
        const fn = (point: string) => {
            const utmost = this.getPoint(point).utmost && point !== start
            const circle = this.checkCircleLine(point, color)
            return circle || utmost
        }
        const end = this.goToLinePoint(start, '', color, fn)
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
    
    checkEmptyCells = (): string[] => {
        const emptyCells = [] as string[]
        if (this._width * this._height === Object.keys(this._takenPoints).length) {
            return []
        }
        console.log(this._takenPoints)
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                const key = `${i}-${j}`
                if (!this.getPoint(key)) {
                    emptyCells.push(key)
                }
            }
        }
        console.log(emptyCells)
        return emptyCells
    }

    combineAndCheckUtmostPoints = () => {
        for (const key in this.takenPoints) {
            const point = this.getPoint(key)
            if (!point.utmost) {
                continue
            }
            for (const color in point.connections) {
                const utmostPoint: IStartPoint = {key} 
                this._utmostPoints[color] = this._utmostPoints[color] 
                                            ? [...this._utmostPoints[color], utmostPoint]
                                            : [utmostPoint]
            }
        }
        for (const color in this._utmostPoints) {
            const pointsNum = this._utmostPoints[color].length
            if (pointsNum < 2) {
                return false
            }
        }
        return this._utmostPoints
    }

}

export const rectCreator = new RectCreator({width: Width, height: Height / 2})
