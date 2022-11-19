import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

class ClassPlot extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          key: 1,
          colors: {
              Akashiwo: '#9bad10',
              Alexandrium: '#51ad10',
              Ceratium: '#10ad1a',
              Dinophysis: '#10ad79',
              Cochlodinium: '#10adab',
              Lingulodinium: '#106cad',
              Prorocentrum: '#1034ad',
              PseudoNitzschia: '#6910ad',
              Pennate: '#8e10ad',
              Threshold: '#ad10a6',
          },
      }
    }

    render() {

        return (
            <div>
                <h5>{this.props.name}</h5>
                <div id="plot">
                    <LineChart width={350} height={175} data={this.props.data} key={this.props.key} ref={(chart) => this.currentChart = chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis key={this.props.key} dataKey="name" height={50} label={{ value: 'Time', position: 'insideBottom' }}>
                        </XAxis>
                        <YAxis key={this.props.key} label={{ value: 'Cell Count (c/mL)', angle: -90, position: 'center' }} />
                        <Line type="monotone" className="line" id={this.props.name} dataKey={this.props.name} isAnimationActive={false} stroke={this.state.colors[this.props.name]} strokeWidth={2} />
                        <Line type="monotone" className="line" id="Threshold" dataKey="Threshold" stroke={this.state.colors.Threshold} strokeWidth={2} dot={false}/> :
                    </LineChart>
                </div>
            </div>
        );
    }
}

export default (ClassPlot);