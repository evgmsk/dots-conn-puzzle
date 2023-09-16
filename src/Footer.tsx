import React, { useEffect, useState } from 'react';

import { modeService } from "./app-services/mode-service";
import {ManagerMenu} from "./puzzle-components/creator-components/CreationPuzzleMenu";
import {FooterMenu} from "./puzzle-components/resolver-components/ResolverMenuPanels";




function Footer() {
    const [gameMode, setGameMode] = useState(modeService.mode)



    useEffect(() => {
        const unsubMode = modeService.$mode.subscribe(setGameMode)
        return () => {
            unsubMode()
        }
    }, [])


    return (
        <footer className='footer'>
            {gameMode === 'create' ? <ManagerMenu /> : <FooterMenu />}
        </footer>
    );
}

export default Footer;
