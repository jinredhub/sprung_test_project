import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import AllTweets from './pages/AllTweets/AllTweets';

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <div className="App">
                    <Route path='/home' exact component={Home}/>
                    <Route path='/' exact component={Login}/>
                    <Route path='/signup' exact component={SignUp}/>
                    <Route path='/allTweets' exact component={AllTweets}/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
