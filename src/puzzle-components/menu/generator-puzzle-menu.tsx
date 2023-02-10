
import { IHandlers } from "../../constant/interfaces"


export const GeneratePuzzleMenu: React.FC<IHandlers> = (props: IHandlers) => {
    
    const getStartPoints = (e: React.MouseEvent) => {
        props.getStartPoints()
    }

    const resolveLine = (e: React.MouseEvent) => {
        props.resolveLine()
    }

    return <div className="lined-rect_menu">
        <input 
            type="button" 
            className='lined-rect_menu__button' 
            onClick={getStartPoints}
            value="Generate utmost points"
        />
      
        <input 
            type="button" 
            className='lined-rect_menu__button' 
            onClick={resolveLine}
            value = "Create meddlest line"
        />
            {/* 
        </input> */}
        {/* <input 
            type="button" 
            className='lined-rect_menu__button' 
            onClick={() => {}}
        >
            Show utmost points
        </input>
        <input 
            type="button" 
            className='lined-rect_menu__button' 
            onClick={() => {}}
        >
            
        </input> */}
    </div> 
}