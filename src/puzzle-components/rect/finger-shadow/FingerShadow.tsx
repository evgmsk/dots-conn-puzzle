import {useEffect, useState} from "react";

import './finger-shadow.scss'

import {IFingerShadow} from "../../../constant/interfaces";
import {shadowState} from '../../../app-services/finger-shadow-state'

export const FingerShadow: React.FC = () => {
    const {color, current, dir} = shadowState
    const [state, setState] = useState({color, pos: current, dir} as IFingerShadow)

    useEffect(() => {
        const unsub = shadowState.$shadowState.subscribe(setState)
        return unsub
    }, [])
    const shadowClass = `finger-shadow finger-shadow_${color} moving-${dir}`
    const cell = document.querySelector('.puzzle-cell')
    const {width} = cell ? cell.getBoundingClientRect() : {width: 50}
    const size = width * 1.3
    const [x, y] = [state.pos.x - size / 2, state.pos.y - size / 2]
    const style = {
        top: `${y}px`,
        left: `${x}px`,
        width: `${size}px`,
        height: `${size}px`,
    }
    // console.log('color', color, current, dir)
    return (
        <div className={shadowClass} style={style}>
        </div>
    )
}
