/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef} from "react"

import './rect.scss'

import {IPuzzleProps, ITakenPointProps, LineDirections} from "../../constant/interfaces"
import { Point } from "../point/Point"
import { shadowState } from '../../app-services/finger-shadow-state'
import { FingerShadow } from './finger-shadow/FingerShadow'


const getCellKey = (X: number, Y: number, selector: string, size: number) => {
    const containerSizes = document.querySelector(selector)?.getBoundingClientRect()
    if (!containerSizes) return ''
    const {x, y, width, height} = containerSizes;
    const cellSize = width / size
    if (X - x >= width) {
        return ''
    }
    const iIndex = Math.floor(Math.abs(x - X)%width / cellSize)
    const jIndex = Math.floor(Math.abs(y - Y)%height / cellSize)
    return `${iIndex}-${jIndex}`
}

export const Puzzle: React.FC<IPuzzleProps> = (props: IPuzzleProps) => {
    const {
        dimension: {width, height},
        points,
        mouseDown,
        highlightedEndpoints,
        handlers: {
            handleMouseDown,
            handleMouseUp,
            handleMouseEnter,
            handleMouseLeave
        }
    } = props

    const ref = useRef(null)

    useEffect(() => {
        const moUp = (e: MouseEvent | TouchEvent) => {
            const target = e.target as HTMLElement
            if (!ref.current
                || !(ref.current as HTMLElement).contains(target)
                || !target.id
            ) {
                return handleMouseLeave()
            }
            handleMouseUp(target.id)
        }
        document.addEventListener('mouseup', moUp)
        document.addEventListener('touchend', moUp)
        return () => {
            document.removeEventListener('mouseup', moUp)
            document.removeEventListener('touchend', moUp)
        }
    })
    let entered = ''

    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (e.type !== 'touchstart') {
            e.preventDefault()
        }
        const key = (e.target as HTMLElement).getAttribute('id')
        console.warn('down', key)
        if (!key) return
        const {clientX, clientY } =
            e.type === 'touchmove'
                ? (e as React.TouchEvent).changedTouches['0']
                : e as React.MouseEvent
        shadowState.setMouseDown(key, {x: clientX, y: clientY})
        handleMouseDown(key, mouseDown)
    }

    const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!mouseDown || (e.target as HTMLElement).id === entered) return
        const {clientX, clientY } =
            e.type === 'touchmove'
                ? (e as React.TouchEvent).changedTouches['0']
                : e as React.MouseEvent
        const targetKey = getCellKey(clientX, clientY, '.dots-conn-puzzle_body', width)
        if (!targetKey) {
            handleMouseLeave()
        }
        shadowState.detectDirection({x: clientX, y: clientY})
        if (targetKey !== mouseDown) {
            console.warn('entered', targetKey)
            entered = targetKey
            handleMouseEnter(targetKey, mouseDown)
        }
    }

    const mouseLeave = () => {
        handleMouseLeave()
    }

    const rectClassName = `dots-conn-puzzle_body size-${width}-${height}`
    const rect = new Array(height).fill('1').map((i, k) => {
        return new Array(width).fill('1').map((j, n) => {
            const key = `${n}-${k}`
            const point = points[key] || {} as ITakenPointProps
            const color = !(point.crossLine || point.joinPoint)
                ? point?.connections && point?.connections[LineDirections.top]?.color
                : ''
            const colorCl = color ? ` ${color}` : ''
            const className = !point
                ? `puzzle-cell c-${key} empty-cell`
                : `puzzle-cell c-${key} ${colorCl}`
            const {connections, endpoint, crossLine, joinPoint} = point
            const highlighted = highlightedEndpoints?.includes(key)
            return <div
                        className = {className}
                        key={key}
                        id={key}
                        onMouseDown={handleDown}
                        onTouchStart={handleDown}
                        // onMouseUp={() => handleUp(key)}
                        // onTouchEnd={() => handleUp(key)}
                    >
                        {point.connections
                            ? <Point
                                connections={connections}
                                endpoint={endpoint}
                                crossLine={crossLine}
                                joinPoint={joinPoint}
                                highlighted={highlighted}
                                indKey={'p' + key}
                             />
                            : null}
                    </div>
        })
    })
    return (
        <div
            className={rectClassName}
            onMouseMove={handlePointerMove}
            onMouseLeave={mouseLeave}
            onTouchMove={handlePointerMove}
            ref={ref}
        >
            {rect}
            {mouseDown ? <FingerShadow /> : null}
        </div>
    )
}
