import React, { Component } from 'react';
import { TimerRow } from './TimerRow';

export class TimerSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            isAdminMode: this.props.isAdminMode
        };
        this.updateTimeLeft = this.updateTimeLeft.bind(this);
        this.resetUserTimeOnNewDay = this.resetUserTimeOnNewDay.bind(this);
        this.checkDayPassed = this.checkDayPassed.bind(this);
        this.getFromCookie = this.getFromCookie.bind(this);
        this.setCookie = this.setCookie.bind(this);
        this.DEFAULT_TIME_LEFT = 2.5 * 60 * 60 * 1000;
        //this.DEFAULT_TIME_LEFT = 10000;  // For testing purposes...
    }

    componentDidMount() {
        let users = [{}];
        var usersJson = this.getFromCookie('users');
        if (usersJson) {
            users = JSON.parse(usersJson);
        } else {
            users = [
                {
                    name: "Ethan",
                    timeLeft: this.DEFAULT_TIME_LEFT
                },
                {
                    name: "Noah",
                    timeLeft: this.DEFAULT_TIME_LEFT
                }
            ];
        }

        if (this.checkDayPassed()) {
            users.forEach((user) => user.timeLeft = this.DEFAULT_TIME_LEFT);
        }

        this.setState({
            users: users,
            loaded: true
        });

        setInterval(this.resetUserTimeOnNewDay, 60 * 1000);
    }

    componentDidUpdate(prevProps) {
        if (this.props.isAdminMode !== prevProps.isAdminMode) {
            this.setState({
                isAdminMode: this.props.isAdminMode
            });
        }
    }

    render() {
        if (!this.state.loaded) {
            return <div>Loading...</div>;

        } else {
            return (
                <div>
                    {this.state.users.map((user, index) => {
                        return (
                            <TimerRow key={index}
                                      name={user.name}
                                      timeRemaining={user.timeLeft}
                                      timeUpdated={(t) => { this.updateTimeLeft(user.name, t); }}
                                      isAdminMode={this.state.isAdminMode}
                                      />
                        );
                        }
                    )}
                </div>
            );
        }
    }

    updateTimeLeft(userName, newTimeLeft) {
        var users = JSON.parse(JSON.stringify(this.state.users));
        users.forEach(user => {
            if (user.name === userName) {
                user.timeLeft = newTimeLeft;
            }
        });
        this.setState({users: users});
        this.setCookie('users', JSON.stringify(users));
    }

    resetUserTimeOnNewDay() {
        if (this.checkDayPassed()) {
            var users = JSON.parse(JSON.stringify(this.state.users));
            users.forEach((user) => user.timeLeft = this.DEFAULT_TIME_LEFT);
            this.setState({users: users});
            this.setCookie('users', JSON.stringify(users));
        }
    }

    checkDayPassed() {
        // Would be nice, but also doesn't work in IE11rt
        //var date = new Date().toLocaleDateString();
        var today = new Date();
        var date = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear();
        var dateCookie = this.getFromCookie('day_reset');
        if (dateCookie && dateCookie === date) {
            return false;
        } else {
            this.setCookie('day_reset', date);
            return true;
        }
    }

    getFromCookie(cname) {
        // Would be nice to use this, but WinRT IE11 Metro does not seem to support localStorage :(
        //if (localStorage.hasOwnProperty(cname)) {
        //    return localStorage.getItem(cname);
        //} else {
        //    return false;
        //}

        var name = cname + "=";
        // TODO: also not in IE11rt?:   var decodedCookie = decodeURIComponent(document.cookie);
        var decodedCookie = document.cookie;
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return false;
    }
    
    setCookie(cname, cvalue) {
        // Would be nice to use this, but WinRT IE11 Metro does not seem to support localStorage :(
        //localStorage.setItem(cname, cvalue);
        document.cookie = cname + "=" + cvalue;
    }
};
