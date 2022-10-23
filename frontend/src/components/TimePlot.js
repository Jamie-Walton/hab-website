import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';

class TimePlot extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          data: [],
          counts: [],
          showThreshold: false,
      }
    }

    componentDidMount() {
        this.setState({ data: this.props.counts });
    }

    filterFor(species) {
        const data = this.props.counts.map(t => ({ name: t.name, [species]: t[species], Threshold: this.props.thresholds[species] }))
        this.setState({ 
            data: data,
            showThreshold: true,
         });
    }

    unFilter() {
        this.setState({ 
            data: this.props.counts,
            showThreshold: false,
        })
    }

    render() {

        const renderLegend = (props) => {
            const { payload } = props;
          
            return (
            <div>
                <p className="filter-label">Select a species to filter.</p>
                <ul className="recharts-default-legend" style={{padding: "0px", margin: "0px", textAlign: "left"}}>
                    {
                    payload.map((entry, index) => (
                        <li className="recharts-legend-item" key={`item-${index}`} onClick={() => this.filterFor(entry.value)}>
                            <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inlineBlock", verticalAlign: "middle", marginRight: "8px"}}>
                                <title></title>
                                <desc></desc>
                                <path stroke="none" fill={entry.color} d="M0,4h32v24h-32z" className="recharts-legend-icon"></path>
                            </svg>
                            {entry.value}
                        </li>
                    ))
                    }
                </ul>
                {this.state.showThreshold ? <p className="unfilter-button" onClick={() => this.unFilter()}>{'<    Back to All'}</p> : <div/>}
              </div>
            );
          }

        return (
            <div>
                <LineChart width={700} height={350} data={this.state.data} ref={(chart) => this.currentChart = chart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" height={50} label={{ value: 'Time', position: 'insideBottom' }}>
                    </XAxis>
                    <YAxis label={{ value: 'Cell Count (c/L)', angle: -90, position: 'insideLeft' }} />
                    <Legend 
                        content={renderLegend}
                        layout="vertical" 
                        verticalAlign="top" 
                        align="right" 
                        wrapperStyle={{margin:'0 -20px', cursor: 'pointer'}} 
                        iconType="rect" 
                        onClick={(label) => this.filterFor(label.dataKey)}>
                    </Legend>
                    <Line type="monotone" className="line" id="Akashiwo" dataKey="Akashiwo" stroke="#3c32a8" strokeWidth={2} />
                    <Line type="monotone" className="line" id="Alexandrium" dataKey="Alexandrium" stroke="#3252a8" strokeWidth={2}/>
                    <Line type="monotone" className="line" id="Ceratium" dataKey="Ceratium" stroke="#3275a8" strokeWidth={2}/>
                    <Line type="monotone" className="line" id="Dinophysis" dataKey="Dinophysis" stroke="#3299a8" strokeWidth={2}/>
                    <Line type="monotone" className="line" id="Cochlodinium" dataKey="Cochlodinium" stroke="#32a88d" strokeWidth={2}/>
                    <Line type="monotone" className="line" id="Lingulodinium" dataKey="Lingulodinium" stroke="#32a869" strokeWidth={2}/>
                    <Line type="monotone" className="line" id="Prorocentrum" dataKey="Prorocentrum" stroke="#36a832" strokeWidth={2}/>
                    <Line type="monotone" className="line" id="Pseudo-Nitzschia" dataKey="Pseudo-Nitzschia" stroke="#6da832" strokeWidth={2}/>
                    <Line type="monotone" className="line" id="Pennate" dataKey="Pennate" stroke="#99a832" strokeWidth={2}/>
                    {
                        this.state.showThreshold ?
                        <Line type="monotone" className="line" id="Threshold" dataKey="Threshold" name="Warning Threshold" stroke="#ba261c" strokeWidth={2} dot={false}/> :
                        <div/>
                    }
                </LineChart>
            </div>
        );
    }
}

export default (TimePlot);