import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

class ClassPlot extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          key: 1,
          colors: {
            Akashiwo: '#eb9902',
            Alexandrium_singlet: '#ebc802',
            Ceratium: '#97b504',
            Dinophysis: '#15b504',
            Cochlodinium: '#02bab1',
            Lingulodinium: '#0282de',
            Prorocentrum: '#1902c9',
            Pseudo_nitzschia: '#8e02c9',
            Pennate: '#c902af',
            Threshold: '#ba023c',
            Total: '#cfd2d4'
        },
      }
    }

    render() {

        return (
            <div>
                <h5>{this.props.name === "Alexandrium_singlet" ? "Alexandrium" : this.props.name.replace("_", "-")}</h5>
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
                        <YAxis key={this.props.key} label={{ value: 'Cell Count (c/L)', angle: -90, position: 'center' }} />
                        <Line type="monotone" className="line" dot={false} id={this.props.name} dataKey={this.props.name} isAnimationActive={false} stroke={this.state.colors[this.props.name]} strokeWidth={1} />
                        <Line type="monotone" className="line" dot={false} id="Threshold" dataKey="Threshold" stroke={this.state.colors.Threshold} strokeWidth={2} dot={false}/>
                    </LineChart>
                    {this.props.days.length > 0 ?
                    <div className='day-axis mini'>
                        {this.props.days.map((day) => <p className='axis-label mini-text'>{day.slice(0,5)}</p>)}
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