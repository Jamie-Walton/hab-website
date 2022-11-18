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
            return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="desc">{`${payload[0].value+payload[1].value} c/L total`}</p>
                <p className="desc">{`${payload[0].value} c/L threshold`}</p>
            </div>
            );
        }
        };

        const data = [
            {
                "name": "Akashiwo",
                "above": 1000,
                "below": 9000,
            },
            {
                "name": "Alexandrium",
                "above": 0,
                "below": 1398
            },
            {
                "name": "Ceratium",
                "above": 2000,
                "below": 5800
            },
            {
                "name": "Dinophysis",
                "above": 613,
                "below": 500
            },
            {
                "name": "Cochlodinium",
                "above": 0,
                "below": 3908
            },
            {
                "name": "Lingulodinium",
                "above": 0,
                "below": 9000
            },
            {
                "name": "Prorocentrum",
                "above": 2390,
                "below": 3800
            },
            {
                "name": "Pseudo-Nitzschia",
                "above": 0,
                "below": 8700
            },
            {
                "name": "Pennate",
                "above": 1056,
                "below": 10000
            }
            ]
        return (
            <div>
                <div className="download-button" onClick={() => this.downloadImage()}>Download</div>
                <div id="total-plot">
                    <BarChart width={700} height={300} data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-25} textAnchor="end" height={50} allowDataOverFlow={true} minTickGap={-20}>
                            <Label value="HAB Species" offset={-30} position="insideBottom" />
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
                        <Bar dataKey="below" name="Below Threshold" stackId="a" fill="#d7d5dd" />
                        <Bar dataKey="above" name="Above Threshold" stackId="a" fill="#2458DE" />
                    </BarChart>
                </div>
            </div>
        );
    }
}

export default (TotalPlot);