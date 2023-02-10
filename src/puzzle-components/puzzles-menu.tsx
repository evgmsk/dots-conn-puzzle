import { IPuzzleProps } from "../constant/interfaces"

export interface IPuzzleSelectorProps {
    setPuzzle: Function
}


export const PuzzleSelector: React.FC<IPuzzleSelectorProps> = (props: IPuzzleSelectorProps) => {
    const puzzles = [] as IPuzzleProps[]
    const {setPuzzle} = props

    return <>{
            puzzles.map((p, i) => {
                return <button 
                    type="button"
                    key={i}
                    onClick={() => setPuzzle(puzzles[i])}
                >
                </button>
            })
    }</>
}
