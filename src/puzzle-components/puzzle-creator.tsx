import React, { useEffect, useState } from 'react'

import { Puzzle } from './rect/rect'
import {ICollision, ITakenPoints, LineDirections} from '../constant/interfaces'

import { CustomPuzzleMenu } from './menu/custom-puzzle-menu'

import { Height, LineColors, Width } from '../constant/constants'
import { rc as RC } from '../rect-constructor/rect-creator'
import { Confirmation } from './confirmation'
import { manager } from '../puzzles/puzzles-manager'
import {isDev} from "../helper-fns/helper-fn";


export interface IConfirm {
    question: string
    cb: Function
    args: any[]
}

export const PuzzleCreator: React.FC = () => {
    const [width, setWidth] = useState(Width)
    const [height, setHeight] = useState(Height)
    const [color, setColor] = useState(LineColors[0])
    const [confirm, setConfirm] = useState({} as IConfirm)
    const [points, setPoints] = useState({} as ITakenPoints)
    const [mouseDown, setMouseDown] = useState('')

    useEffect(() => {
        RC.setWidth(width)
        RC.setHeight(height)
        isDev() && console.log(points)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const confirmationHandler = (data: boolean) => {
        const {args, cb} = confirm
        setConfirm({} as IConfirm)
        const interfere: ICollision = {
            ...args[confirm.args.length - 1],
            joinPoint: data
        }
        cb(...args.slice(0, -1), interfere)
        setPoints(RC.takenPoints)
    }
    
    const savePuzzle = () => {
        const valid = RC.checkPuzzle()
        if (valid !== 'valid') {
            // TODO resolve errors
            console.error(valid)
            return
        }
        const puzzle = RC.buildPuzzle()
        console.log('save', puzzle)
        manager.savePuzzle(puzzle)
    }

    const undo = () => {
        RC.undo()
        setPoints(RC.takenPoints)
    }

    const clearAll = () => {
        RC.clearAll()
        setPoints(RC.takenPoints)
    }

    const redo = () => {
        RC.redo()
        setPoints(RC.takenPoints)
    }

    const selectColor = (color: string) => {
        console.warn('selected color', color)
        setColor(color)
        
    }

    const handleMouseUp = (key: string) => {
        setMouseDown('')
        const upPoint = RC.getPoint(key)
        if (!upPoint 
            || upPoint.utmost
            || confirm.question
            || RC.getLineNeighbors(key, color).length !== 1
        ) {
            return
        }
        RC.resolveMouseUp(key, color)
        setPoints(RC.takenPoints)
    }

    const handleMouseDown = (key: string) => {
        setMouseDown(key)
        if (confirm.question) return
        const {utmost, connections} = RC.getPoint(key) || {}
        console.warn('down', key, color, RC.takenPoints, connections, utmost)
        if (connections) {
            const sameColor = RC.getColors(key).includes(color)
            console.warn('exist', sameColor, utmost, key)
            if (utmost && !sameColor) {
                setConfirm({
                    question: 'Do you want to change the color',
                    cb: changeColor,
                    args: [key, color, {sameColor}]
                })
            } else if (sameColor) {
                const interfere = {sameColor, joinPoint: utmost}
                RC.resolveMouseDown(key, color, interfere)
            }
        } else {
            RC.resolveMouseDown(key, color)
        }
        setPoints(RC.takenPoints)
    }

    const changeColor = (key: string, color: string) => {
        const colorToReplace = RC.getPoint(key).connections[LineDirections.top].color
        RC.changeLineColor(key, color, colorToReplace)
    }

    const handleMouseEnter = (nextPoint: string, prev: string) => {
        const {
            lineContinuationIsImpossible,
            tryContinueLine,
            getPoint,
            getColors,
            sameUtmostOrSameLine,
            rect,
            resolveMouseEnter,
            checkStartPointUtmost,
            getLineNeighbors
        } = RC
        let prevPoint = prev
        const forkCreating = getLineNeighbors(prevPoint).length > 1
            && !getLineNeighbors(prevPoint).includes(nextPoint)
            && !getPoint(prevPoint).utmost

        if (!mouseDown
            || prevPoint !== mouseDown
            || confirm.question
            || lineContinuationIsImpossible(nextPoint, prevPoint, color)
            || forkCreating) {
            isDev() && console.error('line broken', nextPoint, prevPoint, mouseDown, confirm, color, RC.takenPoints)
            setMouseDown('')
            return
        }
        console.log('enter', nextPoint, prev, mouseDown)
        if (!rect[nextPoint].neighbors.includes(prevPoint)) {
            prevPoint = tryContinueLine(nextPoint, prevPoint, color)
            isDev() && console.warn('new prevP', prevPoint)
            if (!prevPoint || (prevPoint && !checkStartPointUtmost(prevPoint, nextPoint))) {
                isDev() && console.error('line without utmost', nextPoint, prev, RC.takenPoints,
                    'prevP: ', prevPoint)
                setMouseDown('')
                return
            }
        }
        setMouseDown(nextPoint)
        const existed = getPoint(nextPoint)

        if (existed) {
            const {utmost} = existed
            const sameColor = getColors(nextPoint).includes(color)
            console.warn('exist', nextPoint, prevPoint, existed, sameColor)
            if (!sameColor) {
                setConfirm({
                    question: 'Do you want to create join point',
                    cb: resolveMouseEnter,
                    args: [nextPoint, prevPoint, color, {sameColor}]
                })
            } else if (sameColor) {
                const sameLine = sameUtmostOrSameLine(nextPoint, prevPoint, color)
                const joinPoint = utmost && !sameLine
                let interfere = {joinPoint, sameLine, sameColor} as ICollision
                resolveMouseEnter(nextPoint, prevPoint, color, interfere)
            } 
        } else { 
            resolveMouseEnter(nextPoint, prevPoint, color)
        }
        setPoints(RC.takenPoints)
    }
 
    const customPuzzleHandlers = {
        handleMouseDown,
        handleMouseUp,
        handleMouseEnter,
        handleMouseLeave: () => { setMouseDown('') }
    }

    const changeWidth = (width: string) => {
        const newWidth = parseInt(width)
        setWidth(newWidth)
        RC.setWidth(newWidth)
    }

    const changeHeight = (height: string) => {
        const newHeight = parseInt(height)
        setHeight(newHeight)
        RC.setHeight(newHeight)
    }

    const customPuzzleMenuHandlers = {
        selectColor,
        clearAll,
        undo,
        changeWidth,
        changeHeight,
        redo,
        savePuzzle
    }

    return (
        <div className='dots-conn-puzzle_creator'>
            <CustomPuzzleMenu
                handlers={customPuzzleMenuHandlers}
                color={color}
                width={width}
                height={height}
            />
            <Puzzle
                mouseDown={mouseDown}
                points={points}
                dimension={{width, height}}
                handlers={customPuzzleHandlers}
                mouseColor={color}
            />
            <Confirmation
                handler={confirmationHandler}
                question={confirm.question}
            />

        </div>
    )
}
