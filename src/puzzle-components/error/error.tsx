import {useEffect, useState} from "react";
import {puzzlesManager} from "../../app-services/puzzles-manager";

export const Error = () => {
    const [message, setMessage] = useState('')
    const handleMassage = (error: {message: string}) => {
        setMessage(error.message)
    }
    useEffect(() => {
        return puzzlesManager.$error.subscribe(handleMassage)
    })
    if (!message) return null
    return (
            <div className='error-message_wrapper'>
                <button
                    className='error-message_close-btn'
                    onClick={() => puzzlesManager.saveError('')}
                >
                    &times;
                </button>
                {message}
            </div>
        )

}
