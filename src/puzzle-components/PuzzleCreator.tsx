import React, { useEffect, useState } from 'react'

import { Puzzle } from './rect/Rect'
import {PuzzleResolver} from './PuzzleResolver'
import {ICollision, IPuzzle, ITakenPointProps, ITakenPoints} from '../constant/interfaces'

import { CreationPuzzleMenu, ManagerMenu } from './menu/CreationPuzzleMenu'

import { Height, LineColors, Width } from '../constant/constants'
import { pC } from '../rect-constructor/rect-creator'
import { CreationConfirmModal } from './creator-modals/CreationConfirmModal'
import {isDev} from "../helper-fns/helper-fn";
import {puzzlesManager} from "../puzzles-storage/puzzles-manager";


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
    const [resolverView, setResolverView] = useState(false)

    useEffect(() => {
        pC.setWidth(width)
        pC.setHeight(height)
        // isDev() && console.log(points)
        const unsubPoints = pC.$points.subscribe(setPoints)
        return () => {
            unsubPoints()
            clearAll()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const confirmationHandler = (data: boolean) => {
        const {args, cb} = confirm
        const interfere: ICollision = {
            ...args[confirm.args.length - 1],
            joinPoint: data
        }
        console.log(data, cb, args)
        cb(...args.slice(0, -1), interfere)
        setConfirm({} as IConfirm)
    }
    
    const savePuzzleHandler = () => {
        console.log('save', pC.puzzle)
        if (pC.puzzle) return puzzlesManager.handleSavePuzzle(pC.puzzle)
        // const valid = pC.checkPuzzle()
        // if (valid !== 'valid') {
        //     // TODO resolve errors
        //     console.error(valid)
        //     return
        // }
        // const puzzle = pC.buildPuzzle()
        console.log('save', pC.puzzle)
    }

    const undo = () => {
        pC.undo()
        setPoints(pC.takenPoints)
    }

    const clearAll = () => {
        pC.clearAll()
        puzzlesManager.setUnresolved({} as IPuzzle)
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
        isDev() && console.log('handle up', upPoint, confirm.question)
        if (!upPoint
            || confirm.question
        ) {
            return
        }
        pC.resolveMouseUp(key, color)
        setPoints(pC.takenPoints)
    }

    const handleMouseDown = (key: string) => {
        setMouseDown(key)
        if (confirm.question) return
        const {endpoint, connections} = pC.getPoint(key) || {}
        isDev() && console.warn('down', key, color, pC.takenPoints, connections, endpoint)
        if (connections) {
            const sameColor = pC.getColors(key).includes(color)
            isDev() && console.warn('exist', sameColor, endpoint, key)
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
        const colors = pC.getColors(key)
        if ((interfere && !interfere.joinPoint) || colors.length > 1) return
        const oldColor = colors[0]
        pC.changeLineColor(key, newColor, oldColor)
        console.warn('change color', key, newColor, oldColor)
    }

    const handleMouseEnter = (nextPoint: string, prev: string) => {
        let prevPoint = prev
        const forkCreating = pC.getLineNeighbors(prevPoint).length > 1
            && !pC.getLineNeighbors(prevPoint).includes(nextPoint)
            && !pC.getPoint(prevPoint).endpoint
        if (!mouseDown
            || prevPoint !== mouseDown
            || confirm.question
            || pC.lineContinuationIsImpossible(nextPoint, prevPoint, color)
            || forkCreating) {
            isDev() && console.error('line broken', nextPoint, prevPoint, mouseDown, confirm, color, pC.takenPoints)
            setMouseDown('')
            return
        }
        console.log('enter', nextPoint, prev, mouseDown)
        if (!pC.rect[nextPoint].neighbors.includes(prevPoint)) {
            prevPoint = pC.tryContinueLine(nextPoint, prevPoint, color)
            isDev() && console.warn('new prevP', prevPoint)
            const line =  pC.getLinePartPoints(color, prevPoint, nextPoint)
            if (!prevPoint || (prevPoint && !pC.getPoint(line[line.length - 1]).endpoint)) {
                isDev() && console.error('line without endpoint', nextPoint, prev, pC.takenPoints,
                    'prevP: ', prevPoint)
                setMouseDown('')
                return
            }
        }
        setMouseDown(nextPoint)
        const existed = pC.getPoint(nextPoint)

        if (existed) {
            resolveMouseEnterIfNextPointExist(existed, nextPoint, prevPoint)
        } else { 
            pC.resolveMouseEnter(nextPoint, prevPoint, color)
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
            const sameLine = pC.checkIfPointsBelongToSameLine(nextPoint, prevPoint, color)
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
        changeWidth,
        changeHeight,
    }

    const ManagerHandlers = {
        redo,
        sharePuzzle: savePuzzleHandler,
        clearAll,
        undo,
        setResolverView
    }

    return (
        <div className='dots-conn-puzzle_creator'>
            <CreationPuzzleMenu
                handlers={customPuzzleMenuHandlers}
                color={color}
                width={width}
                height={height}
                level={pC.puzzle?.difficulty}
            />
            {
                resolverView && puzzlesManager.unresolvedPuzzle?.points
                    ? <PuzzleResolver verify={true} />
                    : <Puzzle
                        mouseDown={mouseDown}
                        points={points}
                        dimension={{width, height}}
                        handlers={customPuzzleHandlers}
                        mouseColor={color}
                    />
            }
            <ManagerMenu handlers={ManagerHandlers} view={resolverView}/>
            <CreationConfirmModal
                handler={confirmationHandler}
                question={confirm.question}
            />

        </div>
    )
}
