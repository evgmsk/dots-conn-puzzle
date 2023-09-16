import React, {useRef} from "react";

import { IHandlers } from "../../constant/interfaces"
import './size-input.scss'
import {getCoordinates} from "../../utils/helper-fn";

export interface IBarBtn {
    handler: Function,
    currentValue: number,
    step?: number,
    min?: number,
    max?: number,
}

export const IncreaseBtn: React.FC<IBarBtn> = (props: IBarBtn) => {
    const {handler, step = 1, currentValue, min = 3, max = Infinity} = props
    const handleClick = () => {
        const newValue = Math.max(Math.min(currentValue + step, max), min)
        handler(newValue)
    }

    return (
        <button
            type='button'
            role='menuitem'
            className='input__btn btn-up'
            onClick={handleClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
            </svg>
        </button>
    )
}

export const DecreaseBtn: React.FC<IBarBtn> = (props: IBarBtn) => {
    const {handler, step = 1, currentValue, min = 3, max = Infinity} = props
    const handleClick = () => {
        const newValue = Math.max(Math.min(currentValue - step, max), min)
        handler(newValue)
    }
    return (
        <button
            type='button'
            className='input__btn btn-down'
            role='menuitem'
            onClick={handleClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
            </svg>
        </button>
    )
}

export interface IDimensionControlsProps {
    currentValue: number,
    label: string,
    handlers: IHandlers,
    step?: number,
    max: number,
    min?: number
}

export const SizeInput: React.FC<IDimensionControlsProps> = (props: IDimensionControlsProps) => {
    const {handlers: {changeSize}, label, currentValue, step = 1, max, min = 3} = props

    const ref = useRef(null)

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {

        const target = e.target as HTMLElement
        const {clientX} = getCoordinates(e)
        const {x, width} = (ref.current! as HTMLElement).getBoundingClientRect()
        const pos = clientX - x
        const relPos = pos / width
        const val = Math.max(Math.min(Math.round(relPos * (max)), max), min)
        console.log(val, min)
        changeSize(val)
    }

    return (
        <div className='input__size'>
            <DecreaseBtn handler={changeSize} currentValue={currentValue} step={step} />
            <div
                className='input__size-value'
                ref={ref}
                onClick={handleMouseDown}
            >
                {label}:&nbsp;{currentValue}
            </div>
            <IncreaseBtn handler={changeSize} currentValue={currentValue} step={step} />
        </div>
    )
}
