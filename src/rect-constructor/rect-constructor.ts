import { MinLinesNumber, LineColors, Height, Width } from '../constant/constants'
import {IEndpoints, IEndpointsValue, ITakenPoints} from '../constant/interfaces'
import { LinedRectBase } from './rect-base'


export class LinedRect extends LinedRectBase {
    lineEndPoints = {} as IEndpoints
    linesInterfering = {} as {[key: string]: {[key: string]: number}}
    _startPoints = {} as IEndpoints

    get startPoints() {
        return this.lineEndPoints
    }

    addStartPoints(points: IEndpoints) {
        for (const color in points) {
            this._startPoints[color] = points[color]
        }
    }

    // convertUtmostPointsToStart = (points: ITakenPoints, color: string) => {
    //     const pointKeys = Object.keys(points)
    //     if (pointKeys.length === 2) {
    //        // this.addLineIntervals({[color]: [this.getLineIntervals(pointKeys)]})
    //     } else if (pointKeys.length > 2) {
    //
    //     }
    //     for (const point in points) {
    //         const coordinates = ''
    //         const {utmost, crossLine, joinPoint} = points[point]
    //
    //     }
    // }

    createRandomUtmostPoints = (linesNumber = 3) => {
        const linesToDimension = linesNumber
            || Math.floor((this._width + this._height) / 3)
        const minLinesNumber =  Math.max(MinLinesNumber, linesToDimension)
        for (let i = 0; i < minLinesNumber; i++) {
            const color = LineColors[i]
            // this.lineEndPoints[color] = this.getPairPoints(color)
            this.linesInterfering[LineColors[i]] = {} as {[key: string]: number}
        }
        // this.getRelativeDifficulty()
    }

    // getPoint(key: string | null) {
    //     let x = Math.floor(Math.random() * this._width),
    //         y = Math.floor(Math.random() * this._height)
    //     if (!key) { return [x, y] }
    //     const point = this.rect[key].point
    //     if (point[0] === this._width && x === 0) {
    //         x = Math.floor(Math.random() * (this._width - 1) + 1)
    //     }
    //     if (point[0] === 0 && x === this._width) {
    //         x = Math.floor(Math.random() * (this._width - 1))
    //     }
    //     if (point[1] === this._height && y === 0) {
    //         y = Math.floor(Math.random() * (this._height - 1) + 1)
    //     }
    //     if (point[1] === 0 && y === this._height) {
    //         y = Math.floor(Math.random() * (this._height - 1))
    //     }
        
    //     return [x, y]
    // }

    // getPairPoints = (color: string) => {
    //     const start = {
    //         points: {},
    //         intervals: {x: [], y: []},
    //         difficulty: 0,
    //     } as IEndpointsValue
    //     let firstPoint = null as unknown as string
    //     while (true) {
    //         const [x, y] = this.getPoint(firstPoint)
    //         const key = `${x}-${y}`
    //         if (this._takenPoints[key] || this.checkNeighbor(key, firstPoint)) continue
    //         if (firstPoint) {
    //             const xInterval = [utmost.points[firstPoint].xy[0], x].sort()
    //             const yInterval = [utmost.points[firstPoint].xy[1], y].sort()
    //             utmost.points[key] = {xy: [x, y]}
    //             utmost.intervals.x = xInterval
    //             utmost.intervals.y = yInterval
    //             this._takenPoints[key] = {color, direction: JoinPointDirections.sp}
    //             return utmost
    //         }
    //         if (!firstPoint) {
    //             utmost.points[key] = {xy: [x, y]}
    //             this._takenPoints[key] = {color, direction: JoinPointDirections.sp}
    //             firstPoint = key
    //         }
    //     }
    // }

