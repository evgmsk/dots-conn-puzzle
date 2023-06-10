import React, {useEffect, useState} from "react";

import './confirm.scss'

import {authService} from "../app-services/auth-service";

export const ConfirmAdmin:React.FC<{cb: Function}> = (props) => {

    const [password, setPassword] = useState('')

    useEffect(() => {
        // @ts-ignore
       document.querySelector('.confirm-modal [type="password"]')?.focus()
    }, [])

    const handleSubmit = (e: any) => {
        e.preventDefault()
        authService.getAdminToken(password).then()
    }

    return <form className="confirm-modal" onSubmit={handleSubmit}>
        <button type="button"
            className="btn-close"
            onClick={() => props.cb('')}
        >
            &times;
        </button>
        <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <input type="submit" onClick={handleSubmit}/>
    </form>
}
