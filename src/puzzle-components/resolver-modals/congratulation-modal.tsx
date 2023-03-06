import React from "react";



import './congratulation-modal.scss'


export interface ICongratulation {
    message: string
    [key: string]: any
}

export const CongratulationModal: React.FC<ICongratulation> = (props) => {
    const {message} = props
    return (
        <div className="congrats-modal">
            {message  || 'Great!!'}
        </div>
    )
}
