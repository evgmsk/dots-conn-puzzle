import React, {useState} from "react";

import './confirm.scss'
import {isDev} from "./helper-fns/helper-fn";
import {BaseDevUrl, BaseProdUrl, LSAdmin, LSToken} from "./constant/constants";

export const ConfirmAdmin:React.FC<{cb: Function}> = (props: {cb: Function}) => {

    const [password, setPassword] = useState('')
    const baseUrl = isDev() ? BaseDevUrl : BaseProdUrl
    const url = `${baseUrl}/auth/admin`
    console.log(url, password)
    const handlePasswordConfirm = async () => {
        if (!password.length) {return}
        console.log('url', url)
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({password})
        }
        try {
            const res = await fetch(url, options)
            const { token } = await res.json()
            return props.cb(token)
        } catch (e) {
            console.log(e)
            props.cb('')
        }


    }
    return <div className="confirm-modal">
        <button type="button"
            className="btn-close"
            onClick={() => props.cb(false)}
        >
            &times;
        </button>
        <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
        />
        <input type="submit" onClick={handlePasswordConfirm}/>
    </div>
}
