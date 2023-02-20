
import { IPuzzle, ITakenPoints } from "../constant/interfaces";
import { rectCreator } from '../rect-constructor/rect-creator'
import { manager } from './manager'

export class PuzzleCompiler {
    puzzle = {} as IPuzzle 

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
        const points = rectCreator.takenPoints
        const startPoints = {} as ITakenPoints
        const dotsSegragatedByColor = {} as {[key: string]: ITakenPoints}
        for (const key in points) {
            if (points[key].utmost) {
                startPoints[key] = points[key]
            } else {
                for (const color in points[key].connections) {
                    const coloredDots = dotsSegragatedByColor[color] || {}
                    dotsSegragatedByColor[color] = {
                        ...coloredDots, [key]: points[key]
                    }
                }
            }
        }
        const date = new Date()
        const colors = Object.keys(dotsSegragatedByColor).length
        const name = `puzzle${rectCreator.width}-${rectCreator.height}colors${colors}_date${date}`
        const puzzle = {
            name,
            startPoints,
            dotsSegragatedByColor,
            width: rectCreator.width,
            height: rectCreator.height
        } as IPuzzle
        this.puzzle = puzzle
        return puzzle
    }

    savePuzzle = () => {
        const puzzle = this.createPuzzle()
        manager.savePuzzle(puzzle)
        // console.log('puzzle saved', rectCreator.takenPoints, )
        return JSON.stringify(puzzle)
    }
    
}

export const puzzleCompiler = new PuzzleCompiler()
