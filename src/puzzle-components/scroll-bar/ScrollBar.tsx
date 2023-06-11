import {IHandlers} from "../../constant/interfaces";
import React, {useRef, useState} from "react";
import {IncreaseBtn, DecreaseBtn} from "../size-input/SizeInput";
import './scroll-bar.scss'

export interface IScrollBar {
    handlers: IHandlers,
    current: number,
    min?: number,
    max: number,
    step?: number,
    vert?: boolean
}

export const ScrollBar: React.FC<IScrollBar> = (props: IScrollBar) => {
    const {current, max, min = 0, step = 1, handlers, vert = true} = props
    const [mouseDown, setMouseDown] = useState(false)
    const progressRef = useRef(null)

    const handleMouseMove = (e: any) => {
        if (!progressRef.current || !mouseDown) return
        if (e.target.classList.contains('progress-bar_slider')) return
        const barRect = (progressRef.current as HTMLElement).getBoundingClientRect()
        const { clientY } =
            e.type === 'touchmove'
                ? (e as React.TouchEvent).changedTouches['0']
                : e as React.MouseEvent
        if (barRect.y > clientY || clientY > barRect.y + barRect.height) {
            return
        }
    }

    const sliderStyle = {

    }

    return <div className={'scroll-bar' + (vert ? ' vertical-bar' : 'horizontal-bar')}>
                <IncreaseBtn handler={handlers.handleIncrease} size={current} min={5} />
                <div
                    className='progress-bar_wrapper'
                    onMouseMove={handleMouseMove}
                    onMouseDown={() => setMouseDown(true)}
                    onMouseUp={() => setMouseDown(false)}
                >
                    <div className='progress-bar' ref={progressRef}>
                        <div className='progress-bar_slider' style={{}}/>
                    </div>

                </div>
                <DecreaseBtn handler={handlers.handleDecrease} size={current} min={5} />
            </div>
}
