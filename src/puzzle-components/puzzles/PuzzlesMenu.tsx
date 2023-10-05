/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from "react";


import { IPuzzle } from "../../constant/interfaces"
import { authService } from "../../app-services/auth-service";
import { getPColor } from "../../utils/helper-fn";
import { puzzlesManager } from '../../app-services/puzzles-manager';
import { ShowUP } from "../../app-components/ShowUp";

import './puzzles-menu.scss'
import {ScrollBars} from "../../app-components/scroll-bar/ScrollBars";

export const PuzzleSelector: React.FC = React.memo(() => {
    const [systemPuzzles, setSystemPuzzles] = useState(puzzlesManager.puzzles as IPuzzle[])
    const [customPuzzles, setCustomPuzzles] = useState(puzzlesManager.customPuzzles)
    const [requestingSystem, setRequestingSystem] = useState(puzzlesManager.requestingSystem)
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
    const Puzzles = () => puzzles
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
    const Spinners = () => (
        <>
            {
                new Array(puzzlesLimit).fill(1)
                    .map((i, j) =>
                        <div key={j} className='loading-spinner_puzzles' />)
            }
        </>
    )
    return (
        <ShowUP className={'animated_puzzles'}>
            <div className={'puzzles-container'} >
                <div className='puzzles-name'>
                    {requestingSystem ? 'game puzzles' : 'users puzzles'}
                </div>
                <ScrollBars container={{elem: puzzlesRef.current as unknown as HTMLElement}}
                            currentScroll={currentScroll}
                >
                    <div className='puzzles-container_puzzle-box' ref={puzzlesRef}>
                        {!loading
                            ? <Puzzles />
                            : <Spinners />
                        }
                    </div>
                </ScrollBars>
            </div>
        </ShowUP>
    )
})
