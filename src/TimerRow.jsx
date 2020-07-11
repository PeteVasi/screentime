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
            isExpired: (this.props.timeRemaining <= 0)
        };
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.tick = this.tick.bind(this);
        this.confirmExpired = this.confirmExpired.bind(this);
    }

    componentWillUnmount() {
        // This method is called immediately before the component is removed from the page and destroyed.
        clearInterval(this.timer);
    }

    componentDidUpdate(prevProps) {
        if (!this.state.isRunning && this.props.timeRemaining !== prevProps.timeRemaining) {
            this.setState({
                remaining: this.props.timeRemaining,
                elapsed: 0,
                isRunning: false,
                isJustExpired: false,
                isExpired: (this.props.timeRemaining <= 0)
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
