import {IPuzzle, ISwitcherProps} from "../../constant/interfaces"
import {useEffect, useState} from "react";

import {puzzlesManager} from '../../puzzles-storage/puzzles-manager'

import './mode-switcher.scss'



export const ModeSwitcher: React.FC<ISwitcherProps> = (props) => {
    const [puzzleSelected, setPuzzleSelected] = useState(false)
    function puzzleSelect(p: IPuzzle) {
        setPuzzleSelected(!!p)
    }
    useEffect(() => {
        const unsubUnresolved = puzzlesManager.$unresolved.subscribe(puzzleSelect)
        console.log(puzzlesManager.$unresolved.subscribers, puzzlesManager.$unresolved.data)
        return unsubUnresolved()
    }, [])
    const {
        handlers: {
            selectMode = () => {},
        },
        mode
    } = props
    const switcherClass = `mode-switcher mode-${mode}`
    console.log(puzzleSelected)
    return <div className={switcherClass}>
        {
            mode === 'resolve' ? (
                <>
                    <button
                        className="mode-switcher-btn"
                        onClick={() => selectMode('create')}
                        disabled={!!puzzleSelected}
                    >
                        Create Puzzle
                    </button>
                </>

            )
            : (
                <button 
                    className="mode-switcher-btn"
                    onClick={() => selectMode('resolve')}
                >
                    Puzzles
                </button>
            )
        }
    </div>
}
