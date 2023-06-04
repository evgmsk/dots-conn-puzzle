import React, {useEffect, useState} from "react";

export const ShowUP = (props: {children: React.ReactNode}) => {
    const [showUp, setShowUp] = useState('')
    useEffect(() => {
        setShowUp(' show-up')
        return () => setShowUp('')
    }, [])
    return (
        <div className={'animated-component' + showUp}>
            {props.children}
        </div>
    )
}
