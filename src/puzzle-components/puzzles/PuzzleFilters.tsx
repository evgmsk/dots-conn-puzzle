/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";

import {RangeInput} from "../../app-components/range-input/RangeInput";
import {Sizes, StartDate} from "../../constant/constants";
import {puzzlesManager} from "../../app-services/puzzles-manager";
import {getYearMonthDay, square} from "../../utils/helper-fn";

let timeout = null as NodeJS.Timeout | null
// const delay = 500

export const PuzzleFilters: React.FC = () => {
    const [showUp, setShowUp] = useState('')
    const [options, setOptions] = useState(puzzlesManager.queryOptions)

    useEffect(() => {
        setShowUp(' show-up')
        const sub = puzzlesManager.$queryOptions.subscribe(setOptions)
        return () => {timeout && clearTimeout(timeout); sub()}
    }, [])

    const handleSizeChanging = (index: number) => {
        const size = Sizes[index]
        const value = square(size)
        puzzlesManager.updateQueryOptions({size: {size, value}})
    }

    const handleDateChanging = (e: React.ChangeEvent) => {
        const target = e.target as HTMLInputElement
        target.blur()
        const date = new Date(target.value);
        puzzlesManager.updateQueryOptions({...options,
            createdAt: {
                ...options.createdAt,
                date,
            }
        })
    }

    const handleDiffChanging = (value: number) => {
        puzzlesManager.updateQueryOptions({...options,
            difficulty: {
                ...options.difficulty,
                value,
            }
        })
    }

    const handleRatingChange = (value: number) => {
        puzzlesManager.updateQueryOptions({...options,
            rating: {
                ...options.rating,
                value
            }
        })
    }

    const handleRangeOptions = (e: React.MouseEvent | React.TouchEvent) => {
        const target = e.target as HTMLButtonElement
        target.blur()
        const prop = target.classList[target.classList.length - 1] as 'difficulty' | 'rating' | 'size'
        const value = options[prop].value
        const props = prop === 'size' ? { value, size: options[prop].size } : { value }
        switch (true) {
            case options[prop].andAbove:
                return puzzlesManager.updateQueryOptions({
                    [prop]: {
                        ...props,
                        andUnder: true
                    }
                })
            case options[prop].andUnder:
                return puzzlesManager.updateQueryOptions({
                    [prop]: {...props,}
                })
            case !options[prop].andAbove && !options[prop].andUnder:
                return puzzlesManager.updateQueryOptions({
                    [prop]: {
                        ...props,
                        andAbove: true
                    }
                })
        }
    }

    const handleDateOptions = () => {
        const date = options.createdAt.date
        switch (true) {
            case options.createdAt.andAfter:
                return puzzlesManager.updateQueryOptions({
                    createdAt: {
                        date,
                        andBefore: true
                    }
                })
            case options.createdAt.andBefore:
                return puzzlesManager.updateQueryOptions({
                    createdAt: {date}
                })
            case !options.createdAt.andAfter && !options.createdAt.andBefore:
                return puzzlesManager.updateQueryOptions({
                    createdAt: {
                        date,
                        andAfter: true
                    }
                })
        }
        puzzlesManager.updateQueryOptions({
            ...options,
            createdAt: {
                ...options.createdAt,
                andBefore: options.createdAt.andAfter,
                andAfter: options.createdAt.andBefore
            }
        })
    }

    const handleAuthors = (e: any) => {
        const targetId = e.target.id
        switch (targetId) {
            case 'subscribed': {
                return options.authors.followedOnly
                    ? puzzlesManager.updateQueryOptions({
                        authors: {
                            ...options.authors,
                            followedOnly: false
                        }
                    })
                    : puzzlesManager.updateQueryOptions({
                        authors: {
                            ...options.authors,
                            followedOnly: true,
                            excludeBlocked: false
                        }
                    })
            }
            case 'blocked': {
                return options.authors.excludeBlocked
                    ? puzzlesManager.updateQueryOptions({
                        authors: {
                            ...options.authors,
                            excludeBlocked: false
                        }
                    })
                    : puzzlesManager.updateQueryOptions({
                        authors: {
                            ...options.authors,
                            followedOnly: false,
                            excludeBlocked: true
                        }
                    })
            }

        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault()
       puzzlesManager.getPuzzles().then()
    }

    console.log(options)

    return (
        <div className={'puzzle-filters_container' + showUp}>
            <div className='puzzle-filters_title'>
               Filters:
            </div>
            <button
                type='button'
                onClick={puzzlesManager.setFilters}
                className='dots-puzzle_menu__btn close-btn'
            >
                &times;
            </button>
            <form
                className='puzzle-filters_form'
                onSubmit={handleSubmit}
            >
                <div className='puzzle-filters-wrapper diff-filter'>
                    <RangeInput
                        currentValue={options.difficulty.value}
                        label={'level'}
                        onChange={handleDiffChanging}
                        step={1}
                        min={0}
                        max={500}
                    />
                    <button className='options-wrapper' type={"button"}>
                        <div
                            className={'difficulty'}
                            onClick={handleRangeOptions}
                            role='button'
                        >
                            {options.difficulty.value}
                            {options.difficulty.andAbove ? ' and above' : '' }
                            {options.difficulty.andUnder ? ' and under' : '' }
                        </div>
                    </button>
                </div>
                <div className='puzzle-filters-wrapper size-filter'>
                    <RangeInput
                        currentValue={options.size.size}
                        label={'size'}
                        onChange={handleSizeChanging}
                        step={1}
                        min={0}
                        max={Sizes.length - 1}
                        values={Sizes}
                    />
                    <button
                        className='options-wrapper size'
                        type={"button"}
                        onClick={handleRangeOptions}
                    >
                        {options.size.size}
                        {options.size.andAbove ? ' and above' : '' }
                        {options.size.andUnder ? ' and under' : '' }
                    </button>
                </div>

                <div className='puzzle-filters-wrapper rating-filter'>
                    <RangeInput
                        currentValue={options.rating.value}
                        label={'rating'}
                        onChange={handleRatingChange}
                        max={10}
                    />
                    <button
                        className='options-wrapper rating'
                        type={"button"}
                        onClick={handleRangeOptions}
                    >
                        {options.rating.value}
                        {options.rating.andAbove ? ' and above' : '' }
                        {options.rating.andUnder ? ' and under' : '' }
                    </button>
                </div>
                <div className='puzzle-filters-wrapper authors-filter'>
                    <label htmlFor='size-checkbox'>Authors:</label>
                    <div className='checkbox-wrapper'>
                        <label htmlFor='size-checkbox'>subscribed only</label>
                        <input
                            type='checkbox'
                            id='subscribed'
                            checked={options.authors.followedOnly}
                            onChange={handleAuthors}
                        />
                    </div>
                    <div className='checkbox-wrapper'>
                        <label htmlFor='size-checkbox'>exclude blocked</label>
                        <input
                            type='checkbox'
                            id='blocked'
                            checked={options.authors.excludeBlocked}
                            onChange={handleAuthors}
                        />
                    </div>
                </div>
                <div className='puzzle-filters-wrapper date-filter'>
                    <div className='date-picker-wrapper'>
                        <label htmlFor='date-picker'>
                            Date
                        </label>
                        <input
                            id='date-picker'
                            type="date"
                            min={new Date(StartDate).toISOString().split("T")[0]}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={handleDateChanging}
                        />
                    </div>
                    <button
                        className='options-wrapper createdAt'
                        type={"button"}
                        onClick={handleDateOptions}
                    >
                        {getYearMonthDay(new Date(options.createdAt.date))}
                        {options.createdAt.andAfter ? ' and after' : '' }
                        {options.createdAt.andBefore ? ' and before' : '' }
                    </button>
                </div>
                <button
                    className={'apply-btn'}
                    type={"submit"}
                    onClick={handleSubmit}
                >
                    Apply
                </button>
            </form>
        </div>
    )
}
