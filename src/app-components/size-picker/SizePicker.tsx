import React, {useEffect, useRef, useState} from "react";

import {pC} from "../../puzzle-engine/rect-creator";

import './size-picker.scss'
import { Sizes} from "../../constant/constants";
import {ShowUP} from "../ShowUp";
import {ScrollBars} from "../scroll-bar/ScrollBars";

export const SizePicker: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [width, setWidth] = useState(pC.width)
    const [height, setHeight] = useState(pC.height)
    const ref = useRef(null)
    const refDrop = useRef(null)

    const handleOpen = () => {
        function close(e: MouseEvent | TouchEvent) {
            if (!ref.current) {
                document.removeEventListener('click', close)
                return
            }
            if (!(ref.current as HTMLElement).contains(e.target as HTMLElement)) {
                setOpen(false)
                document.removeEventListener('click', close)
            }
        }
        if (!open) {
            setOpen(true)
            document.addEventListener('click', close)
        }
        if (open) {
            setOpen(false)
            document.removeEventListener('click', close)
        }
    }

    useEffect(() => {
        const unsubW = pC.$width.subscribe(setWidth)
        const unsubH = pC.$height.subscribe(setHeight)
        return () => {
            unsubH()
            unsubW()
        }
    }, [])

    const selectSize = (size: string) => {
        const [width, height] = size.split('x').map(s => parseInt(s))
        pC.setDimension({width, height})
        setOpen(false)
    }
    const dropDown = !open
        ? null
        : <ShowUP className={'sizes-show-up'} >
            <ScrollBars container={{elem: refDrop.current as unknown as HTMLElement}}
                        selector={'.sizes-wrapper'}
            >
                <div className={'sizes-wrapper'} ref={refDrop}>
                    {
                        Sizes.map(s => {
                            const cl =  `${width}x${height}` === s ? ' selected' : ''
                            return <div
                                key={s}
                                className={'size-item' + cl}
                                onClick={() => selectSize(s)}
                            >{s}</div>
                        })
                    }
                </div>
            </ScrollBars>
        </ShowUP>
    return (
        <div className="size-picker" ref={ref}>
            <button
                className={"size-picker_open-btn" + (open ? ' open' : '')}
                type="button"
                onClick={handleOpen}
            >
                Select Puzzle Size
            </button>
                <div className={"size-picker_dropdown" + (open ? " is-open" : "")} >
                    {dropDown}
                </div>
        </div>

    )
}
