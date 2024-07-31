import React, { useEffect, useState } from 'react';

import { modeService } from "./app-services/mode-service";
import {CreatorManagerMenu} from "./puzzle-components/creator-components/PuzzleCreatorMenu";
import {FooterMenu} from "./puzzle-components/puzzles/PuzzlesMenuFooterPanels";




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
            {gameMode === 'create' ? <CreatorManagerMenu /> : <FooterMenu />}
        </footer>
    );
}

export default Footer;
