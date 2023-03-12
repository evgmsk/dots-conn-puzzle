import React, { useEffect, useState } from 'react'

import { Puzzle } from './rect/rect'
import { IPuzzle, ITakenPoints, LineDirections } from '../constant/interfaces'
import { PuzzleSelector } from './puzzles-menu'
import {manager} from '../puzzles-storage/puzzles-manager'
import {PuzzleResolver as PR} from '../rect-constructor/rect-resolver'
import {CongratulationModal} from "./resolver-modals/congratulation-modal";
import {isDev} from "../helper-fns/helper-fn";
import {ResolverTopPanel} from './resolver-components/resolver-top-panel'


let resolver: PR

export const PuzzleWrapper: React.FC = () => {
    const [puzzles, setPuzzles] = useState(manager.puzzles)
    const [puzzle, setPuzzle] = useState({} as IPuzzle)

    
    useEffect(() => {
        setPuzzles(manager.puzzles)
    }, [])

    return puzzle.name 
      ? <PuzzleResolver puzzle={puzzle} />
      : <PuzzleSelector setPuzzle={setPuzzle} puzzles={puzzles} />
}

export const PuzzleResolver: React.FC<{puzzle: IPuzzle}> = (props: {puzzle: IPuzzle}) => {
    const {width, height} = props.puzzle
    const [points, setPoints] = useState({} as ITakenPoints)
    const [color, setColor] = useState('lightgray')
    const [mouseDown, setMouseDown] = useState('')
    const [resolved, setResolved] = useState(false)


    useEffect(() => {
        resolver = new PR(props.puzzle)
        setResolved(resolver.checkIfPuzzleIsResolved())
        if (resolved) {

        }
        setPoints(resolver.takenPoints)
        console.log('taken points & props', resolver.takenPoints, props)
    }, [props])

    const handleMouseDown = (key: string) => {
        if (resolved) return
        setMouseDown(key)
        const {utmost, connections, crossLine, joinPoint} = resolver.getPoint(key) || {}
        if (!connections) { return }
        const colors = resolver.getColors(connections)
        const newColor = colors.length === 1 ? colors[0] : 'lightgray'
        if (newColor === color && !crossLine) {
            console.log('rm forks', )
            const lineColor = connections[LineDirections.top].color
            const lineNeighbor = resolver.getLineNeighbors(key, lineColor)[0]
            if (utmost && !joinPoint && lineNeighbor) {
                resolver.removeLineFork(lineNeighbor, key, lineColor)
                resolver.updateLastPoint(key, lineNeighbor)
            } else {
                resolver.removeForks(key, lineColor)
            }
            setPoints(resolver.takenPoints)
        }
        color !== newColor && setColor(newColor)
        console.log('down', key, resolver.takenPoints, utmost, connections, color, newColor)
    }

    const revealLine = () => {
        console.log('reveal line')
    }


    const handleMouseEnter = (nextPoint: string, prevPoint: string) => {
        if (resolved) return
        const {
            checkIfCanJoin,
            lineContinuationIsImpossible,
            resolveMouseEnter,
            getLineNeighbors,
            getPoint
        } = resolver
        if (!mouseDown
            || prevPoint !== mouseDown
            || lineContinuationIsImpossible(nextPoint, prevPoint, color)
            || (getLineNeighbors(prevPoint).length > 1
                && !getPoint(prevPoint).utmost)) {
            console.error('line broken', nextPoint, prevPoint, mouseDown, color, resolver.takenPoints)
            setMouseDown('')
            return
        }
        const nextCanBeJoin = checkIfCanJoin(nextPoint, prevPoint, color)
        console.log('enter', nextPoint, prevPoint, color, mouseDown, nextCanBeJoin, resolver.takenPoints)
        if (lineContinuationIsImpossible(nextPoint, prevPoint, color)
            || !nextCanBeJoin) {
            console.error('line broken', nextCanBeJoin,
                lineContinuationIsImpossible(nextPoint, prevPoint, color))
            setMouseDown('')
            return
        }
        setMouseDown(nextPoint)
        resolveMouseEnter(nextPoint, prevPoint, color)
        setPoints(resolver.takenPoints)
    }

    const handleMouseUp = () => {
        setMouseDown('')
        const lineResolved = resolver.checkIfLineIsResolved(color)
        const resolved = resolver.puzzleFilled() && resolver.checkIfPuzzleIsResolved();
        resolved && setResolved(resolved)
        isDev() && console.log('filled: ', resolver.puzzleFilled(),
            'resolved: ', resolved, 'line: ', lineResolved)
    }

    const handleMouseLeave = () => {
        setMouseDown('')
        const lineResolved = resolver.checkIfLineIsResolved(color)
        const resolved = resolver.puzzleFilled()
            && resolver.checkIfPuzzleIsResolved();
        resolved && setResolved(resolved)
        isDev() && console.log('resolved', resolved, lineResolved)
    }

    const resolvePuzzleHandlers = {
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp,
        handleMouseLeave
    }

    const puzzleClassName = `dots-conn-puzzle_${width}-${height}`

    return <div className={puzzleClassName}>
                <ResolverTopPanel handlers={{revealLine}} resolved={resolved} />
                {resolved ? <CongratulationModal message={''} />  : null}
                <Puzzle 
                        points={points}
                        mouseDown={mouseDown}
                        dimension={{width, height}}
                        handlers={resolvePuzzleHandlers}
                        mouseColor={color}
                    />
            </div>
}
