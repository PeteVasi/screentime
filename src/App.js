import React, { Component } from 'react';
import { TimerSet } from './TimerSet';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAdminMode: false,
            inputPin: ""
        };
        this.adminMode = this.adminMode.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Screen Time</h1>
                </header>
                <TimerSet isAdminMode={this.state.isAdminMode}/>
                <br />
                <br />
                <br />
                <div className="admin-area">
                    <input type="password" name="pinCode" value={this.state.inputPin} onChange={this.handleChange} />
                    <button onClick={this.adminMode}>{this.state.isAdminMode ? "Done" : "Edit"}</button>
                </div>
            </div>
        );
    }

    handleChange(event) {
        this.setState({inputPin: event.target.value});
    }

    adminMode() {
        if(this.state.isAdminMode)  {
            this.setState({isAdminMode: false, inputPin: ""});
        } else if(this.state.inputPin === "45152") {
            this.setState({isAdminMode: true, inputPin: ""});
        }
    }
}

export default App;
