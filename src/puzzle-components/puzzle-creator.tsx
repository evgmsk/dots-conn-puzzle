import { useState } from 'react'

import { Puzzle } from './rect/rect'
import { ITakenPoints } from '../constant/interfaces'

import { CustomPuzzleMenu } from './menu/custom-puzzle-menu'

import { Height, LineColors, Width } from '../constant/constants'
import { rectCreator } from '../rect-constructor/rect-creator'
import { Confirmation } from './confirmation'

console.log(rectCreator._height)
export interface IConfirm {
    question: string
    cb: Function
    args: any[]
}

export const PuzzleCreator: React.FC = () => {
    const [width, setWidth] = useState(Width)
    const [height, setHeight] = useState(Height / 2)
    const [color, setColor] = useState(LineColors[0])
    const [confirm, setConfirm] = useState({} as IConfirm)

    const [points, setPoints] = useState(rectCreator.takenPoints)
   
    const confirmationHandler = (data: boolean) => {
        confirm.cb(...confirm.args, data)
        setConfirm({} as IConfirm)
    }
    
    const savePuzzle = () => {
        
    }

    const deleteItem = () => {
        setPoints(rectCreator._takenPoints)
    }

    const clearAll = () => {
        setPoints(rectCreator._takenPoints)
    }

    const addEndPoint = (props: ITakenPoints) => {
        
    }

    const selectColor = (color: string) => {
        console.warn('selected color', color)
        setColor(color)
    }

    const handleMouseUp = (key: string, key2: string) => {

        rectCreator.resolveMouseUp(key, key2, color)
    }

    const handleMouseDown = (key: string) => {
        if (confirm.question) return
        console.warn('donw', key, color)
        rectCreator.resolveMouseDown(key, color)
        setPoints(rectCreator.takenPoints)
    }

    const handleMouseEnter = (key: string, key2: string) => {
        if (confirm.question) return
        const existed = rectCreator.takenPoints[key]
        if (existed && rectCreator.checkIfDifferentStartPoints(key, key2, color)) {
            console.warn('exist', key, key2)
            setConfirm({
                question: 'Do you want to create join point',
                cb: rectCreator.resolveMouseEnter,
                args: [key, key2, color]
            })         
        } else {
            rectCreator.resolveMouseEnter(key, key2, color)
        }
        
    }

    const handleMouseLeave = (key: string, key2: string) => {
        if (confirm.question) return
        rectCreator.resolveMouseLeave(key, color)
        setPoints(rectCreator.takenPoints)
    }
 
    const customPuzzleHandlers = {
        handleMouseDown,
        handleMouseUp,
        handleMouseEnter,
        handleMouseLeave
    }

    const changeWidth = (width: string) => {
        const newWidth = parseInt(width)
        setWidth(newWidth)
        rectCreator.width(newWidth)
    }

    const changeHeight = (height: string) => {
        const newheight = parseInt(height)
        setHeight(newheight)
        rectCreator.height(newheight)
    }

    const customPuzzleMenuHandlers = {
        selectColor,
        clearAll,
        deleteItem,
        changeWidth,
        changeHeight,
        addEndPoint,
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
                    dimention={{width, height}} 
                    handlers={customPuzzleHandlers}
                />
                <Confirmation 
                    handler={confirmationHandler} 
                    question={confirm.question} 
                />
        
            </div>
}
