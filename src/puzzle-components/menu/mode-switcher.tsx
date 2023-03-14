import { ISwitcherProps } from "../../constant/interfaces"

import './mode-switcher.scss'


export const ModeSwitcher: React.FC<ISwitcherProps> = (props) => {
    const {
        handlers: {
            selectMode = () => {},
            selectNextPuzzle = () => {}
        },
        mode
    } = props
    const switcherClass = `mode-switcher mode-${mode}`
    return <div className={switcherClass}>
        {
            mode === 'resolve' ? (
                <>
                    <button
                        className="mode-switcher-btn"
                        onClick={() => selectMode('create')}
                    >
                        Create Puzzle
                    </button>
                    {/*<button*/}
                    {/*    className="mode-switcher-btn"*/}
                    {/*    onClick={() => selectNextPuzzle()}*/}
                    {/*>*/}
                    {/*    Create Puzzle*/}
                    {/*</button>*/}
                </>

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
