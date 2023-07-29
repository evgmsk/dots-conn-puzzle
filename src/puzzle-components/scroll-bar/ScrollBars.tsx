import { IScrollBar } from "../../constant/interfaces";
import React, { useEffect, useRef, useState } from "react";
import { IncreaseBtn, DecreaseBtn } from "../../app-components/size-input/SizeInput";
import {getCoordinates} from '../../utils/helper-fn';

import './scroll-bar.scss';

const scrollRate = {
    rate: 0
}

interface IScrollBars {
    children: React.ReactNode
    clName?: string
    behavior?: ScrollBehavior
    style?: {[k: string]: string}
    container: HTMLElement
}

export const ScrollBars: React.FC<IScrollBars> = (props) => {
    const {children, container} = props
    const [scrollHeight, setScrollHeight] = useState(10)
    const [scrollWidth, setScrollWidth] = useState(10)

    useEffect(() => {
        if (!container) {
            return
        }
        const rect = container.getBoundingClientRect()
        // console.log('rect', rect, container.scrollHeight, container.scrollWidth)
        setScrollHeight(container.scrollHeight - rect.height)
        setScrollWidth(container.scrollWidth - rect.width)
    }, [container])
    if (scrollHeight <=0 && scrollWidth <= 0) {
        return <>{children}</>
    }
    // console.log(scrollHeight, scrollWidth, children)
    return <div className='scroll-bars-container'>
        {children}
        {scrollHeight > 0 && container
            ? <ScrollBar container={container} numberOfRows={10}/>
            : null
        }
        {scrollWidth > 0 && container
            ? <ScrollBar container={container} numberOfRows={10} orientation={0}/>
            : null
        }
    </div>
}

export const ScrollBar: React.FC<IScrollBar> = React.memo((props: IScrollBar) => {
    const {
        orientation = 1,
        numberOfRows = 10,
        container,
        behavior = 'smooth',
    } = props

    const progressRef = useRef(null)
    const [currentScroll, setCurrentScroll] = useState(props.currentScroll || 0)
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
        const handleUp = () => {
            if (mouseDown) {
                setMouseDown(0)
            }
        }
        if (mouseDown) {
            document.addEventListener('mouseup', handleUp)
        }
        return () => document.removeEventListener('mouseup', handleUp)
    }, [mouseDown])

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

    const handleClickButton = (value: number) => {
        if (value > numberOfRows || value < 0 || !container || !progressRef.current) return
        scrollRate.rate = value / numberOfRows
        setCurrentScroll(value / numberOfRows)
    }



    const getStyle = () => ({[orientation ? 'top' : 'left']: `${barSize * currentScroll}px`})
    const getCurrentValue = () => Math.floor(numberOfRows * currentScroll)

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        // e.stopPropagation()
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
            className={'scroll-bar' + (orientation ? ' vertical-bar' : ' horizontal-bar')}
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
