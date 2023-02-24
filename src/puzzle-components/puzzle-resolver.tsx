import { useEffect, useState } from 'react'

import { Puzzle } from './rect/rect'
import { ICollision, ILines, IPuzzle, ITakenPoints } from '../constant/interfaces'
import { PuzzleSelector } from './puzzles-menu'
import {manager} from '../puzzles/puzzles-manager'
import {puzzleResolver} from '../rect-constructor/rect-resolver'

export const PuzzleWrapper: React.FC = () => {
    const [puzzles, setPuzzles] = useState(manager.puzzles)
    const [puzzle, setPuzzle] = useState({} as IPuzzle)

    
    useEffect(() => {
        setPuzzles(manager.puzzles)
    }, [])

    return puzzle.name 
      ? <PuzzleResolver
            puzzle={puzzle}
        /> 
      : <PuzzleSelector setPuzzle={setPuzzle} puzzles={puzzles} />
}

export const PuzzleResolver: React.FC<{puzzle: IPuzzle}> = (props: {puzzle: IPuzzle}) => {
    const {width, height, startPoints, dotsSegragatedByColor, name, difficulty} = props.puzzle
    const [points, setPoints] = useState(startPoints)
    const [lines, setLines] = useState({} as ILines)
    const [color, setColor] = useState('lightgray')
    console.warn(props)
    useEffect(() => {
        const stP = {} as ITakenPoints
        for (const key in startPoints) {
            stP[key] = puzzleResolver.cutNeighborsInStartPoints(key, startPoints)
        }
        // console.log()
        puzzleResolver.addTakenPoints(stP)
        setPoints(stP)
    }, [])

    const handleMouseDown = (key: string) => {
        const point = puzzleResolver.getPoint(key)
        
        if (!point || !point.utmost) { return }
        console.warn('down1', key, point, Object.keys(point.connections))
        const colors = Object.keys(point.connections)
        const color = colors.length === 1 ? colors[0] : 'lightgray'
        
        setColor(color)
    }

    const handleMouseEnter = (key: string, key2: string) => {
        console.log('enter', key, key2, puzzleResolver.getPoint(key))
        const existed = puzzleResolver.getPoint(key)
        let interfere = null as unknown as ICollision
        if (existed) {
            const sameColor = !!existed.connections[color]
            if (!sameColor) { return }
            interfere = {
                joinPoint: existed.utmost,
                sameColor,
                sameLine: puzzleResolver.checkIfSameLinePoints(key, key2, color)
            }
        }
        puzzleResolver.resolveMouseEnter(key, key2, color, interfere)
        setPoints(puzzleResolver.takenPoints)
    }

    const checkPoint = (key: string) => {
        return puzzleResolver.getPoint(key)
    }

    const checkLine = (key: string, key2: string) => {
        return puzzleResolver.getPoint(key2) 
            && puzzleResolver.rect[key2].neighbors.includes(key)
    }

    const resolvePuzzleHandlers = {
        handleMouseDown,
        handleMouseEnter,
        checkPoint,
        checkLine
    }

    const puzzleClassName = `dots-conn-puzzle_${width}-${height}`

    return <div className={puzzleClassName}>
                <Puzzle 
                        points={points}
                        dimension={{width, height}}
                        handlers={resolvePuzzleHandlers}
                        mouseColor={color}
                    />
            </div>
}
