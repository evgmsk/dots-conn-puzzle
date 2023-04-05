
import {
    IEndpoints,
    IEndpointsValue,
} from '../constant/interfaces'
import {PuzzleCommons} from "./rect-commons";
import {DefaultColor, Height, Width} from "../constant/constants";
import {copyObj} from "../helper-fns/helper-fn";


export class PuzzleEvaluator extends PuzzleCommons {
    linesInterfering = {} as {[key: string]: {[key: string]: number}}
    lineError = ''
    lineEndpoints = {} as IEndpoints

    checkPoint = (point: string) => {
        const {endpoint, connections} = this.getPoint(point)
        const {crossLine, joinPoint} = endpoint
            ? this.prepareEndpointForResolver({endpoint, connections})
            : {crossLine: undefined, joinPoint: undefined}
        const colors = this.getColors(connections)
        const neighbors = this.getLineNeighbors(connections)
        if ((!(crossLine || joinPoint) && colors.length !== 1)
            || (endpoint && !(crossLine || joinPoint) && neighbors.length !== 1)
            || colors.includes(DefaultColor)
            || (!joinPoint && colors.length > 2)
        ) {
            this.lineError = `${colors[0]} line broken`
            return {}
        }
        return {endpoint, crossLine, colors, connections, joinPoint, neighbors}
    }

    separateDotsByLines = () => {
        console.log('separating starting', copyObj(this.lines))
        const passed = {} as {[key: string]: boolean}
        for (const point in this.takenPoints) {
            if (passed[point]) { continue }
            const {
                endpoint,
                crossLine,
                colors,
                connections,
                joinPoint,
                neighbors
            } = this.checkPoint(point)
            console.log('check point', connections, endpoint, crossLine, joinPoint)
            if (!connections) return
            for (const color of colors) {
                const lineNeighbors = colors.length > 1
                    ? this.getLineNeighbors(connections, color)
                    : neighbors
                const line = crossLine || !endpoint
                    ? this.getLineFromMiddlePoint(lineNeighbors, point, color)
                    : this.getLineFromEndpoint(point, color)
                if (!line.start) return
                line.line.forEach(p => {
                    passed[p] = true
                })
                this.addPairEndpoints(line.start, line.end, line.color)
                this.addLine(line.line, line.color)
                console.log('line', color, this.takenPoints, line)
            }
        }
        return true
    }

    addLine = (line: string[], color: string) => {
        if (!this.lines[color]) {
            this.lines[color] = []
        }
        this.lines[color].push(line)
    }

    addPairEndpoints = (start: string, end: string, color: string) => {
        const lineIntervals = this.getLineIntervals([start, end])
        if (this.lineEndpoints[color]) {
            this.lineEndpoints[color].push(lineIntervals)
        } else {
            this.lineEndpoints[color] = [lineIntervals]
        }
    }

    getLineIntervals = (points: string[]): IEndpointsValue => {
        const firstPointCoords = points[0].split('-').map(i => parseInt(i))
        const secondPointCoords = points[1].split('-').map(i => parseInt(i))
        return {
            pairKey: `${points[0]}_${points[1]}`,
            coords1: firstPointCoords,
            coords2: secondPointCoords,
            intervals: {
                x: firstPointCoords[0] - secondPointCoords[0],
                y: firstPointCoords[1] - secondPointCoords[1]
            }
        }
    }

    evaluatePuzzle = () => {
        let puzzleInterfering = 0
        for (const line in this.lines) {
            const restColors = Object.keys(this.lines).filter(col => col !== line)
            for (const color of restColors) {
                if (this.linesInterfering[color] && this.linesInterfering[color][line]) {
                    continue
                }
                // eslint-disable-next-line no-loop-func
                this.lineEndpoints[line].forEach(utPair => {
                    this.lineEndpoints[color].forEach(uP => {
                        const interfering = this.twoLinesInterfering(uP, utPair)
                        this.linesInterfering[line] = this.linesInterfering[line] || {}
                        this.linesInterfering[color] = this.linesInterfering[color] || {}
                        this.linesInterfering[color][line] = interfering
                        this.linesInterfering[line][color] = interfering
                        puzzleInterfering += interfering
                    })
                })
            }
        }
        return Math.round(puzzleInterfering
            * Math.sqrt(this.width * this.height / Height / Width / 10)
        )
    }
    //
    // evaluatePuzzle = () => {
    //     let puzzleInterfering = 0
    //     for (const line in this._lines) {
    //         const restColors = Object.keys(this._lines).filter(col => col !== line)
    //         for (const color of restColors) {
    //             if (this.linesInterfering[color] && this.linesInterfering[color][line]) {
    //                 continue
    //             }
    //             // eslint-disable-next-line no-loop-func
    //             this.lineEndpoints[line].forEach(utPair => {
    //                 this.lineEndpoints[color].forEach(uP => {
    //                     const interfering = this.twoLinesInterfering(uP, utPair)
    //                     this.linesInterfering[line] = this.linesInterfering[line] || {}
    //                     this.linesInterfering[color] = this.linesInterfering[color] || {}
    //                     this.linesInterfering[color][line] = interfering
    //                     this.linesInterfering[line][color] = interfering
    //                     puzzleInterfering += interfering
    //                 })
    //             })
    //         }
    //     }
    //     return Math.round(puzzleInterfering
    //         * Math.sqrt(this.width * this.height / Height / Width / 100)
    //     )
    // }

    // addToStartPoints = (key: string, pointProps: ITakenPointProps) => {
    //     const colors = this.getColors(pointProps.connections)
    //     for (const color of colors) {
    //         if (!this.lineStartPoints[color]) {
    //             this.lineStartPoints[color] = []
    //         }
    //         this.lineStartPoints[color].push(key)
    //     }
    // }

    cosOfLines = (line1: IEndpointsValue, line2: IEndpointsValue) => {

        const linesMultiply = (line1.intervals.x * line2.intervals.x) +
            (line1.intervals.y   * line2.intervals.y)
        const line1Abs = Math.sqrt(line1.intervals.x * line1.intervals.x
            + line1.intervals.y * line1.intervals.y)
        const line2Abs = Math.sqrt(line2.intervals.x * line2.intervals.x
            + line2.intervals.y * line2.intervals.y)
        return linesMultiply / line1Abs / line2Abs
    }

    twoLinesInterfering = (line1: IEndpointsValue, line2: IEndpointsValue) => {
        const { coords1: [l1x1, l1y1], coords2: [l1x2, l1y2] } = line1
        const { coords1: [l2x1, l2y1], coords2: [l2x2, l2y2] } = line2
        const line1X = [l1x1, l1x2].sort()
        const line2X = [l2x1, l2x2].sort()
        const line1Y = [l1y1, l1y2].sort()
        const line2Y = [l2y1, l2y2].sort()
        if (line1X[1] < line2X[0]
            || line1Y[1] < line2Y[0]
            || line2Y[1] < line1Y[0]
            || line2X[1] < line1X[0]
        ) {
            return 0
        }
        const intersectionX0 = Math.max(line1X[0], line2X[0])
        const intersectionX1 = Math.min(line1X[1], line2X[1])
        const intersectionY0 = Math.max(line1Y[0], line2Y[0])
        const intersectionY1 = Math.min(line1Y[1], line2Y[1])
        const cos = this.cosOfLines(line1, line2)
        const sin = Math.sqrt((1 - cos * cos))
        const interfering = Math.abs((intersectionX1 - intersectionX0) * cos)
            + Math.abs((intersectionY1 - intersectionY0) * sin)
        console.log('interfering', line1, line2, sin, cos, interfering)
        return interfering
    }

    getLeastMeddlingPointKey() {

    }

}
