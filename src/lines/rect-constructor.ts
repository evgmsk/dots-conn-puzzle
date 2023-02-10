import { MinLinesNumber, LineColors } from '../constant/constants'

export interface IRectDimention {
    width: number
    height: number
}

export interface IPointValue {
    xy: number[]
}

export enum TurnPoint {
    dl = 'dl',
    dr = 'dr',
    ul = 'ul',
    ur = 'ur'
}

export interface ITakenPoints {
    [key: string]: {color: string, turnPoint?: TurnPoint}
}
//
export interface UtmostPointsValue {
    points: IPoint
    intervals: {x: number[], y: number[]}
    difficulty?: number
}

export interface IUtmostPoints {
    [key: string]: UtmostPointsValue
}

export interface IPoint {
   [key: string]: IPointValue
}

export interface IRectCell {
    [key: string]: {neighbors: string[], point: number[]}
}

export interface ILines {
    [color: string]: IPoint[]
}



export interface ILinedRect {
    rectDim: IRectDimention
    lineEndPoints: IUtmostPoints
    rect: IRectCell
    minLinesNumber: number
    takenPoints: ITakenPoints

}

export class LinedRect implements ILinedRect {
    rectDim: IRectDimention
    rect: IRectCell
    takenPoints = {} as ITakenPoints
    lineEndPoints = {} as IUtmostPoints
    minLinesNumber = MinLinesNumber
    linesInterfering = {} as {[key: string]: {[key: string]: number}}
    lastStartPoint = {} as {key: string, point: IPointValue, color: string}
    prevStartPoint = {} as {key: string, point: IPointValue, color: string}
    takeFirst = true

    constructor(size: IRectDimention) {
        this.rectDim = size
        this.rect = this.createRect()
    }

    set dimention(size: IRectDimention) {
        this.rectDim = size
    }

    get startPoints() {
        return this.lineEndPoints
    }

    get lines() {
        return this.takenPoints
    }

    createRect() {
        const rect = {} as IRectCell
        for (let i = 0; i < this.rectDim.height; i++) {
            for (let j = 0; j < this.rectDim.width; j++) {
                const [x, y] = [j+1, i+1]
                const key = `${x}-${y}`
                const neighbors = this.getNeihgbors(x, y)
                rect[key] = {neighbors, point: [x, y]}
            }
        }
        return rect 
    }

    getNeihgbors(x: number, y: number): string[] {
        const neighbors = [] as string[]
        if (x > 0) {
            neighbors.push(`${x - 1}-${y}`)
        }
        if (y > 0) {
            neighbors.push(`${x}-${y - 1}`)
        }
        if (y < this.rectDim.height - 1) {
            neighbors.push(`${x}-${y + 1}`)
        }
        if (x < this.rectDim.width - 1) {
            neighbors.push(`${x + 1}-${y}`)
        }
        return neighbors
    }

    createRandomUtmostPoints(linesNumber = 0) {
        const linesToDimention = linesNumber 
            || Math.floor((this.rectDim.width + this.rectDim.height) / 3)
        this.minLinesNumber =  Math.max(MinLinesNumber, linesToDimention)
        for (let i = 0; i < this.minLinesNumber; i++) {
            const color = LineColors[i]
            this.lineEndPoints[color] = this.getPairPoints(color)
            this.linesInterfering[LineColors[i]] = {} as {[key: string]: number}
        }
    }

    getPairPoints(color: string): UtmostPointsValue {
        const utmost = {
            points: {},
            intervals: {x: [], y: []},
            difficulty: 0
        } as UtmostPointsValue
        let firstPoint = null as unknown as string
        while (true) {
            const x = Math.floor(Math.random() * this.rectDim.width)
            const y = Math.floor(Math.random() * this.rectDim.height)
            const key = `${x}-${y}`
            if (this.takenPoints[key]) continue
            if (firstPoint) {
                const xInterval = [utmost.points[firstPoint].xy[0], x].sort()
                const yInterval = [utmost.points[firstPoint].xy[1], y].sort()
                utmost.points[key] = {xy: [x, y]}
                utmost.intervals.x = xInterval
                utmost.intervals.y = yInterval
                this.takenPoints[key] = {color}
                return utmost
            } 
            if (!firstPoint) {
                utmost.points[key] = {xy: [x, y]}
                this.takenPoints[key] = {color}
                firstPoint = key
            }
        }
    }

