import React, {useState} from "react";

import './confirm.scss'
import { isDev } from "../helper-fns/helper-fn";
import { BaseDevUrl, BaseProdUrl } from "../constant/constants";
import {authService} from "../app-services/auth-service";

export const ConfirmAdmin:React.FC<{cb: Function}> = (props) => {

    const [password, setPassword] = useState('')
    const baseUrl = isDev() ? BaseDevUrl : BaseProdUrl
    const url = `${baseUrl}/auth/admin`
    console.log(url, password)

    return <div className="confirm-modal">
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
        <input type="submit" onClick={() => authService.getAdminToken(password)}/>
    </div>
}
