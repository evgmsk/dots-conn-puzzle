
import { IPuzzle, IStartPoints, ITakenPoints } from "../constant/interfaces";
import {rectCreator} from '../rect-constructor/rect-creator'

import {manager} from './manager'

export class PuzzleCompiler {
    startPoints: IStartPoints = {}
    resolvedPoints: ITakenPoints = {}
    name: string = ''

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
        const valid = this.checkPuzzle()
        if (valid !== 'valid') {
            return valid
        }
        const puzzle: IPuzzle = {
            
        }
    }

    savePuzzle = () => {
        const {name, startPoints, resolvedPoints} = this
        manager.savePuzzle({
            name,
            startPoints,
            resolvedPoints,
            width: rectCreator.width,
            height: rectCreator.height})
    }

}

export const puzzleCompiler = new PuzzleCompiler()
