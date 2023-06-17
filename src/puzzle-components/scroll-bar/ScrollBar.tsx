import { IScrollBar } from "../../constant/interfaces";
import React, { useEffect, useRef, useState } from "react";
import { IncreaseBtn, DecreaseBtn } from "../size-input/SizeInput";
import './scroll-bar.scss'

const ScrollRate = {
    rate: 0
}

export const ScrollBar: React.FC<IScrollBar> = React.memo((props: IScrollBar) => {
    const {
        orientation = 1,
        numberOfRows,
        container,
    } = props

    const progressRef = useRef(null)
    const [currentScroll, setCurrentScroll] = useState(props.currentScroll)
    const [mouseDown, setMouseDown] = useState(0)
    const [scrollHeight, setScrollHeight] = useState(container?.scrollHeight || 100)
    const [barSize, setBarSize] = useState(100)

    useEffect(() => {
        if (!container) return
        const scroll = currentScroll * scrollHeight
        container.scroll({
            [orientation ? 'top' : 'left']: scroll,
            // behavior: 'smooth'
        })
        ScrollRate.rate = currentScroll
    }, [currentScroll])

    useEffect(() => {
        if (!container || !progressRef.current) return
        const {height, width} = (progressRef.current as HTMLElement).getBoundingClientRect()
        const size = orientation ? height : width
        const containerRect = container.getBoundingClientRect()
        setScrollHeight(orientation
            ? container.scrollHeight - containerRect.height
            : container.scrollWidth - containerRect.width)
        setBarSize(size)
        container.addEventListener('wheel', handleWheel)
        return () => {
            container.removeEventListener('wheel', handleWheel)
        }
    }, [container, orientation])

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const { clientY, clientX } =
            e.type === 'touchmove'
                ? (e as React.TouchEvent).changedTouches['0']
                : e as React.MouseEvent
        return {clientY, clientX}
    }

    const handleClickButton = (value: number) => {
        if (value > numberOfRows || value < 0 || !container || !progressRef.current) return
        ScrollRate.rate = value / numberOfRows
        setCurrentScroll(value / numberOfRows)
    }

    const getStyle = () => ({[orientation ? 'top' : 'left']: `${barSize * currentScroll}px`})

    const getCurrentValue = () => Math.floor(numberOfRows * currentScroll)

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation()
        if (!mouseDown || !progressRef.current) return
        const {clientX, clientY} = getCoordinates(e)
        const {x, y, height, width} = (progressRef.current as HTMLElement)
            .getBoundingClientRect()
       const currPos = orientation ? clientY - y : clientX - x
        // console.warn('move1', mouseDown, clientY, currPos)
        if (currPos < 0) return
        ScrollRate.rate = Math.min(currPos / barSize, 1)
        setCurrentScroll(Math.min(currPos / barSize, 1))
        container.scroll({
            top: currentScroll * scrollHeight,
            behavior: 'smooth'
        })
    }

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('progress-bar')) {
            const {clientX, clientY} = getCoordinates(e)
            const {x, y, height, width} = (progressRef.current! as HTMLElement).getBoundingClientRect()
            const pos = orientation ? clientY - y : clientX - x
            setCurrentScroll(Math.min(pos / barSize, 1))
        } else if (target.classList.contains('progress-bar_slider')) {
            setMouseDown(1)
        }
    }

    const handleMouseUp = () => {
        setMouseDown(0)
    }

    const handleWheel = (e: React.WheelEvent | WheelEvent) => {
        console.log(e)
        const {deltaY} = e
        const value = deltaY < 0
            ? Math.max((ScrollRate.rate * numberOfRows - 1), 0)
            : Math.min((ScrollRate.rate * numberOfRows + 1), numberOfRows)
        ScrollRate.rate = value / numberOfRows
        setCurrentScroll(value / numberOfRows)
        container.scroll({
            [orientation ? 'top': 'left']: value / numberOfRows * scrollHeight,
            behavior: 'smooth'
        })
    }

    // console.log('cur val' , getStyle(), container, scrollHeight, barSize)
    return (
        <div
            className={'scroll-bar' + (orientation ? ' vertical-bar' : 'horizontal-bar')}
            onMouseUp={handleMouseUp}
        >
            <IncreaseBtn
                handler={handleClickButton}
                currentValue={getCurrentValue()}
                step={-1}
                min={0}
                max={numberOfRows}
            />
            <div className='progress-bar_wrapper' >
                <div
                    className='progress-bar'
                    ref={progressRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onWheel={handleWheel}
                >
                    <button
                        type='button' className='progress-bar_slider'
                        style={getStyle()}
                    />
                </div>
            </div>
            <DecreaseBtn
                handler={handleClickButton}
                currentValue={getCurrentValue()}
                step={-1}
                min={0}
                max={numberOfRows}
            />
        </div>
    )
})
