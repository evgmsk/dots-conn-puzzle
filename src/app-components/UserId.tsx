export const UserId = (props: {id: string}) => {

    return <div className='user-id-wrapper'>
                <input
                title={props.id}
                type="text"
                className='user-id'
                value={`User: ${props.id}`}
                readOnly={true}
            />

        </div>
}
