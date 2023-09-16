import React, {useEffect, useState} from "react"

import './resolver-menu.scss'

import {modeService} from "../../app-services/mode-service";
import {puzzlesManager} from "../../app-services/puzzles-manager";
import {authService} from "../../app-services/auth-service";
import {Admin} from "../../constant/constants";


export interface ITopPanel {
    resolved: boolean
    diff: number | string
}

// export const ResolverMenuPanels: React.FC<ITopPanel> = (props: ITopPanel) => {
//     return (
//         <>
//             <div className="puzzle-resolver-menu_top">
//
//                 <div
//                     className='puzzle-resolver-menu_top-level'
//                 >
//                     level:&nbsp;{props.diff}
//                 </div>
//             </div>
//         </>
//
//     )
// }

export const FooterMenu: React.FC = () => {
    const [pause, setPause] = useState(false)

    useEffect(() => {
        return modeService.$pause.subscribe(setPause)
    }, [])

    return (
        <div className='dots-puzzle-resolver_menu__footer'>
            <button
                className='dots-puzzle_menu__btn'
                type="button"
                onClick={() => modeService.setPause(!modeService.pause)}
            >
                {!pause
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                }
            </button>
            {
                authService.user.role === Admin
                    ? (<><button
                        className='dots-puzzle_menu__btn'
                        title='click to reveal one line'
                        type="button"
                        onClick={() => puzzlesManager.deletePuzzle()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>

                    </button>
                    <button
                        className='dots-puzzle_menu__btn'
                        title='click to reveal one line'
                        type="button"
                        onClick={() => puzzlesManager.updatePuzzle()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>

                    </button>
                    </>)
                    : null
            }

            <button
                className='dots-puzzle_menu__btn'
                title='click to reveal one line'
                type="button"
                onClick={() => puzzlesManager.resolver.revealLine()}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

            </button>
        </div>
    )
}
