/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";

import { IPuzzle } from "../constant/interfaces"
import {authService} from "../app-services/auth-service";
import {getPColor} from "../helper-fns/helper-fn";
import { puzzlesManager } from '../app-services/puzzles-manager'

import './puzzles-menu.scss'
import {ShowUP} from "./show-up/ShowUp";


export const PuzzleSelector: React.FC = () => {
    const [systemPuzzles, setSystemPuzzles] = useState(puzzlesManager.puzzles as IPuzzle[])
    const [customPuzzles, setCustomPuzzles] = useState(puzzlesManager.customPuzzles)
    const [customs, setCustoms] = useState(false)

    useEffect(() => {
        return () => {
            puzzlesManager.$puzzles.subscribe(setSystemPuzzles)
            puzzlesManager.$customPuzzles.subscribe(setCustomPuzzles)
        }
    }, [])

    if (!Array.isArray(systemPuzzles)) {
        return <>'Oops something wrong! We'll fix it in a few minutes'</>
    }
    const uL = 3 || authService.user.level || 1
    return (
        <ShowUP>
        <div className='puzzles-container'>
            <button
                type='button'
                className='dots-puzzle_menu__btn puzzle-filters-menu'
                onClick={() => {}}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
            <button
                type='button'
                className='dots-puzzle_menu__btn'
                onClick={() => setCustoms(!customs)}
            >
                {
                    customs
                        ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                }
            </button>
            {
                (customs ? customPuzzles : systemPuzzles)
                    .sort((a: IPuzzle, b: IPuzzle) => a.difficulty - b.difficulty)
                    .map((p: IPuzzle, i: number) => {
                        const diff = p.difficulty
                        const btnCl = `puzzle-btn${uL === diff ? ' cur-level' : ''} col-${getPColor(diff)}`
                        return <button
                            className={btnCl}
                            type="button"
                            key={i + p.creator}
                            onClick={() => puzzlesManager.setUnresolved(systemPuzzles[i])}
                        >
                            {diff}
                        </button>
                    })
            }
        </div>
        </ShowUP>
    )
}
