import { Height, Width } from "../constant/constants";
import { ICollision } from "../constant/interfaces";
// import { defaultSectors } from "../helper-fns/helper-fn";
import { PuzzleCommons } from "./rect-commons";

export class PuzzleResolver extends PuzzleCommons {

    delPointIfNotUtmost = (key: string) => {
        const point = this.getPoint(key)
        console.warn(point, point.utmost)
        // if (point && !point.utmost) {
            this.deletePoint(key)
        // }
    }

    resolveMouseEnter = (
        key: string, 
        key2: string, 
        color: string,
        interfere?: ICollision 
        ) => {
            const {joinPoint, sameColor, sameLine} = interfere || {}
            console.log(key, key2, color, this.takenPoints, interfere)
            if (sameLine) {
                return this.removeLinePart(key2, key, color, this.delPointIfNotUtmost)
            } 
            this.updateLineStart(key, key2, color)
            if (interfere && !sameColor) {
                this.removeInterferedLines(key)
                this.continueLine(key, key2, color)
            } else if (joinPoint && sameColor) {
                this.createJoinPoint(key, key2, color, this.addTakenPoints, sameColor)
            } else if (!interfere) {
                this.continueLine(key, key2, color)
            }
    }

    getLineLength = (start: string, prev: string, color: string) => {
        let lineLength = 0
        const stopFn = (key: string) => {
            lineLength += 1
            const point = this.getPoint(key) || {}
            return key !== start && point.utmost 
        }
        this.goToLinePoint(start, prev, color, stopFn)
        return lineLength
    }

    resolveCrossLine(key1: string, key2: string) {

    }

}

export const puzzleResolver = new PuzzleResolver({width: Width, height: Height})
