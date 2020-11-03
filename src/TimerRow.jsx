import React, { Component } from 'react';
import moment from 'moment';

export class TimerRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            remaining: this.props.timeRemaining,
            elapsed: 0,
            isRunning: false,
            isJustExpired: false,
            isExpired: (this.props.timeRemaining <= 0),
            isAdminMode: this.props.isAdminMode
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.plus10 = this.plus10.bind(this);
        this.minus10 = this.minus10.bind(this);
        this.tick = this.tick.bind(this);
        this.confirmExpired = this.confirmExpired.bind(this);
    }

    componentWillUnmount() {
        // This method is called immediately before the component is removed from the page and destroyed.
        clearInterval(this.timer);
    }

    componentDidUpdate(prevProps) {
        if (!this.state.isRunning && (this.props.timeRemaining !== prevProps.timeRemaining || this.props.isAdminMode !== prevProps.isAdminMode)) {
            this.setState({
                remaining: this.props.timeRemaining,
                elapsed: 0,
                isRunning: false,
                isJustExpired: false,
                isExpired: (this.props.timeRemaining <= 0),
                isAdminMode: this.props.isAdminMode
            });
        }
    }

    render() {
        var remains = moment.utc(this.state.remaining - this.state.elapsed).format("H:mm:ss");
        return (
            <div className='timer-row'>
                <div className='timer-name'>{this.props.name}:</div>
                {!this.state.isExpired
                        ? <div className='timer-remains'>{remains}</div>
                        : <div className='timer-timeup'>Time's up!</div>}
                {!this.state.isExpired &&
                    <div className='timer-buttons'>
                        <button onClick={this.startTimer} disabled={this.state.isRunning}>Start</button>
                        <button onClick={this.stopTimer} disabled={!this.state.isRunning}>Stop</button>
                    </div>
                }
                {this.state.isJustExpired &&
                    <div className='timer-buttons'>
                        <button onClick={this.confirmExpired}>Ok</button>
                    </div>
                }
                {this.state.isAdminMode &&
                    <div className='timer-buttons'>
                        <button onClick={this.minus10}>-10</button>
                        <button onClick={this.plus10}>+10</button>
                    </div>
                }
            </div>
        );
    }

    startTimer() {
        this.setState({start: Date.now(), isRunning: true});
        this.timer = setInterval(this.tick, 100);
    }

    stopTimer() {
        clearInterval(this.timer);
        var remains = this.state.remaining - this.state.elapsed;
        this.setState({remaining: remains, elapsed: 0, isRunning: false});
    }

    plus10() {
        var remains = this.state.remaining + (10 * 60 * 1000);
        this.setState({remaining: remains, elapsed: 0});
        if(this.props.timeUpdated) {
            this.props.timeUpdated(remains);
        }
    }

    minus10() {
        var remains = this.state.remaining - (10 * 60 * 1000);
        this.setState({remaining: (remains < 0 ? 0 : remains), elapsed: 0});
        if(this.props.timeUpdated) {
            this.props.timeUpdated(remains < 0 ? 0 : remains);
        }
    }

    tick() {
        var elapsed = new Date() - this.state.start;
        if(this.state.remaining - elapsed <= 0) {
            clearInterval(this.timer);
            this.setState({
                remaining: 0,
                elapsed: 0,
                isRunning: false,
                isExpired: true,
                isJustExpired: true
            });
            if(this.props.timeUpdated) {
                this.props.timeUpdated(0);
            }
        } else {
            this.setState({elapsed: elapsed});
            if(this.props.timeUpdated) {
                this.props.timeUpdated(this.state.remaining - elapsed);
            }
        }
    }

    confirmExpired() {
        this.setState({isJustExpired: false});
    }
};
