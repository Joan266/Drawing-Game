import React from 'react'

const Message = (props) => {
    return (
        <li key={props.index} className='message'>
            <p>{props.message.nickname}: {props.message.body}</p>
        </li>
    )
}

export default Message