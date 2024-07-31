import {IScrollBar} from "../../constant/interfaces";
import React, {useCallback, useEffect, useRef, useState} from "react";
import { IncreaseBtn, DecreaseBtn } from "../range-input/RangeInput";
import {getCoordinates} from '../../utils/helper-fn';

import './scroll-bar.scss';

const initialData = { rate: 0, slider: 100, bar: 100, play: 50 }

const getData = () => Object.assign({}, initialData)


interface IScrollBars {
    children: React.ReactNode
    container?: {elem: HTMLElement}
    clName?: string
    behavior?: ScrollBehavior
    style?: {[k: string]: string}
    currentScroll?: number
    selector?: string
    elem?: {}
}

export const ScrollBars: React.FC<IScrollBars> = (props) => {
    const {children, container = {elem: null}, currentScroll: cS, selector = '.q'} = props
    const [vertSteps, setVertSteps] = useState(0)
    const [horSteps, setHorSteps] = useState(0)
    const ref = useRef(null)

    useEffect(() => {
        container.elem = (ref.current as unknown as HTMLElement).childNodes[0] as HTMLElement
        if (!container.elem) { return }
        const {height, width} = container.elem.getBoundingClientRect()
        const {scrollHeight, scrollWidth} = container.elem
        scrollHeight - height > 5 && setVertSteps(Math.floor(scrollHeight / height + 1))
        scrollWidth - width > 5 && setHorSteps(Math.floor(scrollWidth / width + 1))
        console.log('scroll bars', scrollHeight, scrollWidth, width, height, container, selector, (ref.current as unknown as HTMLElement).childNodes[0])
    }, [container, selector])
    

    return <div className='scroll-bars-container' ref={ref}>
        {children}
        {vertSteps > 0 && container.elem
            ? <ScrollBar
                container={container.elem}
                steps={vertSteps}
                currentScroll={cS}
                data={getData()}
            />
            : null
        }
        {horSteps > 0 && container.elem
            ? <ScrollBar
                container={container.elem}
                steps={horSteps}
                orientation={0}
                currentScroll={cS}
                data={getData()}
            />
            : null
        }
    </div>
}

