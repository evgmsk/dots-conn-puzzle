import React, {useEffect, useState} from "react";

import {puzzlesManager} from "../app-services/puzzles-manager";

import './grade-modal.scss'
import {authService} from "../app-services/auth-service";
import {ShowUP} from "../puzzle-components/show-up/ShowUp";

export const GradeModal = (props: {[key: string]: any}) => {
    const [closeBtn, setCloseBtn] = useState(true)
    const { message } = props

    const handleFollow = () => {
        const creator = puzzlesManager.unresolvedPuzzle.name
        authService.updateUser({
            ...authService.user,
            followed: authService.user.followed.concat(creator)
        })
    }
    const handleBlock = () => {
        const creator = puzzlesManager.unresolvedPuzzle.name
        authService.updateUser({
            ...authService.user,
            followed: authService.user.blocked.concat(creator)
        })
    }

    return (
        <ShowUP>
        <div className='grade-modal'>
            <header className='grade-modal_header'>
                <h3 className='grade-modal_header_title'>
                    {message}
                </h3>
                <button
                    type="button"
                    className='close-modal-btn'
                    onClick={() => puzzlesManager.setGraded(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </header>
            <div className='grade-modal_body'>

            </div>
            <footer>
                <button
                    className='puzzle-btn'
                    type='button'
                    onClick={handleFollow}
                >
                    Follow
                </button>
                <button
                    className='puzzle-btn'
                    type='button'
                    onClick={handleBlock}
                >
                    Block
                </button>
            </footer>
        </div>
        </ShowUP>
    )
}
