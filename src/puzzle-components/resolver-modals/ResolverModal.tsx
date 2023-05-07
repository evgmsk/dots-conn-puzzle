

import './resolver-modal.scss'
import {useEffect, useState} from "react";

export function ResolverModal(props: any) {
    const [show, setShow] = useState('')

    useEffect(() => {
        setShow(' show-modal')
    },[])
    const modalClass = `pause-modal${show}`
    const topPanel = document.querySelector('.puzzle-resolver_top-panel-wrapper')
    const {height, y} = topPanel?.getBoundingClientRect() || {y: 100, height: 0}
    const top = `${y + height + 10}px`
    return <div className={modalClass} style={{top}}>
        {props.children}
    </div>
}
