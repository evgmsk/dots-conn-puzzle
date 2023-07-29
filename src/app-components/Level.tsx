import {puzzlesManager} from "../app-services/puzzles-manager";
import {useEffect, useState} from "react";
import {IPuzzle} from "../constant/interfaces";

export const Level = () => {
    const [level, setLevel] = useState('x')
    const getLevel = (puzzle: IPuzzle) => {
        setLevel(puzzle?.difficulty ? puzzle.difficulty.toString() : 'x')
    }

    useEffect(() => {
        const subUnresolved = puzzlesManager.$unresolved.subscribe(getLevel)
        return subUnresolved
    }, [])
    return (
        <div className='puzzle-level'>
            Level:&nbsp;{ level || 'x' }
        </div>
    )
}
