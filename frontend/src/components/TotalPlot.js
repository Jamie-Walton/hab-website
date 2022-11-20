import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';
import domtoimage from 'dom-to-image';

class TotalPlot extends React.Component {
  
    constructor(props) {
      super(props);
    }

    downloadImage(){
        var node = document.getElementById('total-plot');
        domtoimage.toPng(node, { bgcolor: '#FFFFFF' })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'Total Cell Counts.png';
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
      }

    render() {

        const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            console.log(payload)
            return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="desc">{`${(payload[0].payload.below + payload[0].payload.above).toFixed(2)} c/mL`}</p>
                <p className="desc">{`${payload[0].payload.above.toFixed(2)} c/mL above threshold`}</p>
            </div>
            );
        }
        };

        return (
            <div>
                <div className="download-button" onClick={() => this.downloadImage()}>Download</div>
                <div id="total-plot">
                    <BarChart width={700} height={300} data={this.props.averages}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-25} textAnchor="end" height={60} allowDataOverFlow={true} minTickGap={-40}>
                            <Label value="HAB Species" offset={-40} position="insideBottom" />
                        </XAxis>
                        <YAxis label={{ value: 'Cell Count (c/mL)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            itemStyle={{backgroundColor:'#FFFFFF', color:'#777777'}} 
                            wrapperStyle={{backgroundColor:'#FFFFFF', color: '#777777', padding:15,
                                borderRadius:15
                            }}
                            cursor={{ fill: 'rgba(206, 206, 206, 0.3)' }}
                                />
                        <Legend layout="vertical" verticalAlign="top" align="right" wrapperStyle={{margin:'0 -20px'}} />
                        <Bar dataKey="below" name="Below Warning Threshold" stackId="a" fill="#d7d5dd" />
                        <Bar dataKey="above" name="Above Warning Threshold" stackId="a" fill="#2458DE" />
                    </BarChart>
                </div>
            </div>
        );
    }
}

export default (TotalPlot);