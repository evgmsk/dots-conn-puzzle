
import './confirmation.scss'

export interface IConfirm {handler: Function, question: string}

export const CreationConfirmModal: React.FC<IConfirm> = (props: IConfirm) => {
    if (!props.question) {
        return null
    }
    return (
        <div className="confirmation-window">
            <div className="confirmation-title">{props.question}?</div>
            <div className="confirmation-footer">
                <button 
                    type="button" 
                    value="1" 
                    onClick={() => props.handler(true)}
                >
                    Yes
                </button>
                <button 
                    type="button" 
                    value="0" 
                    onClick={() => props.handler(false)}
                >
                    No
                </button> 
            </div>
        </div>
    )
}
