import React, {useEffect, useRef, useState} from "react";

import {pC} from "../../puzzle-engine/rect-creator";
// import {SizeInput} from "../size-input/SizeInput";

import './size-picker.scss'
import {MaxPuzzleHeight, MaxPuzzleWidth, MinPuzzleHeight, MinPuzzleWidth, Sizes} from "../../constant/constants";
import {ShowUP} from "../ShowUp";

export const SizePicker: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [width, setWidth] = useState(pC.width)
    const [height, setHeight] = useState(pC.height)
    const ref = useRef(null)

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

    return (
        <div className="size-picker" ref={ref}>
            <button
                className={"size-picker_open-btn" + (open ? ' open' : '')}
                type="button"
                onClick={handleOpen}
            >
                Select Puzzle Size
            </button>
            <div className={"size-picker_dropdown" + (open ? " is-open" : "")}>
                <ShowUP className={'sizes-wrapper'}>
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
                </ShowUP>
            </div>
        </div>
    )
}
