import React, { useEffect, useState } from 'react'

import { Puzzle } from './rect/rect'
import {ICollision, IPuzzle, ITakenPoints, LineDirections} from '../constant/interfaces'
import { PuzzleSelector } from './puzzles-menu'
import {manager} from '../puzzles/puzzles-manager'
import {rr} from '../rect-constructor/rect-resolver'
import {rc as RC} from "../rect-constructor/rect-creator";



export const PuzzleWrapper: React.FC = () => {
    const [puzzles, setPuzzles] = useState(manager.puzzles)
    const [puzzle, setPuzzle] = useState({} as IPuzzle)

    
    useEffect(() => {
        setPuzzles(manager.puzzles)
    }, [])
    useEffect(() => {
        console.log('puzzle', puzzle)
    }, [puzzle])
    return puzzle.name 
      ? <PuzzleResolver puzzle={puzzle} />
      : <PuzzleSelector setPuzzle={setPuzzle} puzzles={puzzles} />
}

export const PuzzleResolver: React.FC<{puzzle: IPuzzle}> = (props: {puzzle: IPuzzle}) => {
    const {width, height, startPoints, dotsSegregatedByColor, name, difficulty} = props.puzzle
    const [points, setPoints] = useState({} as ITakenPoints)
    const [color, setColor] = useState('lightgray')
    const [mouseDown, setMouseDown] = useState('')

    // let entered = ''
    useEffect(() => {
        rr.clearPoints()
        rr.addTakenPoints(startPoints)
        setPoints(rr.takenPoints)
        console.log('taken points & props', rr.takenPoints, props)
    }, [])

    const handleMouseDown = (key: string) => {
        setMouseDown(key)
        const {utmost, connections, crossLine, joinPoint} = rr.getPoint(key) || {}
        if (!connections) { return }
        const colors = rr.getColors(connections)
        const newColor = colors.length === 1 ? colors[0] : 'lightgray'
        if (!utmost) {
            console.log('rm forks')
            const lineColor = connections[LineDirections.top].color
            rr.removeForks(key, lineColor)
            setPoints(rr.takenPoints)
        }
        color !== newColor && setColor(newColor)
        console.log('down', key, rr.takenPoints, utmost, connections, color, newColor)
    }

    const handleMouseEnter = (nextPoint: string, prevPoint: string) => {
        const {
            checkIfCanJoin,
            lineContinuationIsImpossible,
            resolveMouseEnter,
            getLineNeighbors,
            getPoint
        } = rr
        if (!mouseDown
            || prevPoint !== mouseDown
            || lineContinuationIsImpossible(nextPoint, prevPoint, color)
            || (getLineNeighbors(prevPoint).length > 1
                && !getPoint(prevPoint).utmost)) {
            console.error('line broken', nextPoint, prevPoint, mouseDown, color, RC.takenPoints)
            setMouseDown('')
            return
        }
        const nextCanBeJoin = checkIfCanJoin(nextPoint, prevPoint, color)
        console.log('enter', nextPoint, prevPoint, color, mouseDown, nextCanBeJoin, rr.takenPoints)
        if (lineContinuationIsImpossible(nextPoint, prevPoint, color)
            || !nextCanBeJoin) {
            console.error('line broken', nextCanBeJoin
                , lineContinuationIsImpossible(nextPoint, prevPoint, color))
            setMouseDown('')
            return
        }
        setMouseDown(nextPoint)
        resolveMouseEnter(nextPoint, prevPoint, color)
        setPoints(rr.takenPoints)
    }

    const resolvePuzzleHandlers = {
        handleMouseDown,
        handleMouseEnter,
        handleMouseUp: () => {setMouseDown('')},
        handleMouseLeave: () => {setMouseDown('')}
    }

    const puzzleClassName = `dots-conn-puzzle_${width}-${height}`

    return <div className={puzzleClassName}>
                <Puzzle 
                        points={points}
                        mouseDown={mouseDown}
                        dimension={{width, height}}
                        handlers={resolvePuzzleHandlers}
                        mouseColor={color}
                    />
            </div>
}