    // getLinesInterfering = () => {
    //     const colors = Object.keys(this.lineEndPoints)
    //     for (let color of colors) {
    //         const restColors = colors.filter((c) => c !== color)
    //         let interfering = 0
    //         for (let col of restColors) {
    //             if (!(this.linesInterfering[color] || {})[col]) {
    //                 this.getTwoLinesInterfering(color, col)
    //             } 
    //             interfering += this.linesInterfering[color][col]
    //             if (typeof interfering !== 'number') {
    //                 console.error('invalid type data intersection', color, col, this.linesInterfering)
    //             }              
    //         }
    //     }
    //     // console.warn('interfering', this.linesInterfering, colors)
    // }

    getXYLinesIntersection = (points1: IEndpointsValue, points2: IEndpointsValue) => {
        // const {x: x1I, y: y1I} = points1.intervals!
        // const {x: x2I, y: y2I} = points2.intervals!
        // if (x1I[1] < x2I[0]
        //     || x2I[1] < x1I[0]
        //     || y2I[1] < y1I[0]
        //     || y1I[1] < y2I[0]) {
        //         return []
        //     }
        // const startX = Math.max(x1I[0], x2I[0])
        // const endX = Math.min(x1I[1], x2I[1])
        // const startY = Math.max(y1I[0], y2I[0])
        // const endY = Math.min(y1I[1], y2I[1])
        // const [xInt, yInt] = [endX - startX + 1, endY - startY + 1]
        // if (typeof xInt !== 'number' || typeof yInt !== 'number') {
        //     console.error('invalid type data intersection', points1, points2)
        // }
        // return [
        //     [
        //         xInt / (x1I[1] - x1I[0] + 1),
        //         yInt / (y1I[1] - y1I[0] + 1)
        //     ],
        //     [
        //         xInt / (x2I[1] - x2I[0] + 1),
        //         yInt / (y2I[1] - y2I[0] + 1)
        //     ]
        // ]
    }

    // getTwoLinesInterfering(col1: string, col2: string) {
    //     const pair1 = this.lineEndPoints[col1]
    //     const pair2 = this.lineEndPoints[col2]
    //     const xyIntersection = this.getXYLinesIntersection(pair1, pair2)
    //     if (!xyIntersection.length) {
    //         this.linesInterfering[col2][col1] = 0
    //         this.linesInterfering[col1][col2] = 0
    //     } else {
    //         this.linesInterfering[col2][col1] = xyIntersection[0][0] + xyIntersection[0][1]
    //         this.linesInterfering[col1][col2] = xyIntersection[1][0] + xyIntersection[1][1]
    //     }
    // }

    // getRelativeDifficulty = () => {
    //     this.getLinesInterfering()
    //     const colors = Object.keys(this.lineEndPoints)
    //     for (let color of colors) {
    //         const lineInterfering = this.linesInterfering[color]
    //         const interferingValue = colors.filter(c => c !== color).reduce((acc, c) => {
    //             return acc + lineInterfering[c]
    //         }, 0)
    //         this.lineEndPoints[color].difficulty = interferingValue
    //     }
    // }

    getLeastMeddlingPointKey() {

    }

    getLeastMeddlesomePoint = (points: string[], color: string) => {
        const pointMeddling =  points.reduce((acc, key) => {
            const meddling = this.getPointMeddling(this.rect[key].point, color)
            if (acc.meddling < meddling) {
                acc.meddling = meddling
                acc.key = key
            }
            return acc
        }, {key: '', meddling: -1})
        console.log(' point meddling', pointMeddling)
        return pointMeddling.key
    }

    // getDistanceToTargetValue(point: number[]) {
    //     const targetPoint = this.targetPoint.point
    //     const lastPoint = this.lastStartPoint.point
    //     return ( Math.abs(targetPoint[0] - point[0]) < Math.abs(targetPoint[0] - lastPoint[0])
    //             || Math.abs(targetPoint[1] - point[1]) < Math.abs(targetPoint[1] - lastPoint[1])) ? .1 : 0
    // }

