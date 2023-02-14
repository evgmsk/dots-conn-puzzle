/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react"

import './rect.scss'

import { IPuzzleProps, ITakenPointProps } from "../../constant/interfaces"
import { Point } from "../point/point"

const getCellKey = (X: number, Y: number, selector: string, size: number) => {
    const containerSizes = document.querySelector(selector)?.getBoundingClientRect()
    if (!containerSizes) return ''
    // console.warn(typeof X, typeof Y, typeof size) 
    const {x, y, width} = containerSizes;
    const cellSize = width / size
    const iIndex = Math.floor(Math.abs(x - X) / cellSize)
    const jIndex = Math.floor(Math.abs(y - Y) / cellSize)
    return `${iIndex}-${jIndex}`
}

export const Puzzle: React.FC<IPuzzleProps> = (props: IPuzzleProps) => {
    const [enteredCell, setEnteredCell] = useState('')
    const [mouseDown, setMouseDown] = useState(false)
    const {
        dimention: {width, height},
        points,
        handlers: {
            handleMouseDown,
            handleMouseUp,
            handleMouseEnter,
            handleMouseLeave
        }
    } = props

    const handleDown = (e: any) => {
        // console.log(e.type, e.preventDefault)
        if (e.type !== 'touchstart') {
            e.preventDefault()
        }
        const key = (e.target as HTMLElement).getAttribute('id') || ''
        console.log('mouseDown', mouseDown, key)
        setMouseDown(true)
        handleMouseDown(key, enteredCell)
        setEnteredCell(key)        
    }

    const handlePointerMove = (e: any) => {
        if (!mouseDown) return
        const {clientX, clientY } =
            e.type === 'touchmove' ? e.changedTouches['0'] : e
        const targetKey = getCellKey(clientX, clientY, '.dots-conn-puzzle_body', width)
        // console.log('move', enteredCell, targetKey)
        if (targetKey !== enteredCell) {
            handleMouseEnter(targetKey, enteredCell)
            setEnteredCell(targetKey)
        }
    }

    const handleUp = (key: string) => {
        if (!mouseDown) return 
        setMouseDown(false)
        handleMouseUp(key, enteredCell)
    }

    const mouseLeave = () => {
        if (!mouseDown) return
        console.error('Oops!', mouseDown)
        setMouseDown(false)
        handleMouseLeave(enteredCell)
    }

    const rectClassName = `dots-conn-puzzle_body size-${width}-${height}`
    const cellClass = 'puzzle-cell'
    const rect = new Array(height).fill('1').map((i, k) => {
        return new Array(width).fill('1').map((j, n) => {
            const key = `${n}-${k}`
            const point = points[key] as ITakenPointProps
            const className = !point 
                ? `${cellClass} empty-cell`
                : `${cellClass}`
            const {connections, utmost} = point || {}
            return <div 
                        className = {className} 
                        key={key}
                        id={key}
                        onMouseDown={handleDown}
                        onTouchStart={handleDown}
                        onMouseUp={() => handleUp(key)}
                    >
                        {point 
                            ? <Point connections={connections} utmost={utmost} /> 
                            : null}
                    </div>
        })
    })
    return <div 
                className={rectClassName}
                onMouseLeave={mouseLeave}
                onMouseMove={handlePointerMove}
                onTouchMove={handlePointerMove}
            > 
        {rect}
    </div>
}
