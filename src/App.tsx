/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import { PuzzleWrapper } from './puzzle-components/resolver-components/PuzzleResolver';
import { PuzzleCreator } from './puzzle-components/creator-components/PuzzleCreator';
import { ConfirmAdmin } from "./confirm-admin/ConfirmAdmin";

import { isDev } from "./utils/helper-fn";
import { modeService } from "./app-services/mode-service";
import { authService } from "./app-services/auth-service";

import './App.scss';
import {Admin} from "./constant/constants";


function App() {
    const [gameMode, setGameMode] = useState(modeService.mode)
    const [admin, setAdmin] = useState(window.location.href.includes(Admin))
    const [user, setUser] = useState(authService.user)

    useEffect(() => {
        const unsubUser = authService.$user.subscribe(setUser)
        const unsubMode = modeService.$mode.subscribe(setGameMode)
        return () => {
            unsubMode()
            unsubUser()
        }
    }, [])

    const toOrigin = () => {
        window.location.href = !window.location.origin.includes(Admin)
            ? window.location.origin
            : window.location.href.replace(Admin, '')
    }

    const confirmAdminHandler = (token: string) => {
        setAdmin(!!token)
        if (!token) {
            toOrigin()
        }
    }


    useEffect(() => {
        if (!admin && authService.user.role === Admin) {
            authService.getToken().then(() => {
                isDev() && console.log('token updated')
            })
        }
    },[window.location.origin.includes(Admin)])

    if (admin && user.role !== Admin) {
        return <ConfirmAdmin cb={confirmAdminHandler} />
    }
    console.log(gameMode)
    const appClass = `app app-${gameMode}`
    return (
        <div className={appClass}>
            {gameMode === 'create'
                ? <PuzzleCreator />
                : <PuzzleWrapper />
            }
        </div>
    );
}

export default App;
