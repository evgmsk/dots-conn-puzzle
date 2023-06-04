import React from "react";

import { IHandlers } from "../../../constant/interfaces"
import './size-input.scss'


interface IDimensionControlsProps {size: number, label: string, handlers: IHandlers}

export const SizeInput: React.FC<IDimensionControlsProps> = (props: IDimensionControlsProps) => {
    const {handlers: {changeSize}, label, size} = props
    const handleChanges = (size: number) => {
        changeSize(size)
    }
    return (
        <div className='dots-puzzle_menu__size'>
            <div className='dots-puzzle_menu__size-value'>
                {label}:&nbsp;{size}
            </div>
            <div className='size-setter'>
                <button
                    type='button'
                    className='dots-puzzle_menu__btn btn-up'
                    onClick={() => handleChanges(size + 1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>

                </button>
                <button
                    type='button'
                    className='dots-puzzle_menu__btn btn-down'
                    onClick={() => handleChanges(size - 1 < 3 ? 3 : size - 1)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
