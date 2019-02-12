import React, { Component } from 'react';
import './Login.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import * as firebase from "firebase";


class Login extends Component {
    state = {
        errorMessage: '',
        emailText: '',
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
            }
        });
    }

    formLoginHandler = () =>{
        // console.log('button pressed');
        // console.log(this.state);
        const email = this.state.emailText;
        const password = this.state.passwordText;
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e=>{
            console.log(e.message);
            this.setState({errorMessage: e.message});
        });
    }

    // formSignupHandler = () =>{
    //     console.log('button pressed');
    //     console.log(this.state);
    //     const email = this.state.emailText;
    //     const password = this.state.passwordText;
    //     const auth = firebase.auth();
    //     const promise = auth.createUserWithEmailAndPassword(email, password);
    //     promise.catch(e=>console.log(e.message));
    //
    // }

    inputTextHandler = (ev, type) =>{
        if(type === 'username'){
            this.setState({ emailText: ev.target.value});
        }
        else {
            this.setState({ passwordText: ev.target.value});
        }
    }

    render() {
        let errorMessage='';
        if(this.state.errorMessage){
            errorMessage = <p className='errorText'>{this.state.errorMessage}</p>;
        }
        const form = <form>
                        <Input
                            inputtype='input'
                            type='text'
                            label='Username'
                            onChange={(ev)=>this.inputTextHandler(ev, 'username')}/>
                        <Input
                            inputtype='input'
                            type='password'
                            label='Password'
                            onChange={(ev)=>this.inputTextHandler(ev, 'password')}/>
                        {errorMessage}
                        <Button onClick={()=>this.formLoginHandler()} type='button'>Log In</Button>
                        <div className='linkContainer'>
                            <div>or</div>
                            <a id='signupLink' href="/signup">Sign Up</a>
                        </div>
                    </form>;

        return (
                <div className="Login">
                    {form}
                </div>
        );
    }
}

export default Login;