    // prioritizePoints = (points: string[]) => {
    //     const prioritizedPoints = points.map(key => {
    //         const point = this.rect[key].point
    //         const pointMeddling = this.getPointMeddling(point, this.targetPoint.color)
    //         const pointDistance = this.getDistanceToTargetValue(point)
    //         return {key, priority: pointDistance + pointMeddling}
    //     }).sort((a, b) => b.priority - a.priority)
    //     console.log(prioritizedPoints)
    //     return prioritizedPoints
    // }

    getPointMeddling(point: number[], color: string) {
        const restColors = Object.keys(this.lineEndPoints).filter(col => col !== color)
        return restColors.reduce((acc, col) => {
            return acc + 1 /// this.getPointInterfering(this.lineEndPoints[col], point)
        }, 0)
    }

    // getPointInterfering = (lineEndpoints: IstartPointsValue, point: number[]) => {
    //     if (lineEndpoints.intervals.x[0] > point[0]
    //         || lineEndpoints.intervals.x[1] < point[0]
    //         || lineEndpoints.intervals.y[0] > point[1]
    //         || lineEndpoints.intervals.y[1] < point[1]) {
    //             return 0
    //         }
    //         return 1
    // }

    getMeddlestUnresolvedLine() {
        return Object.keys(this.lineEndPoints)
        .reduce((acc, color) => {
            const pair = this.lineEndPoints[color][0]
            if (!pair.resolved && (pair.difficulty || 0) >= acc.difficulty) {
                acc.difficulty = pair.difficulty!
                acc.color = color
            }
            return acc
        }, {difficulty: 0, color: ''}).color
    }

    finishLine = (key: string) => {
        return
    }

    checkContinue(key: string) {
        const neighbors = this.rect[key].neighbors
        return neighbors.filter(n => !this._takenPoints[n]).length < 2
    }

    checkNeighbor(key: string, key2: string) {
        for (let neighbor of this.rect[key].neighbors) {
            if (neighbor === key2) { return true }
        }
    }

    // setStartPointMeddlestLine() {
    //     const color = this.getMeddlestUnresolvedLine()
    //     const keys = Object.keys(this.lineEndPoints[color].points) 
    //     this.lastStartPoint = {
    //             key: keys[0],
    //             point: this.lineEndPoints[color].points[keys[0]].xy,
    //             color,
    //             direction: JoinPointDirections.sp
    //     }
    //     this.targetPoint = {
    //         key: keys[1],
    //             point: this.lineEndPoints[color].points[keys[1]].xy,
    //             color,
    //             direction: JoinPointDirections.sp
    //     }
    // }

    // resolveMeddlestLine = () => {
    //     this.setStartPointMeddlestLine()
        
    //     while(true) {
    //         const {color} = this.lastStartPoint
    //         const pointKey = this.getLeastMeddlingPointKey()
            
    //         const {lastDirection, nextDirection}  = this.getDirections(pointKey)
    //         this._takenPoints[this.lastStartPoint.key] = {direction: lastDirection, color}
    //         this.lastStartPoint = {
    //             direction: nextDirection! as JoinPointDirections,
    //             key: pointKey,
    //             color,
    //             point: this.rect[pointKey].point
    //         }
    //         console.warn(this.lastStartPoint)
    //         this._takenPoints[pointKey] = {direction: nextDirection!, color}
    //         const finalPoint = this.rect[pointKey].neighbors.filter((n) => 
    //             this.targetPoint.key === n)[0]
    //         if (finalPoint) {
    //             console.warn('final', finalPoint)
    //             const lastPointDir = this.getDirections(finalPoint)
    //             this._takenPoints[pointKey].direction = lastPointDir.lastDirection!
    //             this._takenPoints[finalPoint].direction = lastPointDir.nextDirection!
    //             this.lastStartPoint = null as unknown as IStartPoint
    //             break
    //         }
    //     }
    // }

    // getDirections = (key: string) => {
    //     console.warn('key', key, 'rect', this.rect, this.rect[key])
    //     const nextPoint = this.rect[key].point 
    //     const lastPoint = this.lastStartPoint.point
    //     let lastDirection = this.lastStartPoint.direction as LineDirections | JoinPointDirections, 
    //         nextDirection = '' as LineDirections | JoinPointDirections
    //     switch (lastDirection) {
    //         case JoinPointDirections.sp: {
    //             if (nextPoint[0] === lastPoint[0]) {
    //                 lastDirection = JoinPointDirections[
    //                     nextPoint[1] < lastPoint[1] ? 'lastd' : 'lastu'
    //                 ]
    //                 nextDirection = JoinPointDirections[
    //                     nextPoint[1] > lastPoint[1] ? 'lastu' : 'lastd'
    //                 ]
    //             } else if (nextPoint[1] === lastPoint[1]) {
    //                 lastDirection = JoinPointDirections[
    //                     nextPoint[0] < lastPoint[0] ? 'lastl' : 'lastr'
    //                 ]
    //                 nextDirection = JoinPointDirections[
    //                     nextPoint[0] > lastPoint[0] ? 'lastl' : 'lastr'
    //                 ]   
    //             } else {
    //                 console.error('invalid next point')
    //             } 
    //             break
    //         }
    //         case JoinPointDirections.lastd: {
    //             if (nextPoint[0] === lastPoint[0]) {
    //                 lastDirection = LineDirections.ud
    //                 nextDirection = JoinPointDirections.lastd
    //             } else if (nextPoint[1] === lastPoint[1]) {
    //                 lastDirection = LineDirections[
    //                     nextPoint[1] > lastPoint[1] ? 'dr' : 'dl'
    //                 ]
    //                 nextDirection = JoinPointDirections[
    //                     nextPoint[0] > lastPoint[0] ? 'lastr' : 'lastl'
    //                 ]
    //             } else {
    //                 console.error('invalid next point')
    //             } 
    //             break
    //         }
    //         case JoinPointDirections.lastu: {
    //             if (nextPoint[0] === lastPoint[0]) {
    //                 lastDirection = LineDirections.ud
    //                 nextDirection = JoinPointDirections.lastu
    //             } else if (nextPoint[1] === lastPoint[1]) {
    //                 lastDirection = LineDirections[
    //                     nextPoint[1] > lastPoint[1] ? 'ld' : 'rd'
    //                 ]
    //                 nextDirection = JoinPointDirections[
    //                     nextPoint[0] > lastPoint[0] ? 'lastr' : 'lastl'
    //                 ]
    //             } else {
    //                 console.error('invalid next point')
    //             } 
    //             break
    //         }
    //         case JoinPointDirections.lastl: {
    //             if (nextPoint[1] === lastPoint[1]) {
    //                 lastDirection = LineDirections.lr
    //                 nextDirection = JoinPointDirections.lastl
    //             } else if (nextPoint[0] === lastPoint[0]) {
    //                 lastDirection = LineDirections[
    //                     nextPoint[1] > lastPoint[1] ? 'ld' : 'dr'
    //                 ]
    //                 nextDirection = JoinPointDirections[
    //                     nextPoint[1] > lastPoint[1] ? 'lastd' : 'lastu'
    //                 ]
    //             } else {
    //                 console.error('invalid next point')
    //             } 
    //             break
    //         }
    //         case JoinPointDirections.lastr: {
    //             if (nextPoint[1] === lastPoint[1]) {
    //                 lastDirection = LineDirections.lr
    //                 nextDirection = JoinPointDirections.lastr
    //             } else if (nextPoint[0] === lastPoint[0]) {
    //                 lastDirection = LineDirections[
    //                     nextPoint[1] > lastPoint[1] ? 'rd' : 'dl'
    //                 ]
    //                 nextDirection = JoinPointDirections[
    //                     nextPoint[1] > lastPoint[1] ? 'lastd' : 'lastu'
    //                 ]
    //             } else {
    //                 console.error('invalid next point')
    //             } 
    //             break
    //         }
    //         default: {
    //             console.error('invalid last direction')
    //             break
    //         }
    //     }
    //     return {lastDirection, nextDirection}
    // }
}

export const rectConstructor = new LinedRect({width: Width, height: Height})
