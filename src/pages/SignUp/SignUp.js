import React, { Component } from 'react';
import './SignUp.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import * as firebase from "firebase";
import {database} from "../../firebase";
import axios from '../../axios';

class SignUp extends Component {
    state={
        errorMessage: '',
        firstNameText: '',
        lastNameText: '',
        emailText: '',
        allUsers: {},
        passwordText: '',
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                console.log(firebaseUser);
                const url = '/home';
                window.location.href = url;
            }
            else{
                console.log('not logged in');
                this.loadDatabase();
            }
        });
    }

    loadDatabase = () =>{
        console.log('loading database');

        database.ref().on('value', function(snapshot){
            if(snapshot.child('text').exists()){
                console.log('snapshot: ',snapshot.val().text);
            }
        });
    }

    // // update db
    // updateDatabase = ()=>{
    //     console.log('updating db');
    //     let allUsers = [...this.state.allUsers];
    //     database.ref().set(allUsers);
    // }

    updateDatabase = (email, firstName, lastName) =>{



        const allUsers = this.state.allUsers;
        console.log('allusers: ', allUsers);
        // if(!allUsers[email]){
        //     allUsers[email] = {
        //         firstName: firstName,
        //         lastName: lastName,
        //         tweet: [],
        //         following: [],
        //     }
        // }
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            tweet: [],
            following: [],
        }

        console.log('save data: ', data);

        axios.post('/.json', data)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));
    }

    formSignupHandler = () =>{
        // console.log('button pressed');
        // console.log(this.state);
        const email = this.state.emailText;
        const password = this.state.passwordText;
        const firstName = this.state.firstNameText;
        const lastName = this.state.lastNameText;

        if(firstName && lastName){
            this.updateDatabase(email, firstName, lastName);

            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(email, password);
            promise.catch(e=>{
                console.log(e.message);
                this.setState({errorMessage: e.message});
            });
        }
        else{
            const message = 'First name and last name required.';
            this.setState({errorMessage: message});
        }

    }

    inputTextHandler = (ev, type) =>{
        if(type === 'email'){
            this.setState({ emailText: ev.target.value});
        }
        else if(type === 'firstName') {
            this.setState({ firstNameText: ev.target.value});
        }
        else if(type === 'lastName'){
            this.setState({ lastNameText: ev.target.value});
        }
        else if(type === 'password'){
            this.setState({ passwordText: ev.target.value});
        }
    }


    render() {
        let errorMessage='';
        if(this.state.errorMessage){
            errorMessage = <p className='errorText'>{this.state.errorMessage}</p>;
        }
        const form = <form role='form'>
            <Input
                inputtype='input'
                type='text'
                label='Email'
                onChange={(ev)=>this.inputTextHandler(ev, 'email')}/>
            <Input
                inputtype='input'
                type='text'
                label='First name'
                onChange={(ev)=>this.inputTextHandler(ev, 'firstName')}/>
            <Input
                inputtype='input'
                type='text'
                label='Last name'
                onChange={(ev)=>this.inputTextHandler(ev, 'lastName')}/>
            <Input
                inputtype='input'
                type='password'
                label='Password'
                onChange={(ev)=>this.inputTextHandler(ev, 'password')}/>
            {errorMessage}
            <Button onClick={()=>this.formSignupHandler()} type='button'>Sign Up</Button>
        </form>;

        return (
            <div className='SignUp'>
                {form}
            </div>
        );
    }
}

export default SignUp;