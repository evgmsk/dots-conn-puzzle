import {useEffect, useState} from "react"

import Timer from './timer'
import {IHandlers} from "../../constant/interfaces";

import './resolver-top-panel.scss'

export interface ITopPanel {
    handlers: IHandlers
    resolved: boolean
}

export const ResolverTopPanel: React.FC<ITopPanel> = (props: ITopPanel) => {
    const [starting, setStarting] = useState(true)

    useEffect(() => {
       if (props.resolved) {
           setStarting(false)
       }
    }, [props.resolved])

    return (
        <div>
            <Timer starting={starting} />
            <button
                type="button"
                onClick={() => setStarting(starting => !starting)}
            >
                {starting ? 'Pause' : 'Start'}
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
