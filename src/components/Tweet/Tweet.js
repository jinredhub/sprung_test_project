import React from 'react';
import './Tweet.css';

const tweet = (props) =>{
    const initial = props.firstName.charAt(0).toUpperCase();
    return (
        <div className='Tweet'>
            <div className='initials'><strong>{initial}</strong></div>
            <div>
                <div><strong>{props.firstName} {props.lastName}</strong> {props.time}</div>
                {props.message}
            </div>
        </div>
    )
}

export default tweet;