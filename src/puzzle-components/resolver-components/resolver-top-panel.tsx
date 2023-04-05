import {useEffect, useState} from "react"

import Timer from './timer'
import {IHandlers} from "../../constant/interfaces";

import './resolver-top-panel.scss'
import {ResolverModal} from "../resolver-modals/resolver-modal";

export interface ITopPanel {
    handlers: IHandlers
    resolved: boolean
    diff: number | string
}

export const ResolverTopPanel: React.FC<ITopPanel> = (props: ITopPanel) => {
    const [starting, setStarting] = useState(true)

    useEffect(() => {
       if (props.resolved) {
           setStarting(false)
       }
    }, [props.resolved])

    const pauseHandler = () => {
        if (!props.resolved) {
            return setStarting(starting => !starting)
        }
        return props.handlers.nextPuzzle()
    }
    return (
        <>
            <div className="puzzle-resolver_top-panel-wrapper">
                <Timer starting={starting} />
                <p>level:&nbsp;{props.diff}</p>
                <button
                    className={props.resolved ? 'btn-highlighted' : ''}
                    type="button"
                    onClick={pauseHandler}
                >
                    {starting ? 'Pause' : (!props.resolved ? 'Start' : 'Next Puzzle')}
                </button>
                <button
                    title='click to reveal one line'
                    type="button"
                    onClick={() => props.handlers.revealLine()}
                >
                    Reveal line
                </button>


            </div>
            {!starting && !props.resolved ? <ResolverModal /> : null}
        </>

    )
}
