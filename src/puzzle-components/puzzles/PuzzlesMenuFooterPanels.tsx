import React, {useEffect, useRef, useState} from "react"

import {modeService} from "../../app-services/mode-service";
import {puzzlesManager} from "../../app-services/puzzles-manager";
import {authService} from "../../app-services/auth-service";
import {Admin} from "../../constant/constants";
import {IPuzzle, IUser} from "../../constant/interfaces";

import './puzzles-menu-footer-panel.scss'
import {PuzzleFilters} from "./PuzzleFilters";

export interface ITopPanel {
    resolved: boolean
    diff: number | string
}

const PuzzleSelectorMenu = () => {
    const [requestingSystem, setRequestingSystem] = useState(puzzlesManager.requestingSystem)
    const [filters, setFilters] = useState(puzzlesManager.filters)

    useEffect(() => {
        const sub1 = puzzlesManager.$requestSystem.subscribe(setRequestingSystem),
            sub2 = puzzlesManager.$filters.subscribe(setFilters)
        return () => {
            sub1(); sub2();
        }
    }, [])

    const handleFilterOpen = () => {
        puzzlesManager.setFilters()
    }

    const switchToCustom = () => {
        puzzlesManager.setRequestSystem(!puzzlesManager.requestingSystem)
        //TODO change to user.level
    }

    return (
        <>
            {!requestingSystem
                ? <button
                    type='button'
                    className='dots-puzzle_menu__btn puzzle-filters-menu'
                    onClick={handleFilterOpen}
                >
                    {filters ? 'hide filters' : 'show filters'}
                    {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">*/}
                    {/*    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />*/}
                    {/*</svg>*/}
                </button>
                : null
            }
            <button
                type='button'
                className={'dots-puzzle_menu__btn'}
                onClick={switchToCustom}
            >
                {
                    !requestingSystem
                        ? 'game puzzles'
                        : 'users puzzles'
                        // ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        //     <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        // </svg>
                        // : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        //     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        // </svg>
                }
            </button>
        </>
    )
}

const ResolverMenu = () => {
    const [pause, setPause] = useState(false)
    useEffect(() => {
        return modeService.$pause.subscribe(setPause)
    }, [])
    return (
        <>
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
        </>
    )
}

const AdminMenu = () => {
    return (
        <>
            <button
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
        </>
    )
}

export const FooterMenu: React.FC = () => {
    const [puzzle, setPuzzle] = useState(!!puzzlesManager.unresolvedPuzzle)
    const [reqSystem, setReqSystem] = useState(puzzlesManager.requestingSystem)
    const [admin, setAdmin] = useState(authService.user.role === Admin)
    const [filter, setFilter] = useState(puzzlesManager.filters)
    const setUnresolved = (puzzle: IPuzzle) => {
        setPuzzle(!!puzzle)
    }
    const setUAdmin = (user: IUser) => {
        setAdmin(user.role === Admin)
    }
    useEffect(() => {
        const sub1 = puzzlesManager.$requestSystem.subscribe(setReqSystem),
            sub2 = puzzlesManager.$unresolved.subscribe(setUnresolved),
            sub3 = authService.$user.subscribe(setUAdmin),
            sub4 = puzzlesManager.$filters.subscribe(setFilter)
        return  () => {sub1(); sub2(); sub3(); sub4()}
    }, [])

    return (
        <div className={'dots-puzzle-resolver_menu__footer' + (!admin && reqSystem ? ' system' : '')}>
            { filter ? <PuzzleFilters /> : null}
            { admin ? <AdminMenu /> : null }
            { puzzle
                ? <ResolverMenu />
                : <PuzzleSelectorMenu />
            }
        </div>
    )
}
