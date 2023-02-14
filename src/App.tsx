import { useState } from 'react';

import { PuzzleWrapper } from './puzzle-components/puzzle-resolver';
import {PuzzleCreator} from './puzzle-components/puzzle-creator';
import { PuzzleMode } from './constant/interfaces';
import { ModeSwitcher } from './puzzle-components/menu/mode-switsher';
import './App.scss';


function App() {
  const [puzzleMode, setPuzzleMode] = useState('create_custom' as PuzzleMode)
  const selectMode = (mode: PuzzleMode) => {
    setPuzzleMode(mode)
  }
  
  return (
    <div className="App">
      <ModeSwitcher mode={puzzleMode} handlers={{selectMode}} />
      {puzzleMode === 'create_custom' 
        ? <PuzzleCreator /> 
        : <PuzzleWrapper />} 
    </div>
  );
}

export default App;
