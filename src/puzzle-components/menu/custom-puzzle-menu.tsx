import { LineColors } from '../../constant/constants'
import {IHandlers} from '../../constant/interfaces'
import { ColorBTN } from '../color-btn/color-btn'

import './custom-puzzle-menu.scss'

export interface ICustomPuzzle {
    color: string
    width: number
    height: number
    level?: number
    handlers: IHandlers
}

export const CustomPuzzleMenu: React.FC<ICustomPuzzle> = 
    (props: ICustomPuzzle) => {
    const {
        color,
        width,
        height,
        level,
        handlers: {
            changeWidth,
            changeHeight,
            savePuzzle,
            selectColor,
            undo,
            redo,
            clearAll
        }
    } = props
    
    const saveResult = () => {
        savePuzzle()
    }

    return (
        <div className="dots-puzzle_menu">
            <div className='dots-puzzle_menu__dimensions'>
                {level
                    ? <div className='dots-puzzle_menu__level'>L:&nbsp;{level}</div>
                    : null
                }
                <div className='dots-puzzle_menu__size-range'>
                    <label>Width:</label>
                    {/*<input */}
                    {/*    type="range" */}
                    {/*    min={3} */}
                    {/*    max={20} */}
                    {/*    step={1} */}
                    {/*    value={width}*/}
                    {/*    onChange={e => changeWidth(e.target.value)} */}
                    {/*/>*/}
                    {/*&nbsp;*/}
                    <input type="number" value={width} onChange={e => changeWidth(e.target.value)}/>
                </div>
                <div className='dots-puzzle_menu__size-range'>
                    <label>Height:</label>
                    {/*<input */}
                    {/*    type="range" */}
                    {/*    min={3} */}
                    {/*    max={30} */}
                    {/*    step={1} */}
                    {/*    value={height}*/}
                    {/*    onChange={(e) => changeHeight(e.target.value)} */}
                    {/*/>*/}
                    {/*&nbsp;*/}
                    <input type="number" value={height} onChange={e => changeHeight(e.target.value)}/>
                </div>
                {/* <button 
                    className='dots-puzzle_menu-btn' 
                    type="button"
                    onClick={() => savePuzzle()}
                >
                    savePuzzle
                </button> */}
               
                
            </div>
            <div className='dots-puzzle_menu__colors-wrapper'>
                {
                    LineColors.slice(1).map(c => {
                        return <ColorBTN 
                                    handlers={{selectColor}} 
                                    color={c} 
                                    selected={color === c}
                                    key={c}
                                />
                    })
                }
            </div>
            <div className='dots-puzzle_menu__footer'>
                <button 
                    className='dots-puzzle_menu-btn' 
                    type="button"
                    onClick={() => clearAll()}
                >
                    clear all
                </button>
                <button 
                    className='btn_custon-puzzle-menu' 
                    type="button"
                    onClick={() => undo()}
                >
                    undo
                </button><button 
                    className='btn_custon-puzzle-menu' 
                    type="button"
                    onClick={() => redo()}
                >
                    redo
                </button>
                <button 
                    type="button" 
                    className='lined-rect_menu__button' 
                    onClick={saveResult}
                >
                    Save puzzle
                </button>
            </div>
        </div> 
    )
}
