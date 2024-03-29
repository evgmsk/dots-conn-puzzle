import React, { useEffect, useState } from 'react'

import { Puzzle } from '../rect/Rect'
import {IPuzzle, ITPoints, SA} from '../../constant/interfaces'
import { PuzzleSelector } from '../puzzles/PuzzlesMenu'

import { PuzzleResolver as PR } from '../../puzzle-engine/rect-resolver'

import { isDev } from "../../utils/helper-fn";

import { PauseModal } from "../../modals/PauseModal";
import { Congratulations, DefaultColor } from "../../constant/constants";
import { puzzlesManager } from "../../app-services/puzzles-manager";
import { authService } from "../../app-services/auth-service";
import { modeService } from "../../app-services/mode-service";
import { GradeModal } from '../../modals/GradeModal'
import { ShowUP } from "../../app-components/ShowUp";
import { AddsModal } from "../../modals/AddsModal";
import { addsService } from "../../app-services/adds-service";
import {shadowState} from "../../app-services/finger-shadow-state";

let resolver = {getPossibleColors: () => DefaultColor} as unknown as PR

export const PuzzleWrapper: React.FC = () => {
    const [addsShown, setAddsShown] = useState(true)
    const [puzzleGraded, setPuzzleGraded] = useState(true)
    const [puzzle, setPuzzle] = useState(false)

    const pCB = (p: IPuzzle) => {
        setPuzzle(!!p)
    }

    useEffect(() => {
        const sub1 = puzzlesManager.$unresolved.subscribe(pCB)
        const sub2 = addsService.$addsShown.subscribe(setAddsShown)
        const sub3 = puzzlesManager.$graded.subscribe(setPuzzleGraded)
        puzzlesManager.unresolvedPuzzle && console.log(puzzlesManager.unresolvedPuzzle._id)
        return () => {
            sub1(); sub2(); sub3()
        }
    }, [puzzle])
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
    </>
}

