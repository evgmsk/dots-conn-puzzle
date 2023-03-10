import { LocalStorageName } from "../constant/constants";
import { IPuzzle } from "../constant/interfaces";
import {isDev} from "../helper-fns/helper-fn";


export class PuzzleManager {
    _puzzles: IPuzzle[]
    constructor() {
        this._puzzles = this.getFromStorage()
    }

    savePuzzle = (puzzle: IPuzzle) => {
        this._puzzles.push(puzzle)
        localStorage.setItem(LocalStorageName, JSON.stringify(this._puzzles))
        return JSON.stringify(puzzle)
    }


    getFromStorage = (): IPuzzle[] => {
        this._puzzles = JSON.parse(localStorage.getItem(LocalStorageName) || "[]")
        // isDev() && console.log(this.puzzles)
        return this._puzzles.filter(p => p.name)
    }

    get puzzles() {
        return this._puzzles
    }

    set puzzles(puzzles: IPuzzle[]) {
        this._puzzles = puzzles
    }
}

export const manager = new PuzzleManager()
