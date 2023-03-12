/* eslint-disable react-hooks/exhaustive-deps */
import React from "react"

import './rect.scss'

import { IPuzzleProps, ITakenPointProps } from "../../constant/interfaces"
import { Point } from "../point/point"
// import { copyObj } from "../../helper-fns/helper-fn"

const getCellKey = (X: number, Y: number, selector: string, size: number) => {
    const containerSizes = document.querySelector(selector)?.getBoundingClientRect()
    if (!containerSizes) return ''
    const {x, y, width} = containerSizes;
    const cellSize = width / size
    const iIndex = Math.floor(Math.abs(x - X) / cellSize)
    const jIndex = Math.floor(Math.abs(y - Y) / cellSize)
    return `${iIndex}-${jIndex}`
}

export const Puzzle: React.FC<IPuzzleProps> = (props: IPuzzleProps) => {

    const {
        dimension: {width, height},
        points,
        mouseDown,
        handlers: {
            handleMouseDown,
            handleMouseUp,
            handleMouseEnter,
            handleMouseLeave
        }
    } = props

    let entered = ''

    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (e.type !== 'touchstart') {
            e.preventDefault()
        }
        const key = (e.target as HTMLElement).getAttribute('id')
        console.warn('down', key)
        if (!key) return
        handleMouseDown(key, mouseDown)
    }

    const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (entered) {
            console.error('ent', e.target, entered)
        }
        if (!mouseDown || entered) return
        const {clientX, clientY } =
            e.type === 'touchmove'
                ? (e as React.TouchEvent).changedTouches['0']
                : e as React.MouseEvent
        const targetKey = getCellKey(clientX, clientY, '.dots-conn-puzzle_body', width)
        // console.warn('move', targetKey, enteredCell, checkPoint(enteredCell), checkLine(targetKey, enteredCell))
        if (targetKey !== mouseDown) {
            console.warn('enter in square', targetKey, mouseDown)
            entered = targetKey
            handleMouseEnter(targetKey, mouseDown)
        }
    }

    const handleUp = (key: string) => {
        if (!mouseDown) return
        handleMouseUp(key)
    }

    const mouseLeave = () => {
        if (!mouseDown) return
        handleMouseLeave()
    }

    const rectClassName = `dots-conn-puzzle_body size-${width}-${height}`
    const cellClass = 'puzzle-cell'
    const rect = new Array(height).fill('1').map((i, k) => {
        return new Array(width).fill('1').map((j, n) => {
            const key = `${n}-${k}`
            const point = points[key] || {} as ITakenPointProps
            const className = !point
                ? `${cellClass} empty-cell`
                : `${cellClass}`
            const {connections, utmost} = point
            return <div
                        className = {className}
                        key={key}
                        id={key}
                        onMouseDown={handleDown}
                        onTouchStart={handleDown}
                        onMouseUp={() => handleUp(key)}
                        onTouchEnd={() => handleUp(key)}
                    >
                        {point.connections
                            ? <Point
                                connections={connections}
                                utmost={utmost}
                                indKey={'p' + key}
                             />
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