export const PuzzleResolver: React.FC<{verify: boolean}> = ({verify = false}) => {
    const {width, height} = puzzlesManager.unresolvedPuzzle || {}
    const [points, setPoints] = useState({} as ITPoints)
    const [mouseDown, setMouseDown] = useState('')
    const [resolved, setResolved] = useState(false)
    // const [lineStartPoint, setLineStartPoint] = useState('')
    const [pause, setPause] = useState(false)
    let timeout = null as unknown as ReturnType<typeof setTimeout>

    useEffect(() => {
        if (!puzzlesManager.unresolvedPuzzle) {
            return console.error(puzzlesManager.unresolvedPuzzle)
        }
        resolver = new PR(puzzlesManager.unresolvedPuzzle)
        puzzlesManager.setResolver(resolver)
        if (resolver.puzzleFulfilled() && resolver.checkIfPuzzleIsResolved().resolved) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timeout = setTimeout(setResolved, 300,true)
        }
        setPoints(resolver.takenPoints)
        console.log('taken points & props', resolver.difficulty, resolver.takenPoints, resolver.lines)
        const sub1 = modeService.$pause.subscribe(setPause)
        const sub2 = resolver.$points.subscribe(setPoints)
        const sub3 = resolver.$resolved.subscribe(setResolved)
        return () => {
            sub2(); sub1(); sub3(); clearTimeout(timeout)
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
    if (!width || !height) {
        return <></>
    }
    const checkLine = (nextPoint: string, prevPoint: string) => {
        const {getLineNeighbors, getPoint} = resolver
        if (!mouseDown
            || prevPoint !== mouseDown
            || (getLineNeighbors(prevPoint).length > 1
                && !getPoint(prevPoint).endpoint)) {
            console.error('line broken', nextPoint, prevPoint, mouseDown, resolver.takenPoints)
            setMouseDown('')
            return false
        }
        return true
    }

    const updateStateOnMouseDown = (key: string, endpoint: boolean) => {
        setMouseDown(key)
        const colors = resolver.getPossibleColors(key)
        shadowState.setColor(colors.length > 1 ? DefaultColor: colors[0])
        if (endpoint) {
            resolver.setLineStartPoint(key)
        } else {
            const line = resolver.getFullLineFromAnyPoint(key, colors[0])
            if (resolver.getPoint(line[0])?.endpoint) {
                resolver.setLineStartPoint(line[0])
            } else {
                resolver.setLineStartPoint(line[line.length - 1])
            }
        }
        return colors
    }

    const handleMouseDown = (key: string) => {
        if (resolved) return

        const {connections, endpoint} = resolver.getPoint(key) || {}
        console.log('handle mouse down', key, connections, endpoint)
        if (!connections) { return }
        const colors = updateStateOnMouseDown(key, endpoint)
        const color = colors.length > 1 ?  DefaultColor : colors[0]
        resolver.resolveMouseDown(key, color)
    }

    const handleMouseEnter = (nextPoint: string, prevPoint: string) => {
        console.warn('handle enter', nextPoint, prevPoint)
        if (resolved || !checkLine(nextPoint, prevPoint) || !resolver.lineStartPoint) { return }
        const {
            resolveMouseEnter,
            getPoint,
            findPathResolver,
            getColorsOfGreyLineStart,
            getPossibleColors,
            lineStartPoint
        } = resolver
        const newColor = resolver.determineColor(lineStartPoint, prevPoint, nextPoint)
        isDev() && console.log('handle enter', newColor, nextPoint, prevPoint, lineStartPoint)
        if (!newColor) return
        let path = [prevPoint]
        const lineConsistent = resolver.rect[prevPoint].neighbors.includes(nextPoint)
        if (!lineConsistent) {
            const colors = newColor === DefaultColor
                ? getColorsOfGreyLineStart(prevPoint)
                : [newColor]
            path = findPathResolver(prevPoint, nextPoint, colors)
            isDev() && console.log('not consistent line, path:', path)
            if (path.length > 1) {
                path = resolvePath(path, prevPoint, newColor)
            }
            isDev() && console.log('not consistent line, path2:', path)
        }
        isDev() && console.log('handle mouse enter', nextPoint, newColor, prevPoint, lineConsistent, path)
        if (!path.length) {
            console.error('no path found', prevPoint, nextPoint, lineStartPoint)
            return
        }
        setMouseDown(nextPoint)
        const color = getPossibleColors(path[path.length - 1]).includes(newColor)
            ? newColor
            : DefaultColor
        resolveMouseEnter(nextPoint, path[path.length - 1], color, newColor)
        if (getPoint(nextPoint)?.joinPoint) {
            resolver.setLineStartPoint(nextPoint)
            shadowState.setColor(DefaultColor)
        }
    }

    const resolvePath = (path: SA, prevPoint: string, newColor: string) => {
        const oldColors = resolver.getPossibleColors(prevPoint)
        const oldColor = oldColors.length > 1 ? DefaultColor : oldColors[0]
        if (new Set(path).size !==  path.length) {
            console.error('invalid path', path)
            return []
        }
        let _path = path
        if (oldColor === DefaultColor && oldColor !== newColor) {
            const restPath = resolver.getFullLineFromAnyPoint(path[0], oldColor)
            if (restPath.length && new Set(restPath).size === restPath.length) {
                _path = restPath.slice(1).reverse().concat(path)
            }
            console.log('rest path', restPath, path, new Set(restPath).size, restPath.length)
        }
        const jp = resolver.makeIntermediateSteps(_path, newColor)
        if (jp) {
            resolver.setLineStartPoint(jp)
            shadowState.setColor(DefaultColor)
        }
        return _path
    }

    const handleMouseUp = () => {
        console.log('up', mouseDown, resolver.lineStartPoint, resolver.getPoint(mouseDown))
        if (!mouseDown || !resolver.getPoint(resolver.lineStartPoint)) return
        resolver.resolveMouseUp(mouseDown, resolver.lineStartPoint)
        setMouseDown('')
        resolver.setLineStartPoint('')
        shadowState.setColor(DefaultColor)
        if (resolver.resolved && !verify) {
            console.log(resolver.puzzleName)
            resolver.puzzleName !== 'admin' && authService.setLevel(resolver.difficulty + 1)
            timeout = setTimeout(setResolved, 300,true)
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

    return (
        <ShowUP className='dots-conn-puzzle_resolver'>
            <Puzzle
                points={points}
                mouseDown={mouseDown}
                dimension={{width, height}}
                handlers={resolvePuzzleHandlers}
                highlightedEndpoints={resolver.highlightedEndpoints}
            />
            {!verify && pause && !resolved
                ? <PauseModal>
                    <p>{'Pause'}</p>
                  </PauseModal>
                : null
            }
        </ShowUP>
    )
}
