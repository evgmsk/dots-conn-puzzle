import React, { useEffect, useState } from 'react'

import { Puzzle } from '../rect/Rect'
import { PuzzleResolver } from '../resolver-components/PuzzleResolver'
import { ICollision, IPuzzle, ITakenPProps, ITPoints } from '../../constant/interfaces'

import { CreationPuzzleMenu } from './CreationPuzzleMenu'

import { pC } from '../../puzzle-engine/rect-creator'
import { CreationConfirmModal } from '../../modals/creator-modals/CreationConfirmModal'
import { isDev } from "../../utils/helper-fn";
import { puzzlesManager } from "../../app-services/puzzles-manager";
import { shadowState } from "../../app-services/finger-shadow-state";
import {ShowUP} from "../../app-components/ShowUp";
import {LSUserCreatedPuzzle} from "../../constant/constants";


export interface IConfirm {
    question: string
    cb: Function
    args: any[]
}

const PuzzleCreator: React.FC = () => {
    const [width, setWidth] = useState(pC.width)
    const [height, setHeight] = useState(pC.height)
    const [color, setColor] = useState(shadowState.color)
    const [confirm, setConfirm] = useState({} as IConfirm)
    const [points, setPoints] = useState({} as ITPoints)
    const [mouseDown, setMouseDown] = useState('')
    const [resolverView, setResolverView] = useState(false)
    useEffect(() => {
        const unsubWidth = pC.$width.subscribe(setWidth)
        const unsubHeight = pC.$height.subscribe(setHeight)
        const unsubColor = shadowState.$color.subscribe(setColor)
        const unsubPoints = pC.$points.subscribe(setPoints)
        const unsubResCreated = puzzlesManager.$resolveCreated.subscribe(setResolverView)
        const {steps, width, height} = JSON.parse(localStorage.getItem(LSUserCreatedPuzzle) || '{}')
        if (steps) {
            pC.setDimension({height, width})
            console.log('old puzzle', height, width)
            pC.addTakenPoints(steps[steps.length - 1])
            pC.steps = steps
        }
        // isDev() && console.log(points)
        return () => {
            unsubWidth()
            unsubColor()
            unsubHeight()
            unsubPoints()
            unsubResCreated()
            clearAll()
        }
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

    const clearAll = () => {
        pC.clearAll()
        puzzlesManager.setUnresolved(null as unknown as IPuzzle)
    }

    const selectColor = (color: string) => {
        console.warn('selected color', color)
        shadowState.setColor(color)
    }

    const handleMouseUp = (key: string = mouseDown) => {
        setMouseDown('')
        const upPoint = pC.getPoint(key)
        isDev() && console.log('handle up', upPoint, confirm.question)
        if (!upPoint
            || confirm.question
        ) {
            return
        }
        pC.resolveMouseUp(key, color)
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
        const {endpoint, connections} = pC.getPoint(prevPoint) || {}
        if (existed
            && pC.getColors(existed.connections).length === 1
            && pC.getLineNeighbors(connections).length > 0
            && endpoint
            &&  pC.getColors(connections)?.length === 1) {
            return
        }
        if (existed) {
            resolveMouseEnterIfNextPointExist(existed, nextPoint, prevPoint)
        } else {
            pC.resolveMouseEnter(nextPoint, prevPoint, color)
        }
    }

    const resolveMouseEnterIfNextPointExist = (
        existed: ITakenPProps,
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
            console.warn('same line', sameLine, nextPoint, prevPoint)
            const joinPoint = endpoint && !sameLine
            let interfere = {joinPoint, sameLine, sameColor} as ICollision
            pC.resolveMouseEnter(nextPoint, prevPoint, color, interfere)
        }
    }

    const handleMouseLeave = () => {
        setMouseDown('')
        if (confirm.question) {
            return
        }
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
        pC.setWidth(newWidth)
        clearAll()
    }

    const changeHeight = (height: string) => {
        const newHeight = parseInt(height)
        if (newHeight > 25) {return}
        pC.setHeight(newHeight)
        clearAll()
    }

    const customPuzzleMenuHandlers = {
        selectColor,
        changeWidth,
        changeHeight,
    }

    // console.log(resolverView)
    return (
        <ShowUP className='dots-conn-puzzle_creator'>
        {/*<div >*/}
            <CreationPuzzleMenu
                handlers={customPuzzleMenuHandlers}
                color={color}
                width={width}
                height={height}
                level={pC.puzzle?.difficulty}
            />
            {
                resolverView && puzzlesManager.unresolvedPuzzle
                    ? <PuzzleResolver verify={true} />
                    : <Puzzle
                        mouseDown={mouseDown}
                        points={points}
                        dimension={{width, height}}
                        handlers={customPuzzleHandlers}
                        mouseColor={color}
                      />
            }
            <CreationConfirmModal
                handler={confirmationHandler}
                question={confirm.question}
            />
        </ShowUP>
    )
}

export default PuzzleCreator
