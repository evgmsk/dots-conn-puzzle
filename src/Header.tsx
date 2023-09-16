
import React, { useEffect, useState } from 'react';

import { modeService } from "./app-services/mode-service";
import { authService } from "./app-services/auth-service";
import {GameMenu} from "./app-components/game-menu/GameMenu";
import { Level } from './app-components/Level';
import {puzzlesManager} from "./app-services/puzzles-manager";
import {IPuzzle, IUser} from "./constant/interfaces";
import Timer from "./app-components/Timer";
import {UserId} from "./app-components/UserId";
import {SizePicker} from "./app-components/size-picker/SizePicker";




function Header() {
    const [gameMode, setGameMode] = useState(modeService.mode)
    const [id, setId] = useState(authService.user._id as string)
    const [puzzle, setPuzzle] = useState(false)

    const getPuzzle = (puzzle: IPuzzle) => {
        setPuzzle(!!puzzle)
    }

    const getId = (user: IUser) => {
        setId(user._id)
    }

    useEffect(() => {
        const unsubUser = authService.$user.subscribe(getId)
        const unsubMode = modeService.$mode.subscribe(setGameMode)
        const unsubPuzzle = puzzlesManager.$unresolved.subscribe(getPuzzle)
        return () => {
            unsubMode()
            unsubUser()
            unsubPuzzle()
        }
    }, [])

    return (
        <header className='header'>
            <Level />
            {gameMode === 'resolve' ? (puzzle ? <Timer /> : <UserId id={id}/>) : <SizePicker/>}
            <GameMenu />
        </header>
    );
}

export default Header;
