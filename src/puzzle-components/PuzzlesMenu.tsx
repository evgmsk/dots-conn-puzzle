/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from "react";


import { IPuzzle } from "../constant/interfaces"
import { authService } from "../app-services/auth-service";
import { getPColor } from "../utils/helper-fn";
import { puzzlesManager } from '../app-services/puzzles-manager';
import { ShowUP } from "../app-components/ShowUp";
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

    if (!Array.isArray(systemPuzzles)) {
        return <>'Oops something wrong! We'll fix it in a few minutes'</>
    }
    const userLev = authService.user.level !== undefined ? authService.user.level : 0
    const puzzles = (!requestingSystem ? customPuzzles : systemPuzzles)
    // const numberOfRows = puzzles.length % 5 ? Math.trunc(puzzles.length / 5) + 1 : puzzles.length / 5
    console.log('puzzles', puzzles)
    return (
        <ShowUP className={' animated_puzzles' + (filterOpen ? ' filter-open' : '')}>
            <ScrollBars container={puzzlesRef.current as unknown as HTMLElement}>
                <div className={'puzzles-container' + (filterOpen ? ' filter-open' : '')} >
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
                </div>
            </ScrollBars>
        </ShowUP>
    )
})
