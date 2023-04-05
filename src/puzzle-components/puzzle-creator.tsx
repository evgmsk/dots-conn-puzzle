import React, { useEffect, useState } from 'react'

import { Puzzle } from './rect/rect'
import {ICollision, ITakenPointProps, ITakenPoints, LineDirections} from '../constant/interfaces'

import { CustomPuzzleMenu } from './menu/custom-puzzle-menu'

import { Height, LineColors, Width } from '../constant/constants'
import { pC } from '../rect-constructor/rect-creator'
import { CreatorConfirmationModal } from './creator-modals/creator-confirmation-modal'
import { manager } from '../puzzles-storage/puzzles-manager'
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
    const [level, setLevel] = useState(0)

    useEffect(() => {
        pC.setWidth(width)
        pC.setHeight(height)
        // isDev() && console.log(points)
        return pC.clearAll()
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
        setPoints(pC.takenPoints)
    }
    
    const savePuzzle = () => {
        console.log('save', pC.puzzle)
        if (pC.puzzle) return manager.savePuzzle(pC.puzzle)
        // const valid = pC.checkPuzzle()
        // if (valid !== 'valid') {
        //     // TODO resolve errors
        //     console.error(valid)
        //     return
        // }
        // const puzzle = pC.buildPuzzle()
        console.log('save', pC.puzzle)
        // puzzle && manager.savePuzzle(puzzle)
    }

    const undo = () => {
        pC.undo()
        setPoints(pC.takenPoints)
    }

    const clearAll = () => {
        pC.clearAll()
        setPoints(pC.takenPoints)
    }

    const redo = () => {
        pC.redo()
        setPoints(pC.takenPoints)
    }

    const selectColor = (color: string) => {
        console.warn('selected color', color)
        setColor(color)
        
    }

    const handleMouseUp = (key: string) => {
        setMouseDown('')
        const upPoint = pC.getPoint(key)
        if (!upPoint 
            || upPoint.endpoint
            || confirm.question
            || pC.getLineNeighbors(key, color).length !== 1
        ) {
            return
        }
        pC.resolveMouseUp(key, color)
        setPoints(pC.takenPoints)
        pC.puzzle.difficulty && setLevel(pC.puzzle.difficulty)
        console.log('valid', level, pC.puzzle)
    }

    const handleMouseDown = (key: string) => {
        setMouseDown(key)
        if (confirm.question) return
        const {endpoint, connections} = pC.getPoint(key) || {}
        console.warn('down', key, color, pC.takenPoints, connections, endpoint)
        if (connections) {
            const sameColor = pC.getColors(key).includes(color)
            console.warn('exist', sameColor, endpoint, key)
            if (endpoint && !sameColor) {
                setConfirm({
                    question: 'Do you want to change the color',
                    cb: changeColor,
                    args: [key, color, {sameColor}]
                })
            } else if (sameColor) {
                const interfere = {sameColor, joinPoint: endpoint}
                pC.resolveMouseDown(key, color, interfere)
            }
        } else {
            pC.resolveMouseDown(key, color)
        }
        setPoints(pC.takenPoints)
    }

    const changeColor = (key: string, newColor: string, interfere: ICollision) => {
        if (interfere && !interfere.joinPoint) return
        const oldColor = pC.getPoint(key).connections[LineDirections.top].color
        pC.changeLineColor(key, newColor, oldColor)
        console.warn('change color', key, newColor, oldColor)
    }

    const handleMouseEnter = (nextPoint: string, prev: string) => {
        const {
            lineContinuationIsImpossible,
            tryContinueLine,
            getPoint,
            rect,
            resolveMouseEnter,
            getLinePartPoints,
            getLineNeighbors
        } = pC
        let prevPoint = prev
        const forkCreating = getLineNeighbors(prevPoint).length > 1
            && !getLineNeighbors(prevPoint).includes(nextPoint)
            && !getPoint(prevPoint).endpoint
        if (!mouseDown
            || prevPoint !== mouseDown
            || confirm.question
            || lineContinuationIsImpossible(nextPoint, prevPoint, color)
            || forkCreating) {
            isDev() && console.error('line broken', nextPoint, prevPoint, mouseDown, confirm, color, pC.takenPoints)
            setMouseDown('')
            return
        }
        console.log('enter', nextPoint, prev, mouseDown)
        if (!rect[nextPoint].neighbors.includes(prevPoint)) {
            prevPoint = tryContinueLine(nextPoint, prevPoint, color)
            isDev() && console.warn('new prevP', prevPoint)
            const line =  getLinePartPoints(color, prevPoint, nextPoint)
            if (!prevPoint || (prevPoint && !getPoint(line[line.length - 1]).endpoint)) {
                isDev() && console.error('line without endpoint', nextPoint, prev, pC.takenPoints,
                    'prevP: ', prevPoint)
                setMouseDown('')
                return
            }
        }
        setMouseDown(nextPoint)
        const existed = getPoint(nextPoint)

        if (existed) {
            resolveMouseEnterIfNextPointExist(existed, nextPoint, prevPoint)
        } else { 
            resolveMouseEnter(nextPoint, prevPoint, color)
        }
        setPoints(pC.takenPoints)
    }

    const resolveMouseEnterIfNextPointExist = (
        existed: ITakenPointProps,
        nextPoint: string,
        prevPoint: string) => {
        const {endpoint} = existed
        const sameColor = pC.getColors(nextPoint).includes(color)
        console.warn('exist', nextPoint, prevPoint, existed, sameColor)
        if (!sameColor) {
            setConfirm({
                question: 'Do you want to create join point',
                cb: pC.resolveMouseEnter,
                args: [nextPoint, prevPoint, color, {sameColor}]
            })
        } else if (sameColor) {
            const sameLine = pC.sameEndpointOrSameLine(nextPoint, prevPoint, color)
            const joinPoint = endpoint && !sameLine
            let interfere = {joinPoint, sameLine, sameColor} as ICollision
            pC.resolveMouseEnter(nextPoint, prevPoint, color, interfere)
        }
    }

    const handleMouseLeave = () => {
        setMouseDown('')
        pC.resolveMouseUp(mouseDown, color)
    }


    const customPuzzleHandlers = {
        handleMouseDown,
        handleMouseUp,
        handleMouseEnter,
        handleMouseLeave,
    }

    const changeWidth = (width: string) => {
        const newWidth = parseInt(width)
        if (newWidth > 20) {return}
        setWidth(newWidth)
        pC.setWidth(newWidth)
    }

    const changeHeight = (height: string) => {
        const newHeight = parseInt(height)
        if (newHeight > 25) {return}
        setHeight(newHeight)
        pC.setHeight(newHeight)
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
                level={level}
            />
            <Puzzle
                mouseDown={mouseDown}
                points={points}
                dimension={{width, height}}
                handlers={customPuzzleHandlers}
                mouseColor={color}
            />
            <CreatorConfirmationModal
                handler={confirmationHandler}
                question={confirm.question}
            />

        </div>
    )
}
