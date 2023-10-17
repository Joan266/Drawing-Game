import React from 'react'

const Message = (props) => {
    return (
        <li key={props.index} className='message'>
            <p>{props.data.nickname}: {props.data.message}</p>
        </li>
    )
}

export default Message