import { useEffect, useState } from 'react'

import { Puzzle } from './rect/rect'
import { ICollision, IUpContext } from '../constant/interfaces'

import { CustomPuzzleMenu } from './menu/custom-puzzle-menu'

import { Height, LineColors, Width } from '../constant/constants'
import { rectCreator } from '../rect-constructor/rect-creator'
import { Confirmation } from './confirmation'
import { manager } from '../puzzles/puzzles-manager'


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
    const [points, setPoints] = useState(rectCreator.takenPoints)

    useEffect(() => {
        rectCreator.setWidth(width)
        rectCreator.setHeight(height)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const confirmationHandler = (data: boolean) => {
        const {args} = confirm
        setConfirm({} as IConfirm)
        const interfere: ICollision = {
            ...args[confirm.args.length - 1],
            joinPoint: data
        }
        confirm.cb(...args.slice(0, -1), interfere)
        setPoints(rectCreator.takenPoints)
    }
    
    const savePuzzle = () => {
        const valid = rectCreator.checkPuzzle()
        if (valid !== 'valid') {
            // TODO resolve errors
            console.error(valid)
            return
        }
        const puzzle = rectCreator.createPuzzle()
        console.log('save', puzzle)
        manager.savePuzzle(puzzle)
    }

    const undo = () => {
        rectCreator.undo()
        setPoints(rectCreator.takenPoints)
    }

    const clearAll = () => {
        rectCreator.clearAll()
        setPoints(rectCreator.takenPoints)
    }

    const redo = () => {
        rectCreator.redo()
        setPoints(rectCreator.takenPoints)
    }

    const selectColor = (color: string) => {
        console.warn('selected color', color)
        setColor(color)
        
    }

    const handleMouseUp = (key: string) => {
        const upPoint = rectCreator.getPoint(key)
        if (!upPoint 
            || upPoint?.utmost 
            || confirm.question
            || rectCreator.getLineNeighbors(key, color).length > 1
            || !rectCreator.getLineNeighbors(key, color).length
        ) {
            return
        }
        const key2 = upPoint.connections[color].filter(sec => sec.neighbor)[0].neighbor
        if (!key2) {
            console.error(upPoint, color, key)
        }
        const context = {freeCells: false, sameColorNeighbors: {}} as IUpContext
        console.warn('up', key, rectCreator.rect)
        const pointNeighbors = rectCreator.rect[key].neighbors
        for (let nei of pointNeighbors) {
            if (key2 === nei) {
                continue
            }
            const point = rectCreator.getPoint(nei)
            if (!point) {
                context.freeCells = true
            } else {
                const {utmost, connections} = point
                const sameColor = !!connections[color]
                const sameLine = sameColor 
                    && rectCreator.checkIfSameLinePoints(nei, key, color)
                if (sameColor && !sameLine) {
                    context.sameColorNeighbors = {
                        ...context.sameColorNeighbors,
                        key: nei,
                        utmost: utmost
                    }
                }
            } 
        }
        rectCreator.resolveMouseUp(key, key2!, color, context)
        setPoints(rectCreator.takenPoints)
    }

    const handleMouseDown = (key: string) => {
        if (confirm.question) return
        const exist = rectCreator.getPoint(key)
        console.warn('down', key, color, rectCreator.takenPoints, exist)
        if (exist) {
            const {utmost, connections} = exist
            const sameColor = !!connections[color]
            console.warn('exist', sameColor, utmost, key)
            if (utmost && !sameColor) {
                setConfirm({
                    question: 'Do you want to change the color',
                    cb: changeColor,
                    args: [key, color, {sameColor}]
                })
            } else if (!sameColor) {
                setConfirm({
                    question: 'Do you want to create join point',
                    cb: rectCreator.resolveMouseDown,
                    args: [key, color, {sameColor}]
                })
            }
        } else {
            rectCreator.resolveMouseDown(key, color)
        }
        setPoints(rectCreator.takenPoints)
    }

    const changeColor = (key: string, color: string, inter: ICollision) => {
        const colorToReplace = Object.keys(rectCreator.getPoint(key).connections)[0]
        inter.joinPoint && rectCreator.changeColor(key, color, colorToReplace)
    }

    const handleMouseEnter = (key: string, key2: string) => {
        console.log('enter', key, key2, rectCreator.isNeighbors(key, key2))
        if (confirm.question || !rectCreator.isNeighbors(key, key2)) {
            console.error('line broken', key, key2)
            return
        }
        const existed = rectCreator.getPoint(key)
        if (existed) {
            console.warn('exist', key, key2, existed)
        }
        if ((existed)) {
            const {connections, utmost} = existed 
            const sameColor = !!connections[color] 
                // && !!rectCreator.getPoint(key2).connections[color]
            if (!sameColor) {
                    setConfirm({
                        question: 'Do you want to create join point',
                        cb: rectCreator.resolveMouseEnter,
                        args: [key, key2, color, {sameColor}]
                    })     
            } else if (sameColor) {
                const sameLine = rectCreator.checkIfSameLinePoints(key, key2, color)
                    || rectCreator.checkIfSameLinePoints(key2, key, color)
                
                const joinPoint = utmost && !sameLine ? true : false
                let interfere = {joinPoint, sameLine, sameColor}
                rectCreator.resolveMouseEnter(key, key2, color, interfere)
            } 
        } else { 
            rectCreator.resolveMouseEnter(key, key2, color)
        }
        setPoints(rectCreator.takenPoints)
    }

    const checkPoint = (key: string) => {
        console.log(key, rectCreator.getPoint(key))
        return rectCreator.getPoint(key)
    }

    const checkLine = (key: string, key2: string) => {
        console.log(key2, key, rectCreator.getPoint(key2))
        return rectCreator.getPoint(key2) && rectCreator.rect[key2].neighbors.includes(key)
    }

 
    const customPuzzleHandlers = {
        handleMouseDown,
        handleMouseUp,
        handleMouseEnter,
        checkPoint,
        checkLine
    }

    const changeWidth = (width: string) => {
        const newWidth = parseInt(width)
        setWidth(newWidth)
        rectCreator.setWidth(newWidth)
    }

    const changeHeight = (height: string) => {
        const newheight = parseInt(height)
        setHeight(newheight)
        rectCreator.setHeight(newheight)
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

    return <div className='dots-conn-puzzle_creator'>
                <CustomPuzzleMenu 
                    handlers={customPuzzleMenuHandlers} 
                    color={color}
                    width={width}
                    height={height}
                />      
                <Puzzle 
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
}
