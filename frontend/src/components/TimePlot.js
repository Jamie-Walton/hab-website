import React, { PureComponent } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';
import domtoimage from 'dom-to-image-improved';
import ClassPlot from "./ClassPlot";


class CustomizedAxisTick extends PureComponent {
    render() {
      const { x, y, stroke, payload } = this.props;
      var i = this.props.ticks.indexOf(payload.value);
      var label = '';
      if (this.props.days[i]) {
          label = this.props.days[i].slice(0,5);
      }

      if (this.props.ticks.length > 20) {
          var filtered = this.props.ticks.filter((t,j) => (j%2==0));
          if (filtered.includes(payload.value)) {
              label = this.props.days[i].slice(0,5);
          } else {
              label = '';
          }
      }

        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
                {label}
                </text>
            </g>
            );
    }
  }

class TimePlot extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          data: [],
          ticks: [],
          key: 1,
          colors: {
            Akashiwo: '#eb9902',
            Alexandrium: '#ebc802',
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
          showThreshold: false,
          showTotal: true,
          filtered: '',
      }
    }

    componentDidMount() {
        this.setState({ 
            data: this.props.counts,
        });
    }

    filterFor(species) {
        if(species=='Alexandrium') {
            var species = 'Alexandrium_singlet';
        }
        const data = this.props.counts.map(t => ({ name: t.name, [species]: t[species], timestamp: t.timestamp, Threshold: this.props.thresholds[species] }))
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

      toggleTotal() {
          this.unFilter();
          this.setState({ showTotal: !(this.state.showTotal) });
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
                {this.renderLegendItemSVG('Pseudo_nitzschia', 136)}
                {this.renderLegendItemSVG('Pennate', 154)}
                {this.renderLegendItemSVG('Threshold', 172)}
            </svg>
        );
      }

    render() {
        
        const CustomTooltip = ({ active, payload, label }) => {
            if (active && payload && payload.length) {
                return (
                <div className="custom-tooltip">
                    <p className="label">{`${payload[0].payload.timestamp}`}</p>
                    {this.state.filtered ?
                    <p className="desc">{`${this.state.filtered}: ${((payload[0].payload[this.state.filtered]).toFixed(2))} c/mL`}</p> :
                    <div>
                        <p className="desc">{`Akashiwo: ${((payload[0].payload.Akashiwo).toFixed(2))} c/mL`}</p>
                        <p className="desc">{`Alexandrium: ${((payload[0].payload.Alexandrium_singlet).toFixed(2))} c/mL`}</p>
                        <p className="desc">{`Dinophysis: ${((payload[0].payload.Dinophysis).toFixed(2))} c/mL`}</p>
                        <p className="desc">{`Cochlodinium: ${((payload[0].payload.Cochlodinium).toFixed(2))} c/mL`}</p>
                        <p className="desc">{`Lingulodinium: ${((payload[0].payload.Lingulodinium).toFixed(2))} c/mL`}</p>
                        <p className="desc">{`Prorocentrum: ${((payload[0].payload.Prorocentrum).toFixed(2))} c/mL`}</p>
                        <p className="desc">{`Pseudo Nitzschia: ${((payload[0].payload.Pseudo_nitzschia).toFixed(2))} c/mL`}</p>
                        <p className="desc">{`Pennate: ${((payload[0].payload.Pennate).toFixed(2))} c/mL`}</p>
                        <p className="desc biomass-desc">{`Total Biomass: ${((payload[0].payload.Total).toFixed(2))} c/mL`}</p>
                    </div>
                    }
                </div>
                );
            }
            };
        
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
                <div className="download-button" style={{margin: '20px 0 10px 0'}} onClick={() => this.props.toggleIndividuals()}>{this.props.showIndividuals ? 'Hide All' : 'Show All'}</div>
                <div className="download-button" style={{marginTop: '0px'}} onClick={() => this.props.toggleTotal()}>{this.props.hideTotal ? 'Show Total' : 'Hide Total'}</div>
              </div>
            );
          }

          const renderTotalLegend = (props) => {
            var { payload } = props;
   
            return (
            <div>
                <ul className="recharts-default-legend" style={{padding: "0px", margin: "0px", textAlign: "left"}}>
                    {
                    payload.map((entry, index) => (
                        <li className="recharts-legend-item" key={`item-${index}`} onClick={() => this.filterFor(entry.value)}>
                            <svg className="recharts-surface" width="14" height="14" viewBox="0 0 32 32" version="1.1" style={{display: "inlineBlock", verticalAlign: "middle", marginRight: "8px"}}>
                                <title></title>
                                <desc></desc>
                                <path stroke="none" fill={entry.color} d="M0,4h32v24h-32z" className="recharts-legend-icon"></path>
                            </svg>
                            Total Cell Concentration
                        </li>
                    ))
                    }
                </ul>
              </div>
            );
          }

        return (
            <div>
                <div style={{display: 'flex'}}>
                    <div className="download-button" onClick={() => this.downloadImage()}>Download</div>
                </div>
                <div id="plot">
                    {(this.state.data) ?
                    <LineChart width={700} height={350} data={this.state.data} key={this.props.key} ref={(chart) => this.currentChart = chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            key={this.props.key} 
                            dataKey="name"
                            height={50}
                            type="number"
                            tick={<CustomizedAxisTick days={this.props.days} ticks={this.props.ticks}/>}
                            ticks={this.props.ticks}
                            tickCount={100}
                            interval={0}
                            hide={false}
                            domain={[0,604800]}>
                        </XAxis>
                        <YAxis key={this.props.key} label={{ value: 'Average Cell Count (c/mL)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            itemStyle={{backgroundColor:'#FFFFFF', color:'#777777'}} 
                            wrapperStyle={{backgroundColor:'#FFFFFF', color: '#777777', padding:15,
                                borderRadius:15
                            }}
                            position={{ x: 750, y: 18 }}
                            cursor={{ fill: 'rgba(206, 206, 206, 0.3)' }}
                                />
                        <Legend 
                            content={renderLegend}
                            layout="vertical" 
                            verticalAlign="top" 
                            align="right" 
                            wrapperStyle={{margin:'0 -20px', cursor: 'pointer'}} 
                            iconType="rect" 
                            onClick={(label) => this.filterFor(label.dataKey)}>
                        </Legend>
                        <Line type="monotone" className="line" dot={false} id="Akashiwo" dataKey="Akashiwo" isAnimationActive={false} stroke={this.state.colors.Akashiwo} strokeWidth={1.7} />
                        <Line type="monotone" className="line" dot={false} id="Alexandrium_singlet" dataKey="Alexandrium_singlet" name="Alexandrium" isAnimationActive={false} stroke={this.state.colors.Alexandrium} strokeWidth={1.7}/>
                        <Line type="monotone" className="line" dot={false} id="Ceratium" dataKey="Ceratium" isAnimationActive={false} stroke={this.state.colors.Ceratium} strokeWidth={1.7}/>
                        <Line type="monotone" className="line" dot={false} id="Dinophysis" dataKey="Dinophysis" isAnimationActive={false} stroke={this.state.colors.Dinophysis} strokeWidth={1.7}/>
                        <Line type="monotone" className="line" dot={false} id="Cochlodinium" dataKey="Cochlodinium" isAnimationActive={false} stroke={this.state.colors.Cochlodinium} strokeWidth={1.7}/>
                        <Line type="monotone" className="line" dot={false} id="Lingulodinium" dataKey="Lingulodinium" isAnimationActive={false} stroke={this.state.colors.Lingulodinium} strokeWidth={1.7}/>
                        <Line type="monotone" className="line" dot={false} id="Prorocentrum" dataKey="Prorocentrum" isAnimationActive={false} stroke={this.state.colors.Prorocentrum} strokeWidth={1.7}/>
                        <Line type="monotone" className="line" dot={false} id="Pseudo_nitzschia" dataKey="Pseudo_nitzschia" isAnimationActive={false} stroke={this.state.colors.Pseudo_nitzschia} strokeWidth={1.7}/>
                        <Line type="monotone" className="line" dot={false} id="Pennate" dataKey="Pennate" isAnimationActive={false} stroke={this.state.colors.Pennate} strokeWidth={1.7}/>
                        {
                            (this.state.showTotal && !this.props.hideTotal) ?
                            <Line type="monotone" className="line" dot={false} id="Total" dataKey="Total" name="Total" isAnimationActive={false} stroke={this.state.colors.Total} strokeWidth={1.5}/> :
                            <div/>
                        }
                        {
                            this.state.showThreshold ?
                            <Line type="monotone" className="line" id="Threshold" dataKey="Threshold" name="Warning Threshold" stroke={this.state.colors.Threshold} strokeWidth={1.7} dot={false}/> :
                            <div/>
                        }
                    </LineChart> : <div/>}
                    <div className='day-axis axis-name-container'>
                        <p className='axis-name'>Date</p>
                    </div>
                </div>
                {this.props.showIndividuals ? 
                    <div style={{display:'flex', flexWrap:'wrap', marginTop: '30px'}}>
                        {Object.keys(this.props.thresholds).map(c => 
                            <ClassPlot 
                                name={c}
                                days={this.props.days}
                                data={this.props.counts.map(data => Object.fromEntries([[c, data[c]], ["name",data['name']], ["Threshold", this.props.thresholds[c]]]))}
                            />
                        )}
                    </div>
                    : <div/>}
            </div>
        );
    }
}

export default (TimePlot);