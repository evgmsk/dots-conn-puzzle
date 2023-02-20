import { Puzzle } from './rect/rect'

import { IRectProps } from '../constant/interfaces'
import { PuzzleSelector } from './puzzles-menu'
import { useState } from 'react'

export const PuzzleWrapper: React.FC = () => {
    const [puzzle, setPuzzle] = useState({} as IRectProps)
    return puzzle 
      ? <PuzzleResolver
          dimension={{...puzzle.dimension}}
          points={{...puzzle.points}}
        /> 
      : <PuzzleSelector setPuzzle={setPuzzle} />
  }

export const PuzzleResolver: React.FC<IRectProps> = (props: IRectProps) => {
    const {dimension: {width, height}, points} = props

    // const [update, setUpdate] = useState(0)
    
    // useEffect(() => {
    // }, [update])    


    const handleMouseUp = () => {

    }

    const handleMouseDown = () => {

    }

    const handlerMouseMove = () => {

    }
 
    const resolvePuzzleHandlers = {
        handleMouseDown,
        handlerMouseMove,
        handleMouseUp
    }



    const puzzleClassName = `puzzle-rect_${width}-${height}`

    return <div className={puzzleClassName}>
                <Puzzle 
                        points={points} 
                        dimension={{width, height}}
                        handlers={resolvePuzzleHandlers} 
                    />
            </div>
}
