import React, {useEffect, useState} from 'react';

import { PuzzleWrapper } from './puzzle-components/PuzzleResolver';
import { PuzzleCreator } from './puzzle-components/PuzzleCreator';
import { PuzzleMode } from './constant/interfaces';
import { ModeSwitcher } from './puzzle-components/menu/ModeSwitcher';
import WebSocketClient from './ws'
import './App.scss';
import {ConfirmAdmin} from "./ConfirmAdmin";
import {LSAdmin, LSName, LSToken} from "./constant/constants";
import {puzzlesManager} from "./puzzles-storage/puzzles-manager";
import {saveResultToStorage, isDev} from "./helper-fns/helper-fn";


function App() {
    const [puzzleMode, setPuzzleMode] = useState('resolve' as PuzzleMode)
    const [admin, setAdmin] = useState(window.location.href.includes('admin'))
    const [confirmedAdmin, setConfirmedAdmin] = useState(!!localStorage.getItem(LSAdmin))
    const selectMode = (mode: PuzzleMode) => {
        setPuzzleMode(mode)
    }
    const toOrigin = () => {
        const path = !window.location.origin.includes('admin')
            ? window.location.origin
            : window.location.href.replace('admin', '')
        window.location.href = path
    }
    const confirmAdminHandler = (token: string) => {
        console.log('confirm', token)
        setAdmin(!!token)
        setConfirmedAdmin(!!token)
        if (!token) {
            toOrigin()
        } else {
            localStorage.setItem(LSAdmin, token)
            localStorage.setItem(LSToken, token)
        }

    }
    useEffect(() => {
        if (!admin && confirmedAdmin) {
            saveResultToStorage('', LSAdmin)
            saveResultToStorage('', LSToken)
            setConfirmedAdmin(false)
            puzzlesManager.getToken().then(r => {
                isDev() && console.log('token updated')
            })
        }
    },[window.location.origin.includes('admin')])
    if (admin && !confirmedAdmin) {
        return <ConfirmAdmin cb={confirmAdminHandler} />
    }
    return (
        <div className="App">
                {puzzleMode === 'create'
                    ? <PuzzleCreator />
                    : <PuzzleWrapper />}
            <WebSocketClient />
            <ModeSwitcher mode={puzzleMode} handlers={{selectMode}} />
        </div>
    );
}

export default App;
