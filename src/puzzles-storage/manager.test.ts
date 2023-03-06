import { IPuzzle } from '../constant/interfaces'
import {PuzzleManager} from './puzzles-manager'

describe('test puzzle manager', () => {
    const manager = new PuzzleManager()
    test('save to storage', () => {
        const puzzle = {name: 'test'} as  IPuzzle
        const puzzleLength = manager.puzzles.length
        manager.savePuzzle(puzzle)
        expect(manager.puzzles.length).toBe(puzzleLength + 1)
        const puzzles = manager.getFromStorage()
        expect(puzzles[puzzles.length - 1]).toEqual({name: 'test'})
        // console.log(puzzles-storage)
    })
})
