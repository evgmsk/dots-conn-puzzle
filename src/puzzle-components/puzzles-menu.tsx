import { IPuzzle } from "../constant/interfaces"

import './puzzles-menu.scss'

export interface IPuzzleSelectorProps {
    setPuzzle: Function
    puzzles: IPuzzle[]
}


export const PuzzleSelector: React.FC<IPuzzleSelectorProps> = (props: IPuzzleSelectorProps) => {
    
    const {puzzles, setPuzzle} = props

    return <>{
            puzzles.map((p, i) => {
                return p.name 
                ? <button 
                    type="button"
                    key={p.name}
                    onClick={() => setPuzzle(puzzles[i])}
                >
                    {p.name.slice(0, 15)}
                </button>
                : null
            })
    }</>
}
