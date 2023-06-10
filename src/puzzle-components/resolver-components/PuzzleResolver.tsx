import React, { useEffect, useState } from 'react'

import { Puzzle } from '../rect/Rect'
import { IPuzzle, ITakenPointProps, ITakenPoints } from '../../constant/interfaces'
import { PuzzleSelector } from '../PuzzlesMenu'

import { PuzzleResolver as PR } from '../../puzzle-engine/rect-resolver'

import { isDev } from "../../helper-fns/helper-fn";
import { FooterMenu, ResolverMenuPanels } from './ResolverMenuPanels'
import { PauseModal } from "../../modals/PauseModal";
import { Congratulations, DefaultColor } from "../../constant/constants";
import { puzzlesManager } from "../../app-services/puzzles-manager";
import { shadowState } from '../../app-services/finger-shadow-state'
import { authService } from "../../app-services/auth-service";
import { GameMenu } from "../../game-menu/GameMenu";
import { modeService } from "../../app-services/mode-service";
import { GradeModal } from '../../modals/GradeModal'
import { ShowUP } from "../show-up/ShowUp";
import { AddsModal } from "../../modals/AddsModal";
import { addsService } from "../../app-services/adds-service";

let resolver = {} as PR

export const PuzzleWrapper: React.FC = () => {
    const [addsShown, setAddsShown] = useState(true)
    const [puzzleGraded, setPuzzleGraded] = useState(true)
    const [puzzle, setPuzzle] = useState(false)

    const pCB = (p: IPuzzle) => {
        setPuzzle(!!p)
    }

    useEffect(() => {
        return () => {
            puzzlesManager.$unresolved.subscribe(pCB)
            addsService.$addsShown.subscribe(setAddsShown)
            puzzlesManager.$graded.subscribe(setPuzzleGraded)
        }
    }, [])
    if (!puzzleGraded) {
        return (
            <>
                <PuzzleResolver verify={false}/>
                <GradeModal message={'Hi'} />
            </>
        )
    }

    if (!addsShown) {
        const message = Congratulations[Math.floor(Math.random() * Congratulations.length)]
        return <AddsModal message={message} />
    }

    return <>
        {puzzle && addsShown && puzzleGraded
            ? <PuzzleResolver verify={false}/>
            : <PuzzleSelector />
        }
        {!puzzle ? <GameMenu /> : null}
    </>
}

export const PuzzleResolver: React.FC<{verify: boolean}> = ({verify = false}) => {
    const {width, height} = puzzlesManager.unresolvedPuzzle
    const [points, setPoints] = useState({} as ITakenPoints)
    const [color, setColor] = useState('')
    const [mouseDown, setMouseDown] = useState('')
    const [resolved, setResolved] = useState(false)
    const [possibleColors, setPossibleColors] = useState([] as string[])
    const [puzClass, setPuzClass] = useState('dots-conn-puzzle_resolver')
    const [pause, setPause] = useState(false)
    let timeout = null as unknown as ReturnType<typeof setTimeout>

    useEffect(() => {
        resolver = new PR(puzzlesManager.unresolvedPuzzle)
        if (resolver.puzzleFulfilled() && resolver.checkIfPuzzleIsResolved().resolved) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timeout = setTimeout(setResolved, 300,true)
        }

        setPoints(resolver.takenPoints)
        console.log('taken points & props', resolver.difficulty, resolver.takenPoints, resolver.lines)
        setPuzClass('dots-conn-puzzle_resolver show-up')
        return () => {
            modeService.$pause.subscribe(setPause)
            resolver.$points.subscribe(setPoints)
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        if (resolved) {
            if (puzzlesManager.unresolvedPuzzle.name.includes('guwest')
                || puzzlesManager.unresolvedPuzzle.name.includes('admin')) {
                addsService.setAddsShown(false)
                puzzlesManager.setUnresolved()
            } else {
                puzzlesManager.setGraded(false)
            }
            modeService.setPause(true)
        }
    }, [resolved])

    const handleMouseDown = (key: string) => {
        if (resolved) return
        setMouseDown(key)
        const {connections, crossLine, joinPoint} = resolver.getPoint(key) || {}
        if (!connections) { return }
        setPossibleColors(joinPoint || crossLine || [])
        const colors = resolver.getColors(connections)
        const newColor = colors.length === 1 ? colors[0] : DefaultColor
        resolver.resolveMouseDown(key, newColor)
        setPoints(resolver.takenPoints)
        if (color !== newColor) {
            shadowState.setColor(newColor)
            setColor(newColor)
        }
    }

    const revealLine = () => {
        let lineToShow = {} as ITakenPoints
        const {line, color} = resolver.getUnresolvedLine()
        if (!line) {
            timeout = setTimeout(setResolved, 300,true)
            return
        }
        for (const point of line) {
            if (resolver.totalPoints[point].crossLine || resolver.totalPoints[point].joinPoint) {
                lineToShow[point] = resolver.updateCrossLinePointToRevealLine(point, color)
            } else {
                lineToShow[point] = resolver.totalPoints[point] as ITakenPointProps
            }
        }
        resolver.addTakenPoints(lineToShow)
        console.log('reveal line', lineToShow, resolver.takenPoints)
        setPoints(resolver.takenPoints)
        if (resolver.puzzleFulfilled() && resolver.checkIfPuzzleIsResolved().resolved) {
            timeout = setTimeout(setResolved, 300,true)
        }
    }

    const checkLine = (nextPoint: string, prevPoint: string): string => {
        const {getLineNeighbors, getPoint, checkIfCanJoin, lineContinuationIsImpossible} = resolver
        if (!mouseDown
            || prevPoint !== mouseDown
            || (getLineNeighbors(prevPoint).length > 1
                && !getPoint(prevPoint).endpoint)) {
            console.error('line broken', nextPoint, prevPoint, mouseDown, color, resolver.takenPoints)
            setMouseDown('')
            return ''
        }
        const commonColor = !lineContinuationIsImpossible(nextPoint, prevPoint, color)
            && checkIfCanJoin(nextPoint, prevPoint, color, possibleColors)
        if (!commonColor) {
            console.error('line continue impossible', nextPoint, prevPoint, resolver.takenPoints,
                !lineContinuationIsImpossible(nextPoint, prevPoint, color),
            )
            setMouseDown('')
            return ''
        }
        return commonColor
    }

    const handleMouseEnter = (nextPoint: string, prevPoint: string) => {
        if (resolved) { return }
        const newColor = checkLine(nextPoint, prevPoint, )
        if (!newColor) { return }
        isDev() && console.log('handle mouse enter', nextPoint, color, prevPoint)
        const {
            resolveMouseEnter,
            tryContinueLine,
            getLinePartPoints,
            getPoint,
            rect
        } = resolver
        if (!rect[nextPoint].neighbors.includes(prevPoint)) {
            prevPoint = tryContinueLine(nextPoint, prevPoint, color)
            isDev() && console.warn('new prevP', prevPoint)
            const line = getLinePartPoints(color, prevPoint, nextPoint)
            if (!prevPoint || (prevPoint && getPoint(line[line.length - 1]).endpoint)) {
                isDev() && console.error('line without valid start', nextPoint, prevPoint,
                    'prevP: ', prevPoint)
                setMouseDown('')
                return
            }
        }
        setMouseDown(nextPoint)
        resolveMouseEnter(nextPoint, prevPoint, color, newColor)
        setPoints(resolver.takenPoints)
    }

    const handleMouseUp = () => {
        if (!mouseDown || !color || !resolver.getPoint(mouseDown)) return
        resolver.resolveMouseUp(mouseDown, color)
        setMouseDown('')
        if (resolver.resolved && !verify) {
            console.log(resolver.puzzleName)
            resolver.puzzleName === 'admin' && authService.setLevel(resolver.difficulty + 1)
            if (resolver.resolved) {
                timeout = setTimeout(setResolved, 300,true)
            }
        }
        isDev() && console.log('filled: ', resolver.puzzleFulfilled(),
            'resolved: ', resolver.resolved)

    }

    const handleMouseLeave = () => {
        handleMouseUp()
    }

    const resolvePuzzleHandlers = {
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        handleMouseLeave
    }

    const handlers = {
        revealLine,
    }

    if (verify) {
        return (
            <ShowUP>
                <Puzzle
                    points={points}
                    mouseDown={mouseDown}
                    dimension={{width, height}}
                    handlers={resolvePuzzleHandlers}
                    mouseColor={color}
                    highlightedEndpoints={resolver.highlightedEndpoints}
                />
            </ShowUP>
        )
    }

    return (
        <ShowUP>
            <div className={puzClass}>
                <ResolverMenuPanels
                        handlers={handlers}
                        resolved={resolved}
                        diff={resolver.difficulty || 0}
                />
                <Puzzle
                    points={points}
                    mouseDown={mouseDown}
                    dimension={{width, height}}
                    handlers={resolvePuzzleHandlers}
                    mouseColor={color}
                    highlightedEndpoints={resolver.highlightedEndpoints}
                />
                <FooterMenu handlers={handlers} />
                {pause
                    ? <PauseModal>
                        <p>{Congratulations[Math.floor(Math.random() * Congratulations.length)]}</p>
                    </PauseModal>
                    : null
                }
            </div>
        </ShowUP>
    )
}
