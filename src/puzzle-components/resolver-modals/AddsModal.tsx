import React from "react";



import './adds-modal.scss'


export interface ICongratulation {
    message: string
    [key: string]: any
}

export const AddsModal: React.FC<ICongratulation> = (props) => {
    const {message} = props
    return (
        <div className="congrats-modal">
            {message  || 'Great!!'}
        </div>
    )
}
