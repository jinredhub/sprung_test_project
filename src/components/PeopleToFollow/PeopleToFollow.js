import React from 'react';
import './PeopleToFollow.css';
import Button from '../Button/Button';

const peopleToFollow = (props) =>{
    const initial = props.email.charAt(0).toUpperCase();
    return (
        <div className='PeopleToFollow'>
            <div className='initials'><strong>{initial}</strong></div>
            <div>
                <div><strong>{props.firstName} {props.lastName}</strong></div>
                <Button
                    type='button'
                    onClick={props.clicked}>Follow</Button>
            </div>
        </div>
    )
}

export default peopleToFollow;