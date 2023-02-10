import { LineColors } from '../../constant/constants'
import {IHandlers} from '../../constant/interfaces'
import { ColorBTN } from '../color-btn/color-btn'

export interface ICustomPuzzle {
    color: string
    width: number
    height: number
    handlers: IHandlers
}

export const CustomPuzzleMenu: React.FC<ICustomPuzzle> = 
    (props: ICustomPuzzle) => {
    const {
        color,
        width,
        height,
        handlers: {
            changeWidth,
            changeHeight,
            savePuzzle,
            selectColor,
            deleteItem,
            clearAll
        }
    } = props
    
    const saveResult = () => {

    }

    return <div className="dots-conn-puzzle_menu">
        <div className='dots-puzzle_top-menu'>
        <div className='dots-puzzle_width-range'>
            <label>Width:</label>
            <input 
                type="range" 
                min={3} 
                max={20} 
                step={1} 
                value={width}
                onChange={e => changeWidth(e.target.value)} 
            />
        </div>
        <div className='dots-puzzle_height-range'>
            <label>Height:</label>
            <input 
                type="range" 
                min={3} 
                max={30} 
                step={1} 
                value={height}
                onChange={(e) => changeHeight(e.target.value)} 
            />
        </div>
        <button 
            className='dots-puzzle_menu-btn' 
            type="button"
            onClick={() => savePuzzle()}
        >
            savePuzzle
        </button>
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
            onClick={() => deleteItem()}
        >
            delete point
        </button>
        </div>
        
        <div className='colors-wrapper'>
            {
                LineColors.map(c => {
                    return <ColorBTN 
                                handlers={{selectColor}} 
                                color={c} 
                                selected={color === c}
                                key={c}
                            />
                })
            }
            
        </div>
     
        <button 
            type="button" 
            className='lined-rect_menu__button' 
            onClick={saveResult}
        >Save puzzle</button>
    </div> 
}
