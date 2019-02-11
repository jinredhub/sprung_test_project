import React, { Component } from 'react';
import './Home.css';
import * as firebase from "firebase";
import moment from 'moment';
import axios from '../../axios';

import Tweet from '../../components/Tweet/Tweet';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import PeopleToFollow from '../../components/PeopleToFollow/PeopleToFollow';
import {database} from "../../firebase";


class Home extends Component {
    state = {
        loginEmail: '',
        nweTweet: '',
        followingTweets: [],
        allUsers: [
             {
                email: 'jin@nieblo.com',
                firstName: 'Jin',
                lastName: 'Redmond',
                tweets: [],
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
                    {created_at: '2019-01-09T15:56:09-08:00', message: 'kkkkkk'},
                ],
                following: [],
            },

        ],
    };

    componentDidMount(){

        firebase.auth().onAuthStateChanged(firebaseUser =>{
            if(firebaseUser){
                this.setState({ loginEmail: firebaseUser.email });

                // const user = firebase.auth().currentUser;
                // console.log('current user: ', user);
                this.loadDatabase(firebaseUser.email);
                // this.storeTweetsYouFollow(firebaseUser.email);
            }
            else{
                const url = '/';
                window.location.href = url;
                console.log('not logged in');
            }
        });
    }

    loadDatabase = (email) =>{
        // console.log('loading database');

        axios.get('/.json')
            .then(res=>{
                // console.log('load: ',res.data);

                // firebase won't store empty array, so create empty array here
                for(let user of res.data.allUsers){
                    if(!user.tweets){
                        user.tweets = [];
                    }
                    if(!user.following){
                        user.following = [];
                    }
                }
                // console.log('new res.data: ', res.data);
                this.setState({allUsers: res.data.allUsers});
                this.storeTweetsYouFollow(email);
            })
            .catch(err=>console.log(err));
    }

    updateDatabase = () =>{
        // console.log('allusers: ', allUsers);

        const data = this.state.allUsers;
        database.ref("-LYQMvCCcIhXxVdiPSvW").set({allUsers: data});
    }

    logOutHandler = () =>{
        console.log('logging out');
        firebase.auth().signOut();
    }

    storeTweetsYouFollow = (loginEmail) =>{
        // console.log(loginEmail);
        const tweets = [];
        let listOfEmailYouFollow = [];
        const allUsers = this.state.allUsers;

        // list of email you follow
        for(let user of allUsers){
            if(user.email === loginEmail){
                listOfEmailYouFollow = user.following;
            }
        }

        // find users following
        let usersFollowing = allUsers.filter(user=>{
            return listOfEmailYouFollow.includes(user.email);
        });

        // save tweets you follow
        for(let user of usersFollowing){
            if(user.tweets.length){
                for(let tweet of user.tweets){
                    tweets.push({
                        ...tweet,
                        firstName : user.firstName,
                        lastName : user.lastName,
                    });
                }
            }
        }

        // console.log('tweets', tweets);

        const tempArray = [];
        for(let tweet of tweets){
            const newObj = {};
            newObj.firstName = tweet.firstName;
            newObj.lastName = tweet.lastName;
            newObj.message = tweet.message;
            newObj.created_at = moment(tweet.created_at);
            tempArray.push(newObj);
        }

        // sort tweet by date/time
        tempArray.sort((left, right) =>{
            return right.created_at.diff(left.created_at);
        });

        // format date/time
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

        this.setState({followingTweets: formattedTime});
    }

    changeCurrentTweetHandler = (ev) =>{
        const newTweet = ev.target.value;
        this.setState({newTweet: newTweet});
    }

    createNewTweetHandler = () =>{
        const loginEmail = this.state.loginEmail;
        if(this.state.newTweet && this.state.loginEmail){
            const allUsers = this.state.allUsers;
            const today = moment().format();
            // console.log(today);

            // add new tweet and time
            for(let user of allUsers){
                if(user.email === loginEmail){
                    user.tweets.push({
                        message: this.state.newTweet,
                        created_at: today,
                        firstName: user.firstName,
                        lastName: user.lastName,
                    });
                }
            }
            // allUsers[loginEmail]['tweets'].push({
            //    message: this.state.newTweet,
            //     created_at: today,
            // });

            this.setState({
                allUsers: allUsers,
                newTweet: '',
            });
            console.log('allUsers: ',allUsers);

            this.updateDatabase(allUsers);
        }
    }

    followUserHandler = (email) =>{
        const loginEmail = this.state.loginEmail;
        const allUsers = this.state.allUsers;
        // console.log('before: ', email);
        // console.log('before', allUsers[0]);

        for(let user of allUsers){
            // find your own data
            if(user.email === loginEmail){
                user.following.push(email);
            }
        }
        this.setState({allUsers: allUsers});
        // console.log('================================');
        // console.log('allusers: ',allUsers[0]);

        this.storeTweetsYouFollow(loginEmail);
        this.updateDatabase();
    }

    render() {
        // render tweets of users that you follow
        let followingTweets = <p>No tweet to display</p>;
        // console.log(this.state.allUsers[0].following);
        // console.log('=====================:',this.state.followingTweets);
        if(this.state.followingTweets.length){
            followingTweets = this.state.followingTweets.map((val, i)=>{
                return <Tweet
                    firstName={val.firstName}
                    lastName={val.lastName}
                    message={val.message}
                    time={val.created_at}
                    key={i}/>
            });
        }

        const createTweetContainer = <div>
                                        <Input
                                            placeholder='tweet...'
                                            type='text'
                                            inputtype='textarea'
                                            onChange={(ev)=>this.changeCurrentTweetHandler(ev)}
                                            value={this.state.newTweet}
                                            rows='1'/>
                                        <Button
                                            type='text'
                                            onClick={this.createNewTweetHandler}>Create</Button>
                                    </div>;

        // render other users (people to follow)
        const loginEmail = this.state.loginEmail;
        let listOfPeopleToFollow = <p>No other users</p>;
        if(loginEmail){
            const allUsers = this.state.allUsers;
            let followingUsers = [];

            // find users you follow
            for(let user of allUsers){
                if(user.email === loginEmail){
                    followingUsers = user.following;
                }
            }
            // console.log('======', followingUsers);

            // find users you don't follow
            let unFollwingUsers = allUsers.filter(user=>{
                return !followingUsers.includes(user.email);
            });
            // remove yourself
            unFollwingUsers = unFollwingUsers.filter(user=>user.email !== loginEmail);
            // console.log('leftover: ', unFollwingUsers);

            if(unFollwingUsers.length){
                listOfPeopleToFollow = unFollwingUsers.map((val, i)=>{
                    return (
                        <PeopleToFollow
                            email={val.email}
                            firstName={val.firstName}
                            lastName={val.lastName}
                            key={i}
                            clicked={this.followUserHandler.bind(this, val.email)}/>
                    )
                });
            }
        }

        // login user's info container
        let userInfoContainer = '';

        if(loginEmail){
            const allUsers = this.state.allUsers;
            let firstName = '';
            let lastName = '';
            let numberOfTweets = 0;
            let numberOfFollowing = 0;
            for(let user of allUsers){
                if(user.email === loginEmail){
                    firstName = user.firstName;
                    lastName = user.lastName;
                    numberOfTweets = user.tweets.length;
                    numberOfFollowing = user.following.length;
                }
            }
            userInfoContainer = <div className='userInfoContainer'>
                                    <h2>{firstName} {lastName}</h2>
                                    <div className='userDetailContainer'>
                                        <div className="width-50">
                                            <div><a href='/allTweets'>Tweets</a></div>
                                            {numberOfTweets}
                                        </div>
                                        <div className="width-50">
                                            <div>Following</div>
                                            {numberOfFollowing}
                                        </div>
                                    </div>
                              </div>;

        }

        return (
            <div className="Home">
                <div className='nav'>
                    <Button type='button' onClick={this.logOutHandler}>Log Out</Button>
                </div>
                <div className='pageContainer'>
                    <div className="flex-33">
                        {userInfoContainer}
                        <div className='peopleToFollowContainer'>
                            {listOfPeopleToFollow}
                        </div>
                    </div>
                    <div className="flex-66">
                        {createTweetContainer}
                        <div className='tweetsContainer'>
                            {followingTweets}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
