import { useState } from 'react';

import { PuzzleWrapper } from './puzzle-components/puzzle-resolver';
import { PuzzleCreator } from './puzzle-components/puzzle-creator';
import { PuzzleMode } from './constant/interfaces';
import { ModeSwitcher } from './puzzle-components/menu/mode-switcher';
import './App.scss';


function App() {
  const [puzzleMode, setPuzzleMode] = useState('create' as PuzzleMode)
  const selectMode = (mode: PuzzleMode) => {
    setPuzzleMode(mode)
  }
  
  return (
    <div className="App">
      <ModeSwitcher mode={puzzleMode} handlers={{selectMode}} />
      {puzzleMode === 'create' 
        ? <PuzzleCreator /> 
        : <PuzzleWrapper />} 
    </div>
  );
}

export default App;
