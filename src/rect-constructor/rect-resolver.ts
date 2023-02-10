import { Height, Width } from "../constant/constants";
import { LinedRectBase } from "./rect-base";

export class PuzzleResolver extends LinedRectBase {

    checkFinish = (key1: string, key2: string) => {
        const prevPoint = this._takenPoints[key1]
        if (!prevPoint) {
            console.error('invalid arguments in checkFinish')
            return false
        }
        const nextPoint = this._takenPoints[key2]
        return nextPoint.color === prevPoint.color && nextPoint.utmost
    }

    addPoint(key1: string, key2: string) {
        const point = this._takenPoints[key2]
        if (point.crossLine) {
            return this.resolveCrossLine(key1, key2)
        }
        if (point.joinPoint) {

        }
    }

    resolveCrossLine(key1: string, key2: string) {

    }

}

export const puzzleResolver = new PuzzleResolver({width: Width, height: Height})
