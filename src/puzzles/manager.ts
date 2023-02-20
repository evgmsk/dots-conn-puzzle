import { LocalStorageName } from "../constant/constants";
import { IPuzzle } from "../constant/interfaces";


export class PuzzleManager {
    _puzzles: IPuzzle[]
    constructor() {
        this._puzzles = this.getFromStorage()
    }

    savePuzzle = (puzzle: IPuzzle) => {
        this._puzzles.push(puzzle)
        localStorage.setItem(LocalStorageName, JSON.stringify(this._puzzles))
    }

    getFromStorage = (): IPuzzle[] => {
        this._puzzles = JSON.parse(localStorage.getItem(LocalStorageName) || "[]")
        return this._puzzles
    }

    get puzzles() {
        return this._puzzles
    }

    set puzzles(puzzles: IPuzzle[]) {
        this._puzzles = puzzles
    }
}

export const manager = new PuzzleManager()