    getLinesInterfering() {
        const colors = Object.keys(this.lineEndPoints)
        for (let color of colors) {
            const restColors = colors.filter((c) => c !== color)
            let interfering = 0
            for (let col of restColors) {
                if (!(this.linesInterfering[color] || {})[col]) {
                    this.getTwoLinesInterfering(color, col)
                } 
                interfering += this.linesInterfering[color][col]
                if (typeof interfering !== 'number') {
                    console.error('invalid type data intersection', color, col, this.linesInterfering)
                }              
            }
        }
    }

    getXYLinesIntersection(points1: UtmostPointsValue, points2: UtmostPointsValue) {
        const {x: x1I, y: y1I} = points1.intervals
        const {x: x2I, y: y2I} = points2.intervals
        if (x1I[1] < x2I[0] 
            || x2I[1] < x1I[0] 
            || y2I[1] < y1I[0]
            || y1I[1] < y2I[0]) {
                return []
            }
        const startX = Math.max(x1I[0], x2I[0])
        const endX = Math.min(x1I[1], x2I[1])
        const startY = Math.max(y1I[0], y2I[0])
        const endY = Math.min(y1I[1], y2I[1])
        const [xInt, yInt] = [endX - startX + 1, endY - startY + 1]
        if (typeof xInt !== 'number' || typeof yInt !== 'number') {
            console.error('invalid type data intersection', points1, points2)
        }
        return [
            [
                xInt / (x1I[1] - x1I[0] + 1),
                yInt / (y1I[1] - y1I[0] + 1)
            ],
            [
                xInt / (x2I[1] - x2I[0] + 1),
                yInt / (y2I[1] - y2I[0] + 1)
            ]
        ]
    } 

    getTwoLinesInterfering(col1: string, col2: string) {
        const pair1 = this.lineEndPoints[col1]
        const pair2 = this.lineEndPoints[col2]
        const xyIntersection = this.getXYLinesIntersection(pair1, pair2)
        if (!xyIntersection.length) {
            this.linesInterfering[col1][col2] = 0
            this.linesInterfering[col2][col1] = 0
        } else {
            this.linesInterfering[col1][col2] = xyIntersection[0][0] + xyIntersection[0][1]
            this.linesInterfering[col2][col1] = xyIntersection[1][0] + xyIntersection[1][1]
        }
    }

    getRelativeDifficulty() {
        this.getLinesInterfering()
        const colors = Object.keys(this.lineEndPoints)
        for (let color of colors) {
            const lineInterfering = this.linesInterfering[color]
            const interferingValue = colors.filter(c => c !== color).reduce((acc, c) => {
                return acc + lineInterfering[c]
            }, 0)
            this.lineEndPoints[color].difficulty = interferingValue
        }
    }

    getAvailalblePoints() {
        const {key, color} = this.lastStartPoint
        let neighbors = this.rect[key].neighbors
        neighbors = neighbors.filter(nei => {
            if (this.takenPoints[nei]) return false
            for (let neighbor of this.rect[nei].neighbors) {
                if (this.takenPoints[neighbor] 
                    && this.takenPoints[neighbor].color === color) {
                        return false
                    }
            }
            return true
        })
        return this.getLeastMeddlesomePoint(neighbors, color)
    }

    getLeastMeddlesomePoint(points: string[], color: string) {
        return  points.reduce((acc, key) => {
            const meddling = this.getPointMeddling(this.rect[key].point, color)
            if (acc.meddling < meddling) {
                acc.meddling = meddling
                acc.key = key
            }
            return acc
        }, {key: '', meddling: -1}).key
    }

    getPointMeddling(point: number[], color: string) {
        const restColors = Object.keys(this.lineEndPoints).filter(col => col !== color)
        return restColors.reduce((acc, col) => {
            return acc + this.getPointInterfering(this.lineEndPoints[col], point)
        }, 0)
    }

    getPointInterfering(utmostPoints: UtmostPointsValue, point: number[]) {
        if (utmostPoints.intervals.x[0] > point[0]
            || utmostPoints.intervals.x[1] < point[0]
            || utmostPoints.intervals.y[0] > point[1]
            || utmostPoints.intervals.y[1] < point[1]) {
                return 0
            }
            return 1
    }
} 
