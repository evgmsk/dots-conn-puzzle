import React, {useEffect, useRef, useState} from "react";

import {pC} from "../../puzzle-engine/rect-creator";
import {SizeInput} from "../size-input/SizeInput";

import './size-picker.scss'
import {MaxPuzzleHeight, MaxPuzzleWidth, MinPuzzleHeight, MinPuzzleWidth} from "../../constant/constants";

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

    const changeHeight = (height: number) => {
        let _width
        if (height > width * 1.45) {
            _width = Math.round(height / 1.4)
        }
        if (height < width) {
            _width = height
        }
        if (height >= MinPuzzleHeight && height <= MaxPuzzleHeight) {
            pC.setDimension({height, width: _width})
        }
    }

    const changeWidth = (width: number) => {
        let _height
        if (height < width) {
            _height = width
        }
        if (height > width * 1.45) {
            _height = Math.round(width * 1.4)
        }
        if (width >= MinPuzzleWidth && width <= MaxPuzzleWidth) {
            pC.setDimension({width, height: _height})
        }
    }

    return (
        <div className="size-picker" ref={ref}>
            <button
                className="size-picker_open-btn"
                type="button"
                onClick={handleOpen}
            >
                Select Puzzle Size
            </button>
            <div className={"size-picker_dropdown" + (open ? " is-open" : "")}>
                <SizeInput
                    currentValue={width} label='Width'
                    handlers={{changeSize: changeWidth}}
                    max={18}
                />
                <SizeInput
                    currentValue={height}
                    label='Height'
                    handlers={{changeSize: changeHeight}}
                    max={22}
                />
            </div>
        </div>
    )
}
