import React, { Component } from 'react';
import AreaDifferenceSeriesExample from './AreaDifferenceSeriesExample';
import CircleUI from 'react-circle';
import { Polygon } from '@vx/shape';
import { Group } from '@vx/group';
import { GradientPinkRed, GradientPurpleOrange } from '@vx/gradient';
import { scaleBand } from '@vx/scale';
import { color as colors, allColors } from '@data-ui/theme';
import socketIoClient from 'socket.io-client';

//import { realTimeEnv } from './data';

import './App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            items_now: [],
            items_new: [],
            index: 0,
            items_changes: {},
            realTimeEnv: [],
        };
    }

    componentDidMount() {
        const endpoint_real = 'http://127.0.0.1:3002';
        const endpoint_score = 'http://104.215.112.105:30678';
        const endpoint_suggest = '';
        let socket_real = socketIoClient(endpoint_real);
        let socket_suggest = socketIoClient(endpoint_suggest);
        let socket_score = socketIoClient(endpoint_score);
        socket_real.on('realTimeEnv', (realTimeEnv) => {
            this.setState({ realTimeEnv: realTimeEnv });
            socket_score.emit('update', { humid: realTimeEnv[2], temperature: realTimeEnv[1] });
        });
        socket_score.on('update', (data) => {
            console.log('score: ' + data);
            this.setState({ items_now: this.state.items_now.concat([data]) });
        });

        socket_suggest.on('suggest', (suggest) => {
            console.log(suggest);
            socket_score.emit('new', { humid: this.state.realTimeEnv[2] + suggest.humid, temperature: this.state.realTimeEnv[1] + suggest.temperature });
        });

        socket_score.on('new', (data) => {
            console.log(data);
            this.setState({ items_new: this.state.items_new.concat([data]) });
            let change = {};
            for (var key in data) {
                change[key] = data[key] - this.state.items_now[this.state.index];
            }
            this.setState({ index: this.state.index + 1 });
        });

        console.log('socket!');
        /* world is an array of object */
    }

    render() {
        //console.log(realTimeEnv);
        const items = [{}, {}, {}, {}, {}, {}, {}, {}];
        return (
            <div className="App">
                <div style={{ width: '100%', marginLeft: '11%', marginTop: '50px' }}>
                    <Circle font_color="Gray" background_color={allColors.blue[1]} text={this.state.realTimeEnv[3]} item="PM2.5" />
                    <Circle font_color="Gray" background_color={allColors.blue[1]} text={this.state.realTimeEnv[1]} item="Temperature" />
                    <Circle font_color="Gray" background_color={allColors.blue[1]} text={this.state.realTimeEnv[2]} item="Humidity" />
                    <div style={{ float: 'left', margin: '50px' }}>
                        <CircleUI
                            animate={true} // Boolean: Animated/Static progress
                            animationDuration="1s" // String: Length of animation
                            responsive={false} // Boolean: Make SVG adapt to parent size
                            size="170" // String: Defines the size of the circle.
                            lineWidth="25" // String: Defines the thickness of the circle's stroke.
                            progress="70" // String: Update to change the progress and percentage.
                            progressColor={allColors.blue[2]} // String: Color of "progress" portion of circle.
                            bgColor="#ecedf0" // String: Color of "empty" portion of circle.
                            textColor="#6b778c" // String: Color of percentage text color.
                            textStyle={{
                                font: 'bold 4rem Helvetica, Arial, sans-serif', // CSSProperties: Custom styling for percentage.
                            }}
                            percentSpacing={10} // Number: Adjust spacing of "%" symbol and number.
                            roundedStroke={false} // Boolean: Rounded/Flat line ends
                            showPercentage={true} // Boolean: Show/hide percentage.
                            showPercentageSymbol={true} // Boolean: Show/hide only the "%" symbol.
                        />
                        <div style={{ fontSize: '20px', marginTop: '15px' }}>filter</div>
                    </div>
                </div>
                <div style={{ position: 'relative' }}>
                    <AreaDifferenceSeriesExample />
                </div>
                <div style={{ position: 'relative', top: '-40px' }}>
                    <div>
                        <Attribute items={items} width="600" height="320" />
                        <Score height="360" width="360" />
                    </div>
                </div>
            </div>
        );
    }
}

class Circle extends Component {
    render() {
        return (
            <div style={{ float: 'left', margin: '50px' }}>
                <div
                    style={{
                        width: '170px',
                        height: '170px',
                        borderRadius: '50%',
                        fontSize: '50px',
                        lineHeight: '170px',
                        color: this.props.font_color,
                        textAlign: 'center',
                        background: this.props.background_color,
                    }}
                >
                    {this.props.text}
                </div>
                <div style={{ fontSize: '20px', marginTop: '20px' }}>{this.props.item}</div>
            </div>
        );
    }
}

class Attribute extends Component {
    render() {
        const height = this.props.height;
        const width = this.props.width;
        const center_dif = { y: height / 4, x: width / 8 };
        const center_pos = { y: center_dif.y, x: center_dif.x };
        this.props.items.forEach((ele, i) => {
            console.log(i);
            const row = Math.floor(i / 4);
            const col = i % 4;
            console.log('row: ' + row);
            console.log('col: ' + col);
            ele.pos = { y: center_pos.y + center_dif.y * row * 2, x: center_pos.x + center_dif.x * col * 2 };
            console.log('pos: ' + ele.pos.x + ' ' + ele.pos.y);
            ele.fill = '#7f82e3';
        });
        return (
            <svg height={height} width={width}>
                <rect x={0} y={0} width={1200} height={800} fill="white" rx={14} />
                {this.props.items.map((elem) => (
                    <svg>
                        <Polygon center={elem.pos} sides={8} size={50} fill={allColors.blue[1]} rotate={0} />
                        <text x={elem.pos.x} y={elem.pos.y + 8} text-anchor="middle" fill="DarkGray" font-size="30">
                            hi
                        </text>
                        <text x={elem.pos.x} y={elem.pos.y + 80} text-anchor="middle" fill="gray" font-size="20">
                            helldddo
                        </text>
                    </svg>
                ))}
            </svg>
        );
    }
}

class Score extends Component {
    render() {
        const pos = { x: this.props.width / 2, y: this.props.height / 2 };
        return (
            <svg height={this.props.height} width={this.props.width}>
                <Polygon center={pos} sides={8} size={100} fill={allColors.pink[1]} rotate={0} />
                <text x={pos.x} y={pos.y + 10} text-anchor="middle" fill="DarkGray" font-size="40">
                    Hi
                </text>
            </svg>
        );
    }
}

export default App;
