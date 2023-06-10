import React from "react";

import { IHandlers } from "../../constant/interfaces"
import './size-input.scss'


interface IDimensionControlsProps {
    size: number,
    label: string,
    handlers: IHandlers,
    step?: number
}

export const SizeInput: React.FC<IDimensionControlsProps> = (props: IDimensionControlsProps) => {
    const {handlers: {changeSize}, label, size, step = 1} = props
    const handleChanges = (size: number) => {
        changeSize(size)
    }
    return (
        <div className='dots-input__size'>
            <div className='dots-input__size-value'>
                {label}:&nbsp;{size}
            </div>
            <div className='size-setter'>
                <button
                    type='button'
                    role='menuitem'
                    className='dots-input__btn btn-up'
                    onClick={() => handleChanges(size + step)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>

                </button>
                <button
                    type='button'
                    className='dots-input__btn btn-down'
                    role='menuitem'
                    onClick={() => handleChanges(size - 1 < 3 ? 3 : size - step)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
