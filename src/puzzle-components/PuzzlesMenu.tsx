/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from "react";


import { IPuzzle } from "../constant/interfaces"
import { authService } from "../app-services/auth-service";
import { getPColor } from "../utils/helper-fn";
import { puzzlesManager } from '../app-services/puzzles-manager';
import { ShowUP } from "./show-up/ShowUp";
import { PuzzleFilters } from "./PuzzleFilters";

import './puzzles-menu.scss'
import {ScrollBars, ScrollBar} from "./scroll-bar/ScrollBars";

export const PuzzleSelector: React.FC = React.memo(() => {
    const [systemPuzzles, setSystemPuzzles] = useState(puzzlesManager.puzzles as IPuzzle[])
    const [customPuzzles, setCustomPuzzles] = useState(puzzlesManager.customPuzzles)
    const [requestingSystem, setRequestingSystem] = useState(puzzlesManager.requestingSystem)
    const [filterOpen, setFiltersOpen] = useState(false)
    const [loading, setLoading] = useState(puzzlesManager.loading)
    const [currentScroll, setCurrentScroll] = useState(0)
    const puzzlesRef = useRef(null)
    let puzzlesLimit = 25

    useEffect(() => {
        const scrollDown = () => {
            const elem = puzzlesRef.current as unknown as HTMLElement
            if (!elem
                || (requestingSystem && puzzles.length < 25)
                || (!requestingSystem && customPuzzles.length < 25)
            ) return
            if (!loading && currentScroll < 1) setCurrentScroll(1)
        }
        scrollDown()
    }, [loading])
    // console.log(systemPuzzles)
    const handleFilterOpen = () => {
        setFiltersOpen(!filterOpen)
    }

    const handleLoading = (_loading: boolean) => {
        if (_loading) setLoading(_loading)
        else setTimeout(setLoading, 300, _loading)
    }

    useEffect(() => {
        const sub1 = puzzlesManager.$requestSystem.subscribe(setRequestingSystem)
        const sub2 = puzzlesManager.$puzzles.subscribe(setSystemPuzzles)
        const sub3 = puzzlesManager.$customPuzzles.subscribe(setCustomPuzzles)
        const sub4 = puzzlesManager.$loading.subscribe(handleLoading)
        return () => {
            sub1(); sub2(); sub3(); sub4()
        }
    }, [])

    const switchToCustom = () => {
        console.log('switch system')
        puzzlesManager.setRequestSystem(!puzzlesManager.requestingSystem)
        setCurrentScroll(0) //TODO change to user.level
    }

    if (!Array.isArray(systemPuzzles)) {
        return <>'Oops something wrong! We'll fix it in a few minutes'</>
    }
    const userLev = authService.user.level !== undefined ? authService.user.level : 0
    const puzzles = (!requestingSystem ? customPuzzles : systemPuzzles)
    const numberOfRows = puzzles.length % 5 ? Math.trunc(puzzles.length / 5) + 1 : puzzles.length / 5
    // console.log(numberOfRows)
    return (
        <ShowUP className={' animated_puzzles' + (filterOpen ? ' filter-open' : '')}>
            {
                filterOpen
                    ? <PuzzleFilters close={handleFilterOpen} />
                    : null
            }
            <ScrollBars container={puzzlesRef.current as unknown as HTMLElement}>
            <div className={'puzzles-container' + (filterOpen ? ' filter-open' : '')} >
                {!requestingSystem
                    ? <button
                            type='button'
                            className='dots-puzzle_menu__btn puzzle-filters-menu'
                            onClick={handleFilterOpen}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    : null
                }
                <button
                    type='button'
                    className='dots-puzzle_menu__btn'
                    onClick={switchToCustom}
                >
                    {
                        !requestingSystem
                            ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                            </svg>
                    }
                </button>

                <div className='puzzles-container_puzzle-box' ref={puzzlesRef}>
                    {
                        !loading
                            ? puzzles
                                .sort((a: IPuzzle, b: IPuzzle) => a.difficulty - b.difficulty)
                                .map((p: IPuzzle, i: number) => {
                                    const diff = p.difficulty
                                    const curLev = userLev === diff ? ' cur-level' : ''
                                    const btnCl = `puzzle-btn${curLev} col-${getPColor(diff)}`
                                    return <ShowUP
                                                key={i + (p.createdAt || Math.floor(Math.random() * 10000000))}
                                            >
                                                <button
                                                    className={btnCl}
                                                    type="button"
                                                    onClick={() => puzzlesManager.setUnresolved(puzzles[i])}
                                                        >
                                                    {diff}
                                                </button>
                                            </ShowUP>
                                })
                            : <>
                                {
                                    new Array(puzzlesLimit).fill(1)
                                        .map((i, j) =>
                                            <div key={j} className='loading-spinner_puzzles' />)
                                }
                            </>
                    }

                </div>
                {/*{*/}
                {/*    puzzles.length > puzzlesLimit*/}
                {/*        ? <ScrollBars*/}
                {/*            numberOfRows={numberOfRows}*/}
                {/*            container={puzzlesRef.current as unknown as HTMLElement}*/}
                {/*            currentScroll={currentScroll}*/}
                {/*        />*/}
                {/*        : null*/}
                {/*}*/}
            </div>
            </ScrollBars>
        </ShowUP>
    )
})
