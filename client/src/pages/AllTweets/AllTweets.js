import React, { Component } from 'react';
import './AllTweets.css';
import * as firebase from "firebase";
import axios from "../../axios";
import moment from 'moment';

import Tweet from '../../components/Tweet/Tweet';

class AllTweets extends Component {
    state = {
        loginEmail: '',
        allUsers: [
            {
                email: 'jin@nieblo.com',
                firstName: 'Jin',
                lastName: 'Redmond',
                tweets: [
                    {created_at: '2019-12-09T15:56:09-08:00', message: 'hihihi', firstName: 'Jin', lastName: 'Redmond'},

                ],
                following: ['mike@nieblo.com', 'shimano@nieblo.com'],
            },
            {
                email: 'mike@nieblo.com',
                firstName: 'mike',
                lastName: 'cheal',
                tweets: [],
                following: [],
            },
            {
                email: 'shimano@nieblo.com',
                firstName: 'shimano',
                lastName: 'koji',
                tweets: [
                    {created_at: '2019-02-09T15:56:09-08:00', message: 'hhhhhhhh'},
                    {created_at: '2018-02-09T15:56:09-08:00', message: 'ppppppp'},
                ],
                following: [],
            },
            {
                email: 'testmail@test.com',
                firstName: 'testFirst',
                lastName: 'testLast',
                tweets: [
                    {created_at: '2019-02-09T15:56:09-08:00', message: 'kkkkkk'},
                ],
                following: [],
            },

        ],
    };

    componentDidMount(){

        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                this.setState({ loginEmail: firebaseUser.email });

                const user = firebase.auth().currentUser;
                console.log('current user: ', user);
                this.loadDatabase();
            }
            else{
                const url = '/';
                window.location.href = url;
                console.log('not logged in');
            }
        });
    }

    loadDatabase = () =>{
        console.log('loading database');

        // axios.get('/.json')
        //     .then(res=>{
        //         console.log('load: ',res.data);
        //         this.setState({allUsers: res.data});
        //     })
        //     .catch(err=>console.log(err));
        //
        // console.log('loading database');

        axios.get('/.json')
            .then(res=>{
                console.log('load: ',res.data);

                // firebase won't store empty array, so create empty array here
                for(let user of res.data.allUsers){
                    if(!user.tweets){
                        user.tweets = [];
                    }
                    if(!user.following){
                        user.following = [];
                    }
                }
                console.log('new res.data: ', res.data);
                this.setState({allUsers: res.data.allUsers});
            })
            .catch(err=>console.log(err));

    }

    render(){

        // render tweets
        let allTweets = <p>You don't have any tweet</p>;
        const allUsers = this.state.allUsers;
        const loginEmail = this.state.loginEmail;
        let tweets = [];

        for(let user of allUsers){
            if(user.email === loginEmail){
                tweets = user.tweets;
            }
        }

        console.log('tweets:',tweets);

        // format date/time
        // console.log('sorted tweets: ', tempArray);
        const tempArray = tweets.map(tweet=>{
            return {
                firstName: tweet.firstName,
                lastName: tweet.lastName,
                message: tweet.message,
                created_at: moment(tweet.created_at),
            }
        });
        // console.log('sorted tweets: ', tempArray);
        const formattedTime = tempArray.map(tweet=>{
            return {
                firstName: tweet.firstName,
                lastName: tweet.lastName,
                message: tweet.message,
                created_at: tweet.created_at.format('MM/DD/YYYY'),
            }
        });
        // console.log('format: ', formattedTime);

        if(tweets.length){
            allTweets = formattedTime.map(val=>{
                return <Tweet
                    firstName={val.firstName}
                    message={val.message}
                    time={val.created_at}
                    key={val.created_at}/>
            });
        }

        return(
            <div className='AllTweets'>
                <a href="/home">Back</a>
                {allTweets}
            </div>
        )
    }
}

export default AllTweets;