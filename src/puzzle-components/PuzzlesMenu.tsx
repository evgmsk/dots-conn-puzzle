import { IPuzzle } from "../constant/interfaces"

import './puzzles-menu.scss'

export interface IPuzzleSelectorProps {
    setPuzzle: Function
    puzzles: IPuzzle[]
}


export const PuzzleSelector: React.FC<IPuzzleSelectorProps> = (props: IPuzzleSelectorProps) => {
    const {puzzles, setPuzzle} = props
    console.log(puzzles)
    if (!Array.isArray(puzzles)) {
        return <>'Oops something wrong! We'll fix it in a few minutes'</>
    }
    return <div className='puzzles-container'>
        {
            puzzles.map((p, i) => {
                const creator = p.creator
                console.log(puzzles, p, creator)
                return creator
                ? <button
                    className='puzzle-btn'
                    type="button"
                    key={i + creator}
                    onClick={() => setPuzzle(puzzles[i])}
                >
                    {creator.slice(0, 16)}
                </button>
                : null
            })
        }
    </div>
}
