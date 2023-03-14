
import {
    IUtmostPoints,
    IUtmostPointsValue,
    IStartPoints,
    ITakenPointProps,
} from '../constant/interfaces'
import {PuzzleCommons} from "./rect-commons";


export class PuzzleEvaluator extends PuzzleCommons {
    linesInterfering = {} as {[key: string]: {[key: string]: number}}
    utmostPoints = {} as IUtmostPoints
    lineStartPoints = {} as IStartPoints
    lineError = ''

    addLineIntervals(points: IUtmostPoints) {
        for (const color in points) {
            this.utmostPoints[color] = points[color]
        }
    }

    getLineIntervals = (points: string[]): IUtmostPointsValue => {
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

    getLinesUtmostPoints = () => {
        for (const line in this.lineStartPoints) {
            const utmostPoints = this.getLineUtmostPoints(this.lineStartPoints[line], line)
            console.warn('utmost point', utmostPoints, line, this.lineStartPoints)
            if (!utmostPoints.length) {
                return false
            }
            this.utmostPoints[line] = this.utmostPoints[line].length
                ? this.utmostPoints[line].concat(utmostPoints)
                : utmostPoints
        }
        return true
    }

    getLineUtmostPoints = (startPoints: string[], color: string) => {
        if (startPoints.length < 2) {
            this.lineError = `there is one utmost point in the ${color} line`
            return []
        }
        const utmostPoints = [] as IUtmostPointsValue[]
        const checkedPoint = {} as {[key: string]: number}
        for (const point of startPoints) {
            if (checkedPoint[point]) {
                continue
            }
            const linePoints = this.getLinePoints(point, color)
            const lastLinePoint = linePoints[linePoints.length - 1]
            if (linePoints.length < 3
                || !startPoints.includes(lastLinePoint)) {
                this.lineError = `line ${color} is broken`
                return []
            }
            linePoints.forEach((p, i) => {
                if (!i || i === linePoints.length - 1) {
                    checkedPoint[p] = 1
                } else {
                    checkedPoint[p] = 2
                }
            })
            utmostPoints.push(this.getLineIntervals([linePoints[0], lastLinePoint]))
        }
        if (Object.keys(checkedPoint).length !== Object.keys(this._lines[color]).length) {
            this.lineError = `${color} lines are corrupted`
            return []
        }
        for (const point in checkedPoint) {
            if (!this._lines[color][point]) {
                this.lineError = `${color} lines are corrupted`
                return []
            }
        }
        this.addLineIntervals({[color]: utmostPoints})
        return utmostPoints
    }

    evaluatePuzzle = () => {
        let puzzleInterfering = 0
        for (const line in this._lines) {
            const restColors = Object.keys(this._lines).filter(col => col !== line)
            for (const color of restColors) {
                if (this.linesInterfering[color] && this.linesInterfering[color][line]) {
                    continue
                }
                // eslint-disable-next-line no-loop-func
                this.utmostPoints[line].forEach(utPair => {
                    this.utmostPoints[color].forEach(uP => {
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
        return Math.round(puzzleInterfering)
    }

    addToStartPoints = (key: string, pointProps: ITakenPointProps) => {
        const colors = this.getColors(pointProps.connections)
        for (const color of colors) {
            if (!this.lineStartPoints[color]) {
                this.lineStartPoints[color] = []
            }
            this.lineStartPoints[color].push(key)
        }
    }

    cosOfLines = (line1: IUtmostPointsValue, line2: IUtmostPointsValue) => {

        const linesMultiply = (line1.intervals.x * line2.intervals.x) +
            (line1.intervals.y   * line2.intervals.y)
        const line1Abs = Math.sqrt(line1.intervals.x * line1.intervals.x
            + line1.intervals.y * line1.intervals.y)
        const line2Abs = Math.sqrt(line2.intervals.x * line2.intervals.x
            + line2.intervals.y * line2.intervals.y)
        return linesMultiply / line1Abs / line2Abs
    }

    twoLinesInterfering = (line1: IUtmostPointsValue, line2: IUtmostPointsValue) => {
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
