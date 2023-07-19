import {
    IEndpoints,
    IEndpointsValue,
    ITakenPoints,
} from '../constant/interfaces'
import { PuzzleCommons } from "./rect-commons";
import { DefaultColor } from "../constant/constants";
import { isDev } from "../utils/helper-fn";

export class PuzzleEvaluator extends PuzzleCommons {
    linesInterfering = {} as {[key: string]: number}
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

    preparePuzzleEvaluation = () => {
        console.log('prepare evaluation')
        const passed = {} as {[key: string]: boolean}
        const lines = {} as {[key: string]: number}
        for (const point in this.takenPoints) {
            if (passed[point]) { continue }
            const {
                colors,
                connections,
                neighbors
            } = this.checkPoint(point)
            if (!connections) {
                return console.error('not connections', colors, point)
            }
            for (const color of colors) {
                const lineNeighbors = colors.length > 1
                    ? this.getLineNeighbors(connections, color)
                    : neighbors
                const line = this.getFullLineFromAnyPoint(point, color, lineNeighbors)
                if (!line.length || line.length < 3) {
                    this.lineError = `Line of ${color} color is too short. It has Less then 3 points`
                    return console.error(line)
                }
                const start = line[0]
                const end = line[line.length - 1]
                this.convertLastToEndpoint(start)
                this.convertLastToEndpoint(end)
                line.forEach(p => { passed[p] = true })
                if (this.addLineEndpoint([start, end])) {
                    if (lines[color] && lines[color] > 0) {
                        this.lineError = `There are too many lines of ${color} color. Limit is 2`
                        return false
                    }
                    lines[color] = 1
                }
            }
        }
        console.log('prepared', this.lineEndpoints)
        return true
    }

    addLineEndpoint = (points: string[]) => {
        if (this.lineEndpoints[`${points[0]}_${points[1]}`]
            || this.lineEndpoints[`${points[1]}_${points[0]}`]) {
            return false
        }
        const {pairKey, ...endpoints} = this.getLineEndpoints(points)
        this.lineEndpoints[pairKey] = endpoints
        return true
    }

    getLineEndpoints = (points: string[]): IEndpointsValue & {pairKey: string} => {
        const firstPointCoords = points[0].split('-').map(i => parseInt(i))
        const secondPointCoords = points[1].split('-').map(i => parseInt(i))
        return {
            pairKey: `${points[0]}_${points[1]}`,
            coords1: firstPointCoords,
            coords2: secondPointCoords,
            intervals: {
                x: firstPointCoords[0] - secondPointCoords[0],
                y: firstPointCoords[1] - secondPointCoords[1]
            },
            meddling: 0
        }
    }

    evaluatePuzzle = () => {
        let puzzleInterfering = 0
        this.linesInterfering = {}
        for (const key1 in this.lineEndpoints) {
            for (const key2 in this.lineEndpoints) {
                // console.log(key1, key2, this.linesInterfering)
                if (key1 === key2
                    || this.linesInterfering[`${key1}_${key2}`]
                    || this.linesInterfering[`${key2}_${key1}`]) {
                    continue
                }
                const key = `${key1}_${key2}`
                const line1 = this.lineEndpoints[key1]
                const line2 = this.lineEndpoints[key2]
                this.linesInterfering[key] = this.twoLinesInterfering(line1, line2)
                puzzleInterfering += this.linesInterfering[key]
                this.lineEndpoints[key1].meddling += this.linesInterfering[key]
                this.lineEndpoints[key2].meddling += this.linesInterfering[key]
            }
        }
        // console.log('eval puzzle', this.linesInterfering, this.lineEndpoints)
        return Math.round(puzzleInterfering / Object.keys(this.lineEndpoints).length)
    }

    cosOfLines = (line1: IEndpointsValue, line2: IEndpointsValue) => {
        const linesMultiply = (line1.intervals.x * line2.intervals.x) +
            (line1.intervals.y   * line2.intervals.y)
        const line1Abs = Math.sqrt(line1.intervals.x * line1.intervals.x
            + line1.intervals.y * line1.intervals.y)
        const line2Abs = Math.sqrt(line2.intervals.x * line2.intervals.x
            + line2.intervals.y * line2.intervals.y)
        const cos = linesMultiply / line1Abs / line2Abs
        return Math.min(Math.max(cos, -1), 1)
    }

    twoLinesInterfering = (line1: IEndpointsValue, line2: IEndpointsValue) => {
        const { coords1: [l1x1, l1y1], coords2: [l1x2, l1y2] } = line1
        const { coords1: [l2x1, l2y1], coords2: [l2x2, l2y2] } = line2
        const line1X = [l1x1, l1x2].sort()
        const line2X = [l2x1, l2x2].sort()
        const line1Y = [l1y1, l1y2].sort()
        const line2Y = [l2y1, l2y2].sort()
        if ((line1X[1] < line2X[0]
            || line1Y[1] < line2Y[0]
            || line2Y[1] < line1Y[0]
            || line2X[1] < line1X[0])
            // && !interfering1
        ) {
            // console.warn('no interfering', line1, line2)
            return 0
        }
        const cos = this.cosOfLines(line1, line2)
        const sin = Math.sqrt((1 - cos * cos))
        const line1Length = Math.sqrt((l1x1 - l1x2) * (l1x1 - l1x2) + (l1y1 - l1y2) * (l1y1 - l1y2))
        const line2Length = Math.sqrt((l2x1 - l2x2) * (l2x1 - l2x2) + (l2y1 - l2y2) * (l2y1 - l2y2))
        const interfering1 = ((line1Length + line2Length) * sin)
        const intersectionX0 = Math.max(line1X[0], line2X[0])
        const intersectionX1 = Math.min(line1X[1], line2X[1])
        const intersectionY0 = Math.max(line1Y[0], line2Y[0])
        const intersectionY1 = Math.min(line1Y[1], line2Y[1])
        const interfering2 = Math.abs((intersectionX1 - intersectionX0) * cos)
            + Math.abs((intersectionY1 - intersectionY0) * sin)
        // console.log('interfering', line1, line2, sin, interfering1, interfering2)
        return Math.max(interfering1, interfering2)
    }

    resolvePuzzle = () => {
        const lineKeys = Object.keys(this.lineEndpoints).sort((a, b) => {
                return this.lineEndpoints[b].meddling - this.lineEndpoints[a].meddling
        })
        if (!Object.keys(this.lineEndpoints).length) {
            return console.error('impossible resolve')
        }

    }

    getDistantWithMeddling = (point: string, target: string) => {
        const dist = this.getDistantBetweenPoints(point, target)
        if (dist === 0) {
            return 0
        }
        return this.getPointMeddling(point) + dist / 100
    }

    getPointMeddling(point: string) {
        const coords = this.rect[point].point
        let meddling = 0
        let lines = 0
        for (const key in this.lineEndpoints) {
            lines++
            const lineProps = this.lineEndpoints[key]
            const sortedX = [lineProps.coords1[0], lineProps.coords2[0]].sort()
            const sortedY = [lineProps.coords1[1], lineProps.coords2[1]].sort()
            if (sortedX[0] < coords[0] && sortedX[1] > coords[0]
                && sortedY[0] < coords[1] && sortedY[1] > coords[1]) {
                meddling += 1
            }
        }
        if (lines < 1) {
            console.error('not evaluated', this.lineEndpoints)
        }
        return meddling
    }
}
