
import './pause-modal.scss'
import {useEffect, useState} from "react";

export function PauseModal(props: any) {
    const [shown, setShown] = useState('')

    useEffect(() => {
        setShown(' show-up')
    },[])
    const modalClass = `pause-modal${shown}`
    const topPanel = document.querySelector('.puzzle-resolver_top-panel-wrapper')
    const {height, y} = topPanel?.getBoundingClientRect() || {y: 100, height: 0}
    const top = `${y + height + 10}px`
    return <div className={modalClass} style={{top}}>
        {props.children}
    </div>
}
