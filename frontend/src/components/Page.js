import React from "react";
import axios from "axios";
import TotalPlot from './TotalPlot';
import TimePlot from './TimePlot';

class Page extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          counts: [],
          week: 1,
          weekName: "",
          timekey: 1,
      }
    }

    loadData(week) {
        try {
            axios
                .get('/load/' + week +'/')
                .then((res) => {
                    const counts = res.data.counts;
                    if (res.data.empties) {
                        console.log(res.data.empties);
                        for (let i = 0; i < counts.length; i++) {
                            Object.keys(counts[i]).forEach((key, index) => {
                                if (counts[i][key] === 0) {
                                    counts[i][key] = null;
                                }
                            })
                        }
                    }
                    this.setState({
                        counts: counts,
                        weekName: `${counts[0].name} to ${counts[6].name}`,
                        timekey: this.state.timekey + 1,
                        });

                    });
        } catch {
            console.log();
        }
    }
    
    componentDidMount() {
        this.loadData(this.state.week);
    }

    back() {
        this.loadData(this.state.week+1);
        this.setState({ week: this.state.week+1 });
    }

    next() {
        if (this.state.week > 1) {
            this.loadData(this.state.week-1);
            this.setState({ week: this.state.week-1 });
        }
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
                <h4 className="page-title">Weekly HAB Cell Counts</h4>
                <div style={{display:"flex"}}>
                <h3 className="day-arrow" onClick={() => this.back()} style={{paddingRight: '10px'}}>{'<'}</h3>
                <h3>{this.state.weekName}</h3>
                <h3 className="day-arrow" onClick={() => this.next()} style={{paddingLeft: '10px'}}>{'>'}</h3>
                </div>
            <div className="daily-plot">
                <h4 className="plot-title">Cell Counts by Day</h4>
                {(this.state.counts) ?
                <TimePlot 
                    counts={this.state.counts}
                    thresholds={thresholds}
                    key={this.state.timekey}
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