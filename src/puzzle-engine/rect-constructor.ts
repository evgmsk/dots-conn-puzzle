import { Height, Width } from '../constant/constants'
import {IEndpoints, IEndpointsValue} from '../constant/interfaces'
import { LinedRectBase } from './rect-base'


export class LinedRect extends LinedRectBase {
    lineEndPoints = {} as IEndpoints
    linesInterfering = {} as {[key: string]: {[key: string]: number}}


    getLeastMeddlingPointKey() {

    }

    getPointMeddling(point: number[], color: string) {
        const restColors = Object.keys(this.lineEndPoints).filter(col => col !== color)
        return restColors.reduce((acc, col) => {
            return acc + 1 /// this.getPointInterfering(this.lineEndPoints[col], point)
        }, 0)
    }

    getPointInterfering = (lineEndpoints: IEndpointsValue, point: number[]) => {
        if (lineEndpoints.intervals.x > point[0]
            || lineEndpoints.intervals.x < point[0]
            || lineEndpoints.intervals.y > point[1]
            || lineEndpoints.intervals.y < point[1]) {
                return 0
            }
            return 1
    }

    checkNeighbor(key: string, key2: string) {
        for (let neighbor of this.rect[key].neighbors) {
            if (neighbor === key2) { return true }
        }
    }
}

export const rectConstructor = new LinedRect({width: Width, height: Height})
