import { IScrollBar } from "../../constant/interfaces";
import React, { useEffect, useRef, useState } from "react";
import { IncreaseBtn, DecreaseBtn } from "../size-input/SizeInput";
import './scroll-bar.scss'

const scrollRate = {
    rate: 0
}

export const ScrollBar: React.FC<IScrollBar> = React.memo((props: IScrollBar) => {
    const {
        orientation = 1,
        numberOfRows,
        container,
        behavior = 'smooth'
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
            behavior
        })
        scrollRate.rate = currentScroll 
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
        scrollRate.rate = value / numberOfRows
        setCurrentScroll(value / numberOfRows)
    }

    const getStyle = () => ({[orientation ? 'top' : 'left']: `${barSize * currentScroll}px`})

    const getCurrentValue = () => Math.floor(numberOfRows * currentScroll)

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation()
        if (!mouseDown || !progressRef.current) return
        const {clientX, clientY} = getCoordinates(e)
        const {x, y} = (progressRef.current as HTMLElement)
            .getBoundingClientRect()
        const currPos = orientation ? clientY - y : clientX - x
        if (currPos < 0) return
        scrollRate.rate = Math.min(currPos / barSize, 1)
        setCurrentScroll(Math.min(currPos / barSize, 1))
        container.scroll({
            top: currentScroll * scrollHeight,
            behavior
        })
    }

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('progress-bar_slider')) {
            setMouseDown(1)
            return
        }
        const {clientX, clientY} = getCoordinates(e)
        const {x, y} = (progressRef.current! as HTMLElement).getBoundingClientRect()
        const pos = orientation ? clientY - y : clientX - x
        const scroll = Math.max(pos / barSize, 0)
        setCurrentScroll(Math.min(scroll, 1))
    }

    const handleMouseUp = () => {
        setMouseDown(0)
    }

    const handleWheel = (e: React.WheelEvent | WheelEvent) => {
        const {deltaY} = e
        if (deltaY > 0 && scrollRate.rate > .99) { return }
        const value = deltaY < 0
            ? Math.max((scrollRate.rate * numberOfRows - 1), 0)
            : Math.min((scrollRate.rate * numberOfRows + 1), numberOfRows)

        const scroll = Math.min(value / numberOfRows, 1.1)
        scrollRate.rate = scroll
        setCurrentScroll(scroll)
        container.scroll({
            [orientation ? 'top': 'left']: scroll * scrollHeight,
            behavior
        })
    }

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
            <div
                className='progress-bar_wrapper'
                onMouseDown={handleMouseDown}
            >
                <div
                    className='progress-bar'
                    ref={progressRef}
                    // onMouseDown={handleMouseDown}
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
