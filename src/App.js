import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Route path='/home' exact component={Home}/>
                    <Route path='/' exact component={Login}/>
                    <Route path='/singup' exact component={SignUp}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
