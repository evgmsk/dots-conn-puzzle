
import React, { useEffect, useState } from 'react';

import { modeService } from "./app-services/mode-service";
import { authService } from "./app-services/auth-service";
import {Admin} from "./constant/constants";
import {ManagerMenu} from "./puzzle-components/creator-components/CreationPuzzleMenu";
import {puzzlesManager} from "./app-services/puzzles-manager";
import {FooterMenu} from "./puzzle-components/resolver-components/ResolverMenuPanels";




function Footer() {
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

    return (
        <footer className='footer'>
            {gameMode === 'create' ? <ManagerMenu /> : <FooterMenu />}
        </footer>
    );
}

export default Footer;
