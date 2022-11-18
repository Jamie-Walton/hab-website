import React from "react";
import axios from "axios";
import TotalPlot from './TotalPlot';
import TimePlot from './TimePlot';

class Page extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          counts: [],
      }
    }

    componentDidMount() {
        axios
           .get('/load/')
           .then((res) => {
               const counts = res.data.counts;
               if (res.data.empties) {
                for (let i = 0; i < counts.length; i++) {
                    Object.keys(counts[i]).forEach((key, index) => {
                        if (counts[i][key] === 0) {
                            counts[i][key] = null;
                        }
                    })
                }
               }
               this.setState({counts: counts});

            })
           .catch((err) => console.log(err));
    }

    render() {
        const thresholds = {
            "Akashiwo": 100,
            "Alexandrium_singlet": 100,
            "Ceratium": 100,
            "Dinophysis": 0.5,
            "Cochlodinium": 100,
            "Lingulodinium": 100,
            "Prorocentrum": 100,
            "Pseudo-nitzschia": 100,
            "Pennate": 100,
        };
        return(
            <div className="page">
                <h4 className="page-title">Daily HAB Cell Counts</h4>
                <div style={{display:"flex"}}>
                <h3 className="day-arrow" style={{paddingRight: '10px'}}>{'<'}</h3>
                <h3>October 15, 2022</h3>
                <h3 className="day-arrow" style={{paddingLeft: '10px'}}>{'>'}</h3>
                </div>
            <div className="daily-plot">
                <h4 className="plot-title">Cell Counts Throughout the Day</h4>
                {(this.state.counts) ?
                <TimePlot 
                    counts={this.state.counts}
                    thresholds={thresholds}
                /> : <div/> }
                </div>
                <div className="daily-plot">
                <h4 className="plot-title">Total Cell Counts</h4>
                <TotalPlot/>
                </div>
            </div>
        );
    }
}

export default (Page);