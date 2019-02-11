import React from 'react';
import './Button.css';

const button = (props) =>{
    return (
        <div className='Button'>
            <button className='loginButton' {...props}>{props.children}</button>
        </div>
    )
}
export default button;