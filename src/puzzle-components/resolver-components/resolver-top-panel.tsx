import {useEffect, useState} from "react"

import Timer from './timer'
import {IHandlers} from "../../constant/interfaces";

import './resolver-top-panel.scss'

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

    return (
        <div className="puzzle-resolver_top-panel-wrapper">
            <Timer starting={starting} />
            <p>level:&nbsp;{props.diff}</p>
            <button
                type="button"
                onClick={() => setStarting(starting => !starting)}
            >
                {starting ? 'Pause' : (!props.resolved ? 'Start' : 'Next Puzzle')}
            </button>
            <button
                title='need a help'
                type="button"
                onClick={() => props.handlers.revealLine()}
            >
                Reveal line
            </button>
        </div>
    )
}
