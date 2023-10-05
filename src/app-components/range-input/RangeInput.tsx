import React, {MutableRefObject, useRef, useState} from "react";

import {SA} from "../../constant/interfaces"
import './range-input.scss'
import {getCoordinates} from "../../utils/helper-fn";

export interface IBarBtn {
    onChange: Function,
    currentValue: number | string,
    step?: number,
    min?: number,
    max?: number,
}

export const IncreaseBtn: React.FC<IBarBtn> = (props: IBarBtn) => {
    const {onChange, step = 1, currentValue, min = 3, max = Infinity} = props
    const handleClick = () => {
        const newValue = Math.max(Math.min(+currentValue + step, max), min)
        onChange(newValue)
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
    const {onChange, step = 1, currentValue, min = 3, max = Infinity} = props
    const handleClick = () => {
        const newValue = Math.max(Math.min(+currentValue - step, max), min)
        console.log(currentValue, newValue, min, max, step)
        onChange(newValue)
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
    currentValue: number | string,
    label: string,
    onChange: Function,
    step?: number,
    max: number,
    min?: number
    labelInside?: boolean
    values?: SA
}

export const RangeInput: React.FC<IDimensionControlsProps> = (props: IDimensionControlsProps) => {
    const [value, setValue] = useState('')
    const {onChange, label, currentValue, step = 1, max, min = 1, values, labelInside = true} = props
    const ref = useRef(null) as MutableRefObject<any> & {down: number}
    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        const index = getIndex(e)
        onChange(index)
        ref.down = getCoordinates(e).clientX
        const target = e.target as HTMLInputElement
        target.blur()
    }

    const handleMouseMove = (e:  React.MouseEvent | React.TouchEvent) => {
        if (!ref.down) return previewValue(getIndex(e))
        const index = getIndex(e)
        onChange(index)
    }

    const previewValue = (index: number) => {
        setValue(values ? values[index] : index.toString())
    }

    const getIndex = (e: React.MouseEvent | React.TouchEvent) => {
        const {clientX} = getCoordinates(e)
        const {x, width} = (ref.current! as HTMLElement).getBoundingClientRect()
        const pos = Math.abs(clientX - x) / width
        return Math.max(Math.min(Math.round(pos * max), max), min)
    }

    const handleMouseEnter = (e: React.MouseEvent | React.TouchEvent) => {
        if (ref.down) return
        const index = getIndex(e)
        setValue(values ? values[index] : index.toString())
    }

    const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
        const target = e.target as HTMLInputElement
        target.blur()
        ref.down = 0;
        setValue('')
    }

    return (
        <>
            {labelInside ? null : <label className={'outside-label'}>{label}</label>}
            <div className='input__range wrapper'>
                <DecreaseBtn
                    onChange={onChange}
                    currentValue={values ? values.indexOf(currentValue.toString()) : currentValue}
                    step={step}
                    min={min}
                    max={max}
                />
                <button
                    type={"button"}
                    className='input__range range'
                    ref={ref}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseEnter={handleMouseEnter}
                >
                    {labelInside ? label : ''}
                    <span className={'on-enter-value'}>{ref.down ? currentValue : value}</span>
                </button>
                <IncreaseBtn
                    onChange={onChange}
                    currentValue={values ? values.indexOf(currentValue.toString()) : currentValue}
                    step={step}
                    min={min}
                    max={max}
                />
            </div>
        </>
    )
}

///:&nbsp;{currentValue}
