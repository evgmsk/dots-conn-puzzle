import { ISwitcherProps } from "../../constant/interfaces"

import './mode-switcher.scss'


export const ModeSwitcher: React.FC<ISwitcherProps> = (props) => {
    const {handlers: {selectMode = () => {}}, mode} = props
    return <div className="mode-wrapper">
        {
            mode === 'resolve' ? (
                <button 
                    className="mode-switcher-btn"
                    onClick={() => selectMode('create')}
                >
                    Create Puzzle
                </button>
            )
            : (
                <button 
                    className="mode-switcher-btn"
                    onClick={() => selectMode('resolve')}
                >
                    Resolve Puzzle
                </button>
            )
        }
    </div>
}
