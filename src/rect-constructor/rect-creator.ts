import { Height, Width } from "../constant/constants";
import { 
    ICollision,
    IPointConnections,
    IStartPoint,
    ITakenPointProps,
    ITakenPoints,
    IUpContext 
} from "../constant/interfaces";
import { LinedRectBase } from "./rect-base";
import { defaultSectors, getSectorsData } from "../helper-fns/helper-fn";

export class RectCreator extends LinedRectBase! {
    steps: ITakenPoints[] = []
    currentStep = 0

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
        console.log(this.currentStep, this._takenPoints, this.steps)
        this._takenPoints = this.steps[this.currentStep]
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
            console.warn('enter', key, key2, color, interfere)
            const {sameLine, joinPoint, sameColor} = interfere || {}
            if (!interfere) {
                this.updateLineStart(key, key2, color)
                this.continueLine(key, key2, color)
            } else if (joinPoint && !sameColor) {
                this.updateLineStart(key, key2, color)
                this.createJoinPoint(key, key2, color)
            } else if (sameLine) {
                this.removeLinePart(key2, key, color)
            } else if (!joinPoint && !sameLine && !sameColor) {
                this.updateLineStart(key, key2, color)
                this.removeLinesInterfereWithoutJoin(key)
                this.continueLine(key, key2, color)
            } else if (sameColor 
                    && !sameLine 
                    && this.getLineNeighbors(key, color).length < 2) {
                this.updateLineStart(key, key2, color)
                this.createJoinPoint(key, key2, color, sameColor)
            }
    }

    removeLinesInterfereWithoutJoin = (key: string) => {
        const connections = this.getPoint(key).connections
        const colors = Object.keys(connections)
        this.delPoint(key)
        let lastDeleted = key
        const fn = (pointKey: string, col: string) => {
            const point = this.getPoint(pointKey)
            console.log(point, pointKey, this.takenPoints, lastDeleted)
            if (!point.utmost) { 
                this.delPoint(pointKey)
                lastDeleted = pointKey
            } else {
                const dir = this.determineDirection(pointKey, lastDeleted)
                const sectors = point.connections[col].map(sec => 
                    sec.dir === dir ? {dir} : sec)
                const connections = {...point.connections, [col]: sectors}
                this.addPoints({[pointKey]: {...point, connections}} as ITakenPoints)
            }
            return point.utmost
        }
        for (const col of colors) {
            const neighbors = connections[col].map(c => c.neighbor)
            neighbors.forEach(n => {
                n && this.goToLinePoint(n, key, col, fn)
            })
        }
    }

    removeLinePart(from: string, to: string, color: string) {
        console.warn('remove', from)
        const toFn = (key: string) => {
            const neighbor = this.haveNeighbor(key, to, color)
            this.delPoint(key)
            if (neighbor) {
                let {connections, utmost} = this.getPoint(to)
                const sectors = connections[color].map(s => {
                    const dir = s.dir
                    return s.neighbor === key ? {dir} : s
                })
                connections = {
                    ...connections,
                    [color]: sectors
                }
                
                this.addPoints({[to]: {utmost, connections}})
            }
            return neighbor
        }
        this.goToLinePoint(from, to, color, toFn)
    }

    createJoinPoint = (key: string, key2: string, color: string, sameColor = false) => {
        console.log('create join p', key, key2, color)
        const existedPoint = this.getPoint(key)
        const dir = this.determineDirection(key, key2)
        let connections = {} as IPointConnections
        let joinSectors = existedPoint.connections[color] || []
        let index = sameColor ? this.getSectorIndex(dir, joinSectors) : -1
        joinSectors[index >= 0 ? index : joinSectors.length] = {dir, neighbor: key2}
        for (const col in existedPoint.connections) {
            const sectors = existedPoint.connections[col]
            connections[col] = index < 0 && col !== color 
                ? sectors.filter(d => d.dir !== dir)
                : sectors
        }
        connections[color] = joinSectors        
        const updatedPointProps = { 
            utmost: !sameColor || existedPoint.utmost,
            connections 
        }
        this.addPoints({[key]: updatedPointProps})
        // console.log('after create join', key, connections, updatedPointProps,  this.takenPoints, )
    }

    updateLineStart = (key: string, key2: string, color: string) => {
        const point = this.getPoint(key2)
        if (!point || !point.connections) return
        const {connections, utmost} = point
        const dir = this.determineDirection(key2, key)
        const sectors = connections[color]
        const index = this.getSectorIndex(dir, sectors)
        sectors[index] = { dir, neighbor: key}
        connections[color] = sectors
        const newPoint = {
            [key2]: {
                utmost,
                connections
            }
        } as ITakenPoints 
        this.addPoints(newPoint)
    }

    continueLine = (key: string, key2: string, color: string) => {
        const dir = this.determineDirection(key, key2)
        const sectors = defaultSectors()
        const index = this.getSectorIndex(dir, sectors)
        sectors[index] = {dir, neighbor: key2}
        const point = {
            [key]: {
                utmost: false,
                connections: {
                    [color]: sectors
                } 
            }
        } as ITakenPoints
        console.warn('line continue', point)  
        this.addPoints(point)
    }

    resolveMouseLeave = (key: string, color: string) => {

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
