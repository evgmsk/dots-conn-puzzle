import React, {useState} from "react";

import { LineColors, LSUserCreatedPuzzle } from '../../constant/constants'
import { IHandlers } from '../../constant/interfaces'
import { ColorBtn } from './color-btn/ColorBtn'
import { SizeInput } from '../../app-components/size-input/SizeInput'
import { puzzlesManager } from "../../app-services/puzzles-manager";
import { pC } from "../../puzzle-engine/rect-creator";

import './creator-menu.scss'

export interface ICustomPuzzle {
    color: string
    width: number
    height: number
    level?: number
    handlers: IHandlers
}

export const ManagerMenu: React.FC = () => {
    const [resolveCreated, setResolveCreated] = useState(puzzlesManager.resolveCreated)

    const handleResolveCreated = () => {
        console.log(resolveCreated)
        if(!pC.puzzle.points) return
        puzzlesManager.setResolveCreated()
        setResolveCreated(!resolveCreated)
    }
    const undo = () => {
        pC.undo()
    }
    const redo = () => {
        pC.redo()
    }
    const clearAll = () => {
        pC.clearAll()
        puzzlesManager.unresolvedPuzzle && puzzlesManager.setUnresolved()
    }

    const handleClearAll = () => {
        clearAll()
        puzzlesManager.resolveCreated && puzzlesManager.setResolveCreated()
    }

    const sharePuzzle = () => {
        console.log('save', pC.puzzle)
        if (pC.puzzle) return puzzlesManager.handleSavePuzzle(pC.puzzle)
        // const valid = pC.checkPuzzle()
        // if (valid !== 'valid') {
        //     // TODO resolve errors
        //     console.error(valid)
        //     return
        // }
        // const puzzle = pC.buildPuzzle()
        console.log('save', pC.puzzle)
    }

    const handleAutoResolve = () => {
        pC.resolvePuzzle()
    }

    const saveLocally = () => {
        try {
            localStorage.setItem(LSUserCreatedPuzzle, JSON.stringify({
                steps: pC.steps, width: pC.width, height: pC.height
            }))
        } catch (e) {
            console.error(e)
        }
        console.log(pC.puzzleFulfilled(), pC.preparePuzzleEvaluation())
        if (!pC.puzzleFulfilled() || !pC.preparePuzzleEvaluation()) {
            return
        }
        pC.buildPuzzle()
        puzzlesManager.setUnresolved(pC.puzzle)
    }

    return (
        <div className='dots-puzzle_menu__footer'>

            <button
                className='dots-puzzle_menu__btn'
                type="button"
                onClick={handleClearAll}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>
            <button
                className='dots-puzzle_menu__btn'
                type="button"
                onClick={() => undo()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>

            </button>
            <button
                className='dots-puzzle_menu__btn'
                type="button"
                onClick={() => redo()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                </svg>

            </button>
            <button
                type="button"
                className='dots-puzzle_menu__btn'
                onClick={handleResolveCreated}
            >
            {
                resolveCreated
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>

            }
            </button>
            <button
                type="button"
                className='dots-puzzle_menu__btn'
                onClick={handleAutoResolve}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
            </button>
            <button
                className='dots-puzzle_menu__btn'
                type="button"
                onClick={() => saveLocally()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>

            </button>
            <button
                type="button"
                className='dots-puzzle_menu__btn'
                onClick={() => sharePuzzle()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>

            </button>
        </div>
    )
}

export const CreationPuzzleMenu: React.FC<ICustomPuzzle> =
    (props: ICustomPuzzle) => {
    const {
        color,
        width,
        height,
        level,
        handlers: {
            changeWidth,
            changeHeight,
            selectColor,
        }
    } = props

    return (
        <div className="dots-puzzle_menu">
            <div className='dots-puzzle_menu__dimension'>
                <SizeInput
                    currentValue={width} label='Width'
                    handlers={{changeSize: changeWidth}}
                    max={20}
                />
                <div className='dots-puzzle_menu__level'>Lev:&nbsp;{level || '000'}</div>
                <SizeInput
                    currentValue={height}
                    label='Height'
                    handlers={{changeSize: changeHeight}}
                    max={25}
                />
            </div>
            <div className='dots-puzzle_menu__colors-wrapper'>
                {
                    LineColors.slice(1).map(c => {
                        return <ColorBtn
                            handlers={{selectColor}}
                            color={c}
                            selected={color === c}
                            key={c}
                        />
                    })
                }
            </div>
        </div>

    )
}
