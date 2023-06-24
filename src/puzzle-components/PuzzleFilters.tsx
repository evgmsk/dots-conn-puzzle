/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";

import {SizeInput} from "./size-input/SizeInput";
import {StartDate} from "../constant/constants";
import {puzzlesManager} from "../app-services/puzzles-manager";
import {getUTCDate} from "../utils/helper-fn";

let timeout = null as NodeJS.Timeout | null
const delay = 500

export const PuzzleFilters: React.FC<{close: Function}> = (props:{close: Function}) => {
    const [currentValue, setSize] = useState(9)
    const [showUp, setShowUp] = useState('')
    const [sizeOver, setSizeOver] = useState(true)
    const [rating, setRating] = useState(5)
    const [ratingOver, setRatingOver] = useState(true)
    const [after, setAfter] = useState(true)
    const [date, setDate] = useState(getUTCDate())

    useEffect(() => {
        setShowUp(' show-up')
        return () => {timeout && clearTimeout(timeout)}
    }, [])

    const changeSize = (currentValue: number) => {
        const _size = currentValue%400
        setSize( _size > 9 ? _size : 9)
        handleChange()
    }

    const handleChangeDate = (val: string) => {
        console.log(val, date, Date.parse(val))
        setDate(getUTCDate())
        handleChange()
    }

    const handleChange = (delay = 500) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(puzzlesManager.updatePuzzles, delay)
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
        handleChange(0)
    }

    return (
        <div className={'puzzle-filters_container' + showUp}>
            <div className='puzzle-filters_title'>
                Choose puzzles options
            </div>
            <button
                type='button'
                onClick={() => props.close(false)}
                className='dots-puzzle_menu__btn close-btn'
            >
                &times;
            </button>
            <form
                className='puzzle-filter_form'
                onChange={() => handleChange()}
                onSubmit={handleSubmit}
            >
                <div className='puzzle-filters_container__size-wrapper'>

                    <SizeInput
                        currentValue={currentValue}
                        label={'Puzzles square'}
                        handlers={{changeSize}}
                        step={2}
                    />
                    <div className='checkbox-wrapper'>
                        <label htmlFor='size-checkbox'>from</label>
                        <input
                            type='checkbox'
                            id='size-checkbox'
                            checked={sizeOver}
                            onChange={() => setSizeOver(!sizeOver)}
                        />
                    </div>
                </div>
                <div className='puzzle-filters_container__date-wrapper'>
                    <div className='date-picker-wrapper'>
                        <label htmlFor='date-picker'>
                            Created at
                        </label>
                        <input
                            id='date-picker'
                            type="date"
                            min={new Date(StartDate).toISOString().split("T")[0]}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => handleChangeDate(e.target.value)}
                        />
                    </div>

                    <div className='checkbox-wrapper'>
                        <label htmlFor='date-checkbox'>after</label>
                        <input
                            type='checkbox'
                            id='date-checkbox'
                            checked={after}
                            onChange={() => setAfter(!after)}
                        />
                    </div>


                </div>
                <div className='puzzle-filters_container__rating-wrapper'>
                    <SizeInput currentValue={rating} label={'Puzzle rating'} handlers={{changeSize: setRating}} />
                    <div className='checkbox-wrapper'>
                        <label htmlFor='rating-checkbox'>over</label>
                        <input
                            type='checkbox'
                            id='rating-checkbox'
                            checked={ratingOver}
                            onChange={() => setRatingOver(!ratingOver)}
                        />
                    </div>

                </div>
                <div className='puzzle-filters_container__grade-wrapper'>
                    <SizeInput currentValue={rating} label={'Puzzle rating'} handlers={{changeSize: setRating}} />
                    <div className='checkbox-wrapper'>
                        <label htmlFor='grade-checkbox'>over</label>
                        <input
                            type='checkbox'
                            id='grade-checkbox'
                            checked={ratingOver}
                            onChange={() => setRatingOver(!ratingOver)}
                        />
                    </div>

                </div>
            </form>
        </div>
    )
}
