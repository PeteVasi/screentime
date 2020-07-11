import React, { Component } from 'react';
import { TimerSet } from './TimerSet';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Screen Time</h1>
                </header>
                <TimerSet />
            </div>
        );
    }
}

export default App;
