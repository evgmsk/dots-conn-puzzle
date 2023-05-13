import { IPuzzle } from "../constant/interfaces"

import {puzzlesManager} from '../puzzles-storage/puzzles-manager'

import './puzzles-menu.scss'

export interface IPuzzleSelectorProps {
    setPuzzle: Function
    puzzles: IPuzzle[]
}


export const PuzzleSelector: React.FC<IPuzzleSelectorProps> = (props: IPuzzleSelectorProps) => {
    const {puzzles} = props
    console.log(puzzles)
    if (!Array.isArray(puzzles)) {
        return <>'Oops something wrong! We'll fix it in a few minutes'</>
    }
    // const {userPuzzles, systemPuzzles} = puzzles.reduce((acc, p) => {
    //     if (p.creator.includes('dot_puzzles')) {
    //
    //     }
    //     return acc
    // }, {userPuzzles: [] as IPuzzle[], systemPuzzles: [] as IPuzzle[]})
    return <div className='puzzles-container'>
        {
            puzzles.map((p, i) => {
                const creator = p.creator
                return creator
                ? <button
                    className='puzzle-btn'
                    type="button"
                    key={i + creator}
                    onClick={() => puzzlesManager.setUnresolved(puzzles[i])}
                >
                    {creator.slice(0, 16)}
                </button>
                : null
            })
        }
    </div>
}
