import { IColorBTN, IHandlers } from "../../constant/interfaces"
import './color-btn.scss'

export interface IColorBtnsProps extends IColorBTN {
    handlers: IHandlers
}

export const ColorBTN: React.FC<IColorBtnsProps> = (props: IColorBtnsProps) => {
    const {selected, color, handlers: {selectColor}} = props
    const btnClass = `btn_color btn-${color}${selected ? ' selected' : ''}`
    return <button 
                type="button" 
                className={btnClass}
                onClick={() => selectColor(color)}
            ></button>
}