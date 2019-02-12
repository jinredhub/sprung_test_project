import React from 'react';
import './Input.css';

const input = (props) =>{
    let inputElement = null;

    if(props.inputtype === 'input'){
        inputElement = <input className='inputElement' {...props}/>;
    }
    else if(props.inputtype === 'textarea'){
        inputElement = <textarea className='inputElement' {...props}/>;
    }

    return (
        <div className='Input'>
            <label>{props.label}</label>
            {inputElement}
        </div>
    )
}

export default input;