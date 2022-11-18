import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';
import domtoimage from 'dom-to-image-improved';
import rd3 from 'react-d3-library';
import d3 from "react-d3-library";

class TimePlot extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          data: [],
          counts: [],
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
          showThreshold: false,
          filtered: '',
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
            filtered: species,
         });
    }

    unFilter() {
        this.setState({ 
            data: this.props.counts,
            showThreshold: false,
            filtered: '',
        })
    }

    downloadImage(){
        var node = document.getElementById('plot');
        domtoimage.toPng(node, { bgcolor: '#FFFFFF' })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'CellCounts.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
      }

      renderLegendItemSVG(name, y) {
        return (
            <svg>
                <svg width="14" height="14" y={y-11} viewBox="0 0 32 32" version="1.1" style={{display: "inlineBlock", verticalAlign: "middle", marginRight: "8px"}}>
                    <title></title>
                    <desc></desc>
                    <path stroke="none" fill={this.state.colors[name]} d="M0,4h32v24h-32z" className="recharts-legend-icon"></path>
                </svg>
                <text x="20" y={y}>{name}</text>
            </svg>
        )
      }

      renderLegendSVG() {
        return (
            <svg>
                {this.renderLegendItemSVG('Akashiwo', 10)}
                {this.renderLegendItemSVG('Alexandrium', 28)}
                {this.renderLegendItemSVG('Ceratium', 46)}
                {this.renderLegendItemSVG('Dinophysis', 64)}
                {this.renderLegendItemSVG('Cochlodinium', 82)}
                {this.renderLegendItemSVG('Lingulodinium', 100)}
                {this.renderLegendItemSVG('Prorocentrum', 118)}
                {this.renderLegendItemSVG('PseudoNitzschia', 136)}
                {this.renderLegendItemSVG('Pennate', 154)}
                {this.renderLegendItemSVG('Threshold', 172)}
            </svg>
        );
      }

    render() {

        const renderLegend = (props) => {
            var { payload } = props;
            if (this.state.filtered) {
                payload = payload.filter(c => c.payload.id === this.state.filtered || c.payload.id === 'Threshold');
            }
          
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
                <div className="download-button" onClick={() => this.downloadImage()}>Download</div>
                <div id="plot">
                    <LineChart width={700} height={350} data={this.state.data} ref={(chart) => this.currentChart = chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" height={50} label={{ value: 'Time', position: 'insideBottom' }}>
                        </XAxis>
                        <YAxis label={{ value: 'Cell Count (c/mL)', angle: -90, position: 'insideLeft' }} />
                        <Legend 
                            content={renderLegend}
                            layout="vertical" 
                            verticalAlign="top" 
                            align="right" 
                            wrapperStyle={{margin:'0 -20px', cursor: 'pointer'}} 
                            iconType="rect" 
                            onClick={(label) => this.filterFor(label.dataKey)}>
                        </Legend>
                        <Line type="monotone" className="line" id="Akashiwo" dataKey="Akashiwo" stroke={this.state.colors.Akashiwo} strokeWidth={2} />
                        <Line type="monotone" className="line" id="Alexandrium" dataKey="Alexandrium_singlet" stroke={this.state.colors.Alexandrium} strokeWidth={2}/>
                        <Line type="monotone" className="line" id="Ceratium" dataKey="Ceratium" stroke={this.state.colors.Ceratium} strokeWidth={2}/>
                        <Line type="monotone" className="line" id="Dinophysis" dataKey="Dinophysis" stroke={this.state.colors.Dinophysis} strokeWidth={2}/>
                        <Line type="monotone" className="line" id="Cochlodinium" dataKey="Cochlodinium" stroke={this.state.colors.Cochlodinium} strokeWidth={2}/>
                        <Line type="monotone" className="line" id="Lingulodinium" dataKey="Lingulodinium" stroke={this.state.colors.Lingulodinium} strokeWidth={2}/>
                        <Line type="monotone" className="line" id="Prorocentrum" dataKey="Prorocentrum" stroke={this.state.colors.Prorocentrum} strokeWidth={2}/>
                        <Line type="monotone" className="line" id="Pseudo-Nitzschia" dataKey="Pseudo-nitzschia" stroke={this.state.colors.PseudoNitzschia} strokeWidth={2}/>
                        <Line type="monotone" className="line" id="Pennate" dataKey="Pennate" stroke={this.state.colors.Pennate} strokeWidth={2}/>
                        {
                            this.state.showThreshold ?
                            <Line type="monotone" className="line" id="Threshold" dataKey="Threshold" name="Warning Threshold" stroke={this.state.colors.Threshold} strokeWidth={2} dot={false}/> :
                            <div/>
                        }
                    </LineChart>
                </div>
            </div>
        );
    }
}

export default (TimePlot);