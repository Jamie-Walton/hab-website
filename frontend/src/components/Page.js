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
               this.setState({counts: res.data.counts});

            })
           .catch((err) => console.log(err));
    }

    render() {
        const thresholds = {
            "Akashiwo": 500,
            "Alexandrium": 10000,
            "Ceratium": 10000,
            "Dinophysis": 10000,
            "Cochlodinium": 10000,
            "Lingulodinium": 10000,
            "Prorocentrum": 10000,
            "Pseudo-Nitzschia": 10000,
            "Pennate": 10000,
        }
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