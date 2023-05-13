import React, { useEffect, useState } from 'react'

import { Puzzle } from './rect/Rect'
import {IPuzzle, ITakenPointProps, ITakenPoints} from '../constant/interfaces'
import { PuzzleSelector } from './PuzzlesMenu'

import {PuzzleResolver as PR} from '../rect-constructor/rect-resolver'

import {isDev} from "../helper-fns/helper-fn";
import {ResolverTopPanel} from './resolver-components/ResolverTopPanel'
import {ResolverModal} from "./resolver-modals/ResolverModal";
import {Congratulations, DefaultColor} from "../constant/constants";
import {puzzlesManager} from "../puzzles-storage/puzzles-manager";
import {shadowState} from './finger-shadow/finger-shadow-state'
import {pC} from "../rect-constructor/rect-creator";

let resolver = {} as PR

export const PuzzleWrapper: React.FC = () => {
    const [puzzles, setPuzzles] = useState(puzzlesManager.puzzles)
    const [puzzle, setPuzzle] = useState(false)

    const pCB = (p: IPuzzle) => {
        console.log('new', p)
        setPuzzle(!!p)
    }

    useEffect(() => {
        const unsubPuzzles = puzzlesManager.$puzzles.subscribe(setPuzzles)
        const unsubPuzzle = puzzlesManager.$unresolved.subscribe(pCB)
        return () => {
            unsubPuzzles()
            unsubPuzzle()
        }
    }, [])

    const handleChoosingPuzzle = (p: IPuzzle) => {
        puzzlesManager.setUnresolved(p)
    }

    return puzzle
      ? <PuzzleResolver verify={false} />
      : <PuzzleSelector setPuzzle={handleChoosingPuzzle} puzzles={puzzles} />
}

export const PuzzleResolver: React.FC<{verify: boolean}> = ({verify = false}) => {
    const {width, height} = puzzlesManager.unresolvedPuzzle
    const [points, setPoints] = useState({} as ITakenPoints)
    const [color, setColor] = useState('')
    const [mouseDown, setMouseDown] = useState('')
    const [resolved, setResolved] = useState(false)
    const [possibleColors, setPossibleColors] = useState([] as string[])
    // const [newP, setNewP] = useState()
    function setP(p: ITakenPoints) {
        setPoints(p)
    }

    useEffect(() => {
        resolver = new PR(puzzlesManager.unresolvedPuzzle)
        resolver.puzzleFulfilled() && setResolved(resolver.checkIfPuzzleIsResolved().resolved)
        setPoints(resolver.takenPoints)
        console.log('taken points & props', resolver.difficulty, resolver.takenPoints, resolver.lines)
        const unsubPoints = pC.$points.subscribe(setP)
        return unsubPoints()
    }, [puzzlesManager.unresolvedPuzzle])



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
            return setResolved(true)
        }
        for (const point of line) {
            if (resolver.totalPoints[point].crossLine) {
                lineToShow[point] = resolver.updateCrossLinePointToRevealLine(point, color)
            } else {
                lineToShow[point] = resolver.totalPoints[point] as ITakenPointProps
            }
        }
        resolver.addTakenPoints(lineToShow)
        console.log('reveal line', lineToShow, resolver.takenPoints)
        setPoints(resolver.takenPoints)
        if (resolver.puzzleFulfilled()) {
            setResolved(resolver.checkIfPuzzleIsResolved().resolved)
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
        resolver.resolved && setResolved(resolver.resolved)
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
        nextPuzzle: (puzzlesManager.setUnresolved),
    }

    const puzzleClassName = `dots-conn-puzzle_${width}-${height}`
    if (verify) {
        return <Puzzle
                    points={points}
                    mouseDown={mouseDown}
                    dimension={{width, height}}
                    handlers={resolvePuzzleHandlers}
                    mouseColor={color}
                    highlightedEndpoints={resolver.highlightedEndpoints}
                />
    }
    return <div className={puzzleClassName}>
                <ResolverTopPanel
                        handlers={handlers}
                        resolved={resolved}
                        diff={resolver.difficulty || 0}
                />
                {resolved
                    ? <ResolverModal>
                        <p>{Congratulations[Math.floor(Math.random() * Congratulations.length)]}</p>
                    </ResolverModal>
                    : null
                }
                <Puzzle
                    points={points}
                    mouseDown={mouseDown}
                    dimension={{width, height}}
                    handlers={resolvePuzzleHandlers}
                    mouseColor={color}
                    highlightedEndpoints={resolver.highlightedEndpoints}
                />
            </div>
}
