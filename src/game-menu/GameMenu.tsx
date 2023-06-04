/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import {puzzlesManager} from '../app-services/puzzles-manager'
import { IPuzzle } from "../constant/interfaces"
import { modeService } from "../app-services/mode-service";

import './game-menu.scss'

export const GameMenu: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [animate, setAnimate] = useState(false)
    const [filterOpen, setFiltersOpen] = useState()

    let dropdownClass = `menu-dropdown${open ? ' menu-open' : ' menu-hidden'}${animate ? ' show-up' : ''}`

    useEffect(() => {
        const clickOutside = (e: any) => {
            const menu = document.querySelector('.main-menu')
            console.log(e)
            if (!menu?.contains(e.target as Element)) {
                setAnimate(false)
                setOpen(false)
            }
        }
        if (open) {
            if (!animate) {
                setAnimate(true)
            }
            document.addEventListener('mousedown', clickOutside)
            document.addEventListener('touchstart', clickOutside)
        } else {
            setAnimate(false)
            document.removeEventListener('mousedown', clickOutside)
            document.removeEventListener('touchstart', clickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', clickOutside)
            document.removeEventListener('touchstart', clickOutside)
        }
    }, [open])

    const leftEdge = !!puzzlesManager.unresolvedPuzzle || modeService.mode === 'create'
    const menuClass = `dots-puzzle_menu main-menu mode-${modeService.mode}${leftEdge ? ' puzzle-s' : ''}`
    return (
        <div className={menuClass}>
            <button
                type='button'
                className='open-dropdown-btn'
                onClick={() => setOpen(!open)}
            >
                {(!leftEdge && !open) || (leftEdge && open)
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
                    </svg>
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
                    </svg>
                }
            </button>
            <div className={('')}>

            </div>
            <div className={dropdownClass}>
                <button
                    className="dots-puzzle_menu__btn"
                    onClick={() => {}}
                    // disabled={puzzle}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                </button>
                {
                    modeService.mode === 'resolve'
                        ? (
                            <button
                                className="dots-puzzle_menu__btn"
                                onClick={() => modeService.changeMode('create')}
                                // disabled={puzzle}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </button>)
                        : (
                            <button
                                className="dots-puzzle_menu__btn"
                                onClick={() => modeService.changeMode('resolve')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                                </svg>

                            </button>
                        )
                }
            </div>
        </div>
    )
}
