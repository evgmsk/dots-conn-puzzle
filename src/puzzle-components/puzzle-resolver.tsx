import React, { useEffect, useState } from 'react'

import { Puzzle } from './rect/rect'
import {IPuzzle, ITakenPointProps, ITakenPoints} from '../constant/interfaces'
import { PuzzleSelector } from './puzzles-menu'
import {manager} from '../puzzles-storage/puzzles-manager'
import {PuzzleResolver as PR} from '../rect-constructor/rect-resolver'
// import {AddsModal} from "./resolver-modals/adds-modal";
import {isDev} from "../helper-fns/helper-fn";
import {ResolverTopPanel} from './resolver-components/resolver-top-panel'
import {ResolverModal} from "./resolver-modals/resolver-modal";
import {Congratulations} from "../constant/constants";

let resolver = {} as PR

export const PuzzleWrapper: React.FC = () => {
    const [puzzles, setPuzzles] = useState(manager.puzzles)
    const [puzzle, setPuzzle] = useState({} as IPuzzle)

    const nextPuzzle = (puzzle = {} as IPuzzle) => {
        setPuzzle(puzzle)
    }
    
    useEffect(() => {
        setPuzzles(manager.puzzles)
    }, [])

    return puzzle.name 
      ? <PuzzleResolver puzzle={puzzle} nextPuzzle={nextPuzzle}/>
      : <PuzzleSelector setPuzzle={setPuzzle} puzzles={puzzles} />
}

export interface IPuzzleResolverProps {
    puzzle: IPuzzle
    nextPuzzle(): void
}

export const PuzzleResolver: React.FC<IPuzzleResolverProps> = (props: IPuzzleResolverProps) => {
    const {width, height} = props.puzzle
    const [points, setPoints] = useState({} as ITakenPoints)
    const [color, setColor] = useState('')
    const [mouseDown, setMouseDown] = useState('')
    const [resolved, setResolved] = useState(false)
    const [possibleColors, setPossibleColors] = useState([] as string[])

    useEffect(() => {
        resolver = new PR(props.puzzle)
        resolver.puzzleFulfilled() && setResolved(resolver.checkIfPuzzleIsResolved())
        setPoints(resolver.takenPoints)
        console.log('taken points & props', resolver.difficulty, resolver.takenPoints, props, resolver.lines)
    }, [props])

    const handleMouseDown = (key: string) => {
        if (resolved) return
        setMouseDown(key)
        const {connections, crossLine, joinPoint} = resolver.getPoint(key) || {}
        if (!connections) { return }
        setPossibleColors(joinPoint || crossLine || [])
        const colors = resolver.getColors(connections)
        const newColor = colors.length === 1 ? colors[0] : 'lightgray'
        resolver.resolveMouseDown(key, newColor)
        setPoints(resolver.takenPoints)
        color !== newColor && setColor(newColor)
    }

    const revealLine = () => {
        let lineToShow = {} as ITakenPoints
        const {line, color} = resolver.getUnresolvedLine()
        if (!line) {
            return setResolved(true)
        }
        for (const point of line) {
            if (resolver.totalPoints[point].crossLine) {
                lineToShow[point] = resolver.updateCrossLineNeighbors(point, color)
            } else {
                lineToShow[point] = resolver.totalPoints[point] as ITakenPointProps
            }
        }
        resolver.addTakenPoints(lineToShow)
        console.log('reveal line', resolver.currentLines, lineToShow, resolver.takenPoints, props)
        setPoints(resolver.takenPoints)
        if (resolver.puzzleFulfilled()) {
            setResolved(resolver.checkIfPuzzleIsResolved())
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
        const newColor = checkLine(nextPoint, prevPoint)
        if (!newColor) { return }
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
        const point = mouseDown
        setMouseDown('')
        resolver.resolveMouseUp(point, color)
        resolver.resolved && setResolved(resolver.resolved)
        isDev() && console.log('filled: ', resolver.puzzleFulfilled(),
            'resolved: ', resolver.resolved, 'line: ', resolver.currentLines[color], color)
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
        nextPuzzle: props.nextPuzzle,
    }

    const puzzleClassName = `dots-conn-puzzle_${width}-${height}`
    return <div className={puzzleClassName}>
                <ResolverTopPanel
                    handlers={handlers}
                    resolved={resolved}
                    diff={resolver.difficulty || 0}
                />
                {resolved ? <ResolverModal>
                    <p>{Congratulations[Math.floor(Math.random() * Congratulations.length)]}</p>
                </ResolverModal>  : null}
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
