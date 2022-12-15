import React from "react";
import axios from "axios";
import TotalPlot from './TotalPlot';
import TimePlot from './TimePlot';

class Page extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          counts: [],
          days: [],
          week: 1,
          weekName: "",
          timekey: 1,
          showIndividuals: false,
      }
    }

    loadData(week) {
        try {
            axios
                .get('/load/' + week +'/')
                .then((res) => {
                    const counts = res.data.counts;
                    const days = res.data.days;
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
                        days: days,
                        weekName: `${days[0]} to ${days[6]}`,
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

    toggleIndividuals() {
        this.setState({ showIndividuals: !this.state.showIndividuals });
    }

    render() {
        const thresholds = {
            "Akashiwo": null,
            "Alexandrium_singlet": 0,
            "Ceratium": null,
            "Dinophysis": 0.5,
            "Cochlodinium": null,
            "Lingulodinium": null,
            "Prorocentrum": null,
            "Pseudo_nitzschia": 10,
            "Pennate": 10,
        };

        const average = array => array.reduce((a, b) => a + b) / array.length;
        
        if (this.state.counts.length > 0) {
            var averages = 
                Object.keys(thresholds).map( 
                    name => Object.fromEntries(
                        [
                            ['name', name],
                            ['below', Math.min(average(this.state.counts.map(c => c[name])), thresholds[name])],
                            ['above', Math.max(0, average(this.state.counts.map(c => c[name])) - thresholds[name])],
                        ]
                        )
                    );
        } else {
            var averages = [];
        }

        return(
            <div className="page">
                <h4 className="page-title">Weekly HAB Cell Counts</h4>
                <div style={{display:"flex"}}>
                <h3 className="day-arrow" onClick={() => this.back()} style={{paddingRight: '10px'}}>{'<'}</h3>
                <h3>{this.state.weekName}</h3>
                <h3 className="day-arrow" onClick={() => this.next()} style={{paddingLeft: '10px'}}>{'>'}</h3>
                </div>
            <div className="daily-plot">
                <h4 className="plot-title">Cell Counts Over Time</h4>
                {(this.state.counts) ?
                <TimePlot 
                    counts={this.state.counts}
                    days={this.state.days}
                    thresholds={thresholds}
                    key={this.state.timekey}
                    showIndividuals={this.state.showIndividuals}
                    toggleIndividuals={() => this.toggleIndividuals()}
                /> : <div/> }
                </div>
                <div className="daily-plot">
                <h4 className="plot-title">Average Weekly Cell Counts</h4>
                <TotalPlot
                    averages={averages}
                />
                </div>
            </div>
        );
    }
}

export default (Page);