import { IHandlers } from "../../constant/interfaces"


export const ResolvePuzzleMenu: React.FC<IHandlers> = (props: IHandlers) => {
    
    const showTrueLine = () => {
        
    }

    return <div className="lined-rect_menu">
        <input 
            type="button" 
            className='lined-rect_menu__button' 
            onClick={showTrueLine}
            value="Show true line"
        />
    </div> 
}