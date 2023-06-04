import React, {useEffect, useState} from "react"

import Timer from './Timer'
import {IHandlers} from "../../constant/interfaces";

import './resolver-menu.scss'

import {GameMenu} from "../../game-menu/GameMenu";
import {modeService} from "../../app-services/mode-service";


export interface ITopPanel {
    handlers: IHandlers
    resolved: boolean
    diff: number | string
}

export const ResolverMenuPanels: React.FC<ITopPanel> = (props: ITopPanel) => {
    // const [starting, setStarting] = useState(true)
    //
    // useEffect(() => {
    //    if (props.resolved) {
    //        setStarting(false)
    //    }
    // }, [props.resolved])

    return (
        <>
            <div className="puzzle-resolver-menu_top">
                <Timer />
                <div
                    className='puzzle-resolver-menu_top-level'
                >
                    level:&nbsp;{props.diff}
                </div>
            </div>
        </>

    )
}

export const FooterMenu: React.FC<{handlers: IHandlers}> = ({handlers}) => {
    const [pause, setPause] = useState(false)

    useEffect(() => {
        return modeService.$pause.subscribe(setPause)
    }, [])

    return (
        <div className='dots-puzzle-resolver_menu__footer'>
            <GameMenu />
            <button
                className='dots-puzzle_menu__btn'
                type="button"
                onClick={() => modeService.setPause(!modeService.pause)}
            >
                {!pause
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                }
            </button>
            <button
                className='dots-puzzle_menu__btn'
                title='click to reveal one line'
                type="button"
                onClick={() => handlers.revealLine()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

            </button>
        </div>
    )
}
