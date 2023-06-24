import React, {useEffect, useState} from "react";

import './adds-modal.scss'
import { ShowUP } from "../puzzle-components/show-up/ShowUp";
import {addsService} from "../app-services/adds-service";

export const AddsModal = (props = { message: 'Great' }) => {
    const { message } = props
    const [time, setTime] = useState(addsService.addsTimeout)
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        interval = setInterval(() => {
            setTime(time => time - 1);
        }, 1000);
        if (time <= 0) {
            clearInterval(interval as unknown as NodeJS.Timeout)
        }
        return () => clearInterval(interval as NodeJS.Timeout);
    }, [time]);

    return (
        <ShowUP>
            <div className="adds-modal">
                <header className='modal_header'>
                    {message || 'Great!!'}
                    <button
                        type="button"
                        className='close-modal-btn'
                        onClick={() => addsService.setAddsShown(true)}
                        disabled={time > 0}
                    >
                        {time > 0
                            ? <span className='adds-timer'>{time}</span>
                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    </button>
                </header>
                <div className='adds-modal_body'>

                </div>
                <footer className='adds-modal_footer'>

                </footer>
            </div>
        </ShowUP>
    )
}