export const ScrollBar: React.FC<IScrollBar> = React.memo((props: IScrollBar) => {
    const {
        orientation = 1,
        steps,
        container,
        behavior = 'smooth',
        currentScroll,
        data: scrollData
    } = props
    const progressRef = useRef(null)
    const [mouseDown, setMouseDown] = useState(0)
    const [scrollHeight, setScrollHeight] = useState(container?.scrollHeight || 100)
    const [scrollStyle, setScrollStyle] = useState({})
    const [sliderStyle, setSliderStyle] = useState({[orientation ? 'height' : 'width']: `100px`})

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
    
    const setSliderPosition = useCallback((cS: number) => {
        const currentPos = Math.floor(cS * scrollData.play),
            scrollProp = orientation ? 'top' : 'left',
            ori = orientation ? 'height' : 'width'
        const style = {
            [ori]: `${scrollData.slider}px`,
            [scrollProp]: `${currentPos}px`
        }
        setSliderStyle(style)
    }, [orientation, scrollData.play, scrollData.slider])
    
    const handleWheel = useCallback((e: React.WheelEvent | WheelEvent) => {
        const {deltaY} = e
        if (deltaY > 0 && scrollData.rate > .99) { return }
        const value = deltaY < 0
            ? Math.max((scrollData.rate * steps - 1), 0)
            : Math.min((scrollData.rate * steps + 1), steps)
        const scroll = Math.min(value / steps, 1.1)
        scrollData.rate = scroll
        container.scroll({
            [orientation ? 'top': 'left']: scroll * scrollHeight,
            behavior
        })
        setSliderPosition(scroll)
    },[behavior, container, orientation, scrollData, scrollHeight, setSliderPosition, steps])

    useEffect(() => {
        if (!container || !progressRef.current) return
        const {width, height} = container.getBoundingClientRect()
        const btn = document.querySelector('.scroll-bar .input__btn')
        container.addEventListener('wheel', handleWheel)
        const scrollH = orientation
            ? container.scrollHeight - height
            : container.scrollWidth - width
        const {
            width: btnWidth,
            height: btnHeight
        } = btn?.getBoundingClientRect() || {width: 15, height: 15}
        scrollData.rate = currentScroll || 0
        const scroll = scrollData.rate * scrollH
        const barSize = (orientation ? height : width),
            sliderSize = orientation
                ? height * height / container.scrollHeight
                : width * width / container.scrollWidth,
            ori = orientation ? 'height' : 'width',
            play = barSize - sliderSize - (orientation ? 2 * btnHeight : 2 * btnWidth),
            scrollProp = orientation ? 'top' : 'left'
        container.scroll({[scrollProp]: scroll, behavior})
        
        setScrollHeight(scrollH)
        scrollData.bar = barSize * .8
        scrollData.slider = sliderSize
        scrollData.play = play
        setScrollStyle({[ori]: `${barSize}px`})
        setSliderStyle({
            [scrollProp]: `${scrollData.rate * play}px`,
            [ori]: `${scrollData.slider}px`
        })
        return () => {
            container.removeEventListener('wheel', handleWheel)
        }
    }, [behavior, container, currentScroll, handleWheel, orientation, props.currentScroll, scrollData])

    const handleClickButton = (value: number) => {
        if (value > steps || value < 0 || !container || !progressRef.current) return
        scrollData.rate = value / steps
        setSliderPosition(scrollData.rate)
        const scrollProp = orientation ? 'top' : 'left'
        container.scroll({
            [scrollProp]: Math.min(value / steps, 1) * scrollHeight,
            behavior
        })
    }

    // const getStyle = () => ({[orientation ? 'top' : 'left']: `${barSize * currentScroll}px`})
    const getCurrentValue = () => Math.floor(steps * scrollData.rate)

    const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!mouseDown || !progressRef.current) return
        const {clientX, clientY} = getCoordinates(e)
        const delta = orientation ? mouseDown - clientY : mouseDown - clientX
        if (Math.abs(delta) < 10) return
        const currentPos = scrollData.rate * scrollData.play
        const newPos = Math.max(Math.min(currentPos - delta, scrollData.play), 0)
        const scroll = newPos / scrollData.play
        scrollData.rate = scroll
        const scrollProp = orientation ? 'top' : 'left'
        container.scroll({
            [scrollProp]: Math.min(scroll, 1) * scrollHeight,
            behavior
        })
        setSliderPosition(scroll)
        setMouseDown(orientation ? clientY : clientX)
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement
        if (target.classList.contains('progress-bar_slider')) {
            const {clientX, clientY} = getCoordinates(e)
            return setMouseDown(orientation ? clientY : clientX)
        }
        const {clientX, clientY} = getCoordinates(e)
        const {x, y} = (progressRef.current! as HTMLElement).getBoundingClientRect()
        const pos = orientation ? clientY - y : clientX - x
        const scroll = Math.max(pos / scrollData.bar, 0)
        setSliderPosition(Math.min(scroll, 1))
        const scrollProp = orientation ? 'top' : 'left'
        container.scroll({
            [scrollProp]: Math.min(scroll, 1) * scrollHeight,
            behavior
        })
    }

    return (
        <div
            className={'scroll-bar' + (orientation ? ' vertical-bar' : ' horizontal-bar')}
            style={scrollStyle}
            onMouseMove={handleMouseMove}
        >
            <DecreaseBtn
                onChange={handleClickButton}
                currentValue={getCurrentValue()}
                step={1}
                min={0}
                max={steps}
                plus={false}
            />
            <div
                className='progress-bar_wrapper'
                onMouseDown={handleMouseDown}
                style={scrollStyle}
            >
                <div
                    className='progress-bar'
                    ref={progressRef}
                    onWheel={handleWheel}
                >
                    <span className='progress-bar_slider' style={sliderStyle}/>
                </div>
            </div>
            <IncreaseBtn
                onChange={handleClickButton}
                currentValue={getCurrentValue()}
                step={1}
                min={0}
                max={steps}
                plus={false}
            />
        </div>
    )
})
