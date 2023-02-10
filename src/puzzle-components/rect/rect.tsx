import { useState } from "react"

import './rect.scss'

import { IPointConnections, IPuzzleProps } from "../../constant/interfaces"
import { Point } from "../point/point"

export const Puzzle: React.FC<IPuzzleProps> = (props: IPuzzleProps) => {
    const [leavedCell, setLeavedCell] = useState('')
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

    const handleDown = (e: React.MouseEvent) => {
        e.preventDefault()
        const key = (e.target as HTMLElement).getAttribute('data-key') || ''
        console.log('mouseDown', mouseDown, key)
        setMouseDown(true)
        setLeavedCell(key)
        console.log('mouseDown2', mouseDown)
        handleMouseDown(key, leavedCell)
    }

    const handleUp = (key: string) => {
        setMouseDown(false)
        handleMouseUp(key, leavedCell)
    }

    const mouseEnter = (key: string) => {
        
        if (!mouseDown) return
        console.warn(key, 'enter', leavedCell, mouseDown)
        if (!leavedCell) {
            console.error('Oops!')
        }
        handleMouseEnter(key, leavedCell)
        setLeavedCell(key)
    }

    const mouseLeave = () => {
        if (!mouseDown) return
        console.error('Oops!', mouseDown)
        setMouseDown(false)
        handleMouseLeave(leavedCell, leavedCell)
    }

    const rectClassName = `dots-conn-puzzle_body size-${width}-${height}`
    const cellClass = 'puzzle-cell'
    const rect = new Array(height).fill('1').map((i, k) => {
        return new Array(width).fill('1').map((j, n) => {
            const key = `${n}-${k}`
            const point = points[key] as IPointConnections
            const className = !point 
                ? `${cellClass} empty-cell`
                : `${cellClass}`
            return <div 
                        className = {className} 
                        key={key}
                        data-key={key}
                        onMouseDown={handleDown}
                        onMouseUp={() => handleUp(key)}
                        onMouseEnter={() => mouseEnter(key)}
                    >
                        {point? <Point connections={point} /> : null}
                    </div>
        })
    })
    return <div className={rectClassName} onMouseLeave={mouseLeave} > 
        {rect}
    </div>
}
