import { IPuzzle } from "../constant/interfaces"

import './puzzles-menu.scss'

export interface IPuzzleSelectorProps {
    setPuzzle: Function
    puzzles: IPuzzle[]
}


export const PuzzleSelector: React.FC<IPuzzleSelectorProps> = (props: IPuzzleSelectorProps) => {
    
    const {puzzles, setPuzzle} = props

    return <div className='puzzles-container'>
        {
            puzzles.map((p, i) => {
                return p.name 
                ? <button
                    className='puzzle-btn'
                    type="button"
                    key={p.name}
                    onClick={() => setPuzzle(puzzles[i])}
                >
                    {p.name.slice(0, 16)}
                </button>
                : null
            })
        }
    </div>
}
