import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

class ClassPlot extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          key: 1,
          colors: {
            Akashiwo: '#b86c02',
            Alexandrium_singlet: '#ba9b02',
            Ceratium: '#4bb802',
            Dinophysis: '#02bd8b',
            Cochlodinium: '#02bab1',
            Lingulodinium: '#027dba',
            Prorocentrum: '#022dba',
            Pseudo_nitzschia: '#5b02ba',
            Pennate: '#b702ba',
            Threshold: '#ba023c',
            Total: '#cfd2d4'
        },
      }
    }

    render() {

        return (
            <div>
                <h5>{this.props.name}</h5>
                <div id="plot">
                    <LineChart width={275} height={150} data={this.props.data} key={this.props.key} ref={(chart) => this.currentChart = chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            key={this.props.key} 
                            dataKey="name"
                            height={50}
                            tickCount={26}
                            interval={0}
                            type="number"
                            hide={true}
                            domain={[0,604800]}>
                        </XAxis>
                        <YAxis key={this.props.key} label={{ value: 'Cell Count (c/mL)', angle: -90, position: 'center' }} />
                        <Line type="monotone" className="line" dot={false} id={this.props.name} dataKey={this.props.name} isAnimationActive={false} stroke={this.state.colors[this.props.name]} strokeWidth={2} />
                        <Line type="monotone" className="line" dot={false} id="Threshold" dataKey="Threshold" stroke={this.state.colors.Threshold} strokeWidth={2} dot={false}/>
                    </LineChart>
                    {this.props.days.length > 0 ?
                    <div className='day-axis mini'>
                        <p className='axis-label mini-text'>{this.props.days[0].slice(0,5)}</p>
                        <p className='axis-label mini-text'>{this.props.days[1].slice(0,5)}</p>
                        <p className='axis-label mini-text'>{this.props.days[2].slice(0,5)}</p>
                        <p className='axis-label mini-text'>{this.props.days[3].slice(0,5)}</p>
                        <p className='axis-label mini-text'>{this.props.days[4].slice(0,5)}</p>
                        <p className='axis-label mini-text'>{this.props.days[5].slice(0,5)}</p>
                        <p className='axis-label mini-text'>{this.props.days[6].slice(0,5)}</p>
                    </div> : <div/> }
                    <div className='day-axis axis-name-container mini'>
                        <p className='axis-name'>Date</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default (ClassPlot);