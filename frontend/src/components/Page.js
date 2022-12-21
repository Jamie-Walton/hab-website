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
          hideTotal: false,
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

    toggleTotal() {
        this.setState({ hideTotal: !this.state.hideTotal });
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
                            ['none', (thresholds[name]) ? 0 : average(this.state.counts.map(c => c[name]))],
                            ['below', (thresholds[name]) ? ( (average(this.state.counts.map(c => c[name])) < thresholds[name]) ? average(this.state.counts.map(c => c[name])) : 0 ) : 0],
                            ['above', (thresholds[name]) ? ( (average(this.state.counts.map(c => c[name])) > thresholds[name]) ? average(this.state.counts.map(c => c[name])) : 0 ) : 0],
                        ]
                        )
                    );
        } else {
            var averages = [];
        }

        return(
            <div>
                <div className="page">
                    <h4 className="page-title">HAB Cell Concentration</h4>
                    <div style={{display:"flex"}}>
                        <h3 className="day-arrow" onClick={() => this.back()} style={{paddingRight: '10px'}}>{'<'}</h3>
                        <h3>{this.state.weekName}</h3>
                        <h3 className="day-arrow" onClick={() => this.next()} style={{paddingLeft: '10px'}}>{'>'}</h3>
                    </div>
                <div className="daily-plot">
                    {(this.state.counts) ?
                    <TimePlot 
                        counts={this.state.counts}
                        days={this.state.days}
                        thresholds={thresholds}
                        key={this.state.timekey}
                        showIndividuals={this.state.showIndividuals}
                        hideTotal={this.state.hideTotal}
                        toggleIndividuals={() => this.toggleIndividuals()}
                        toggleTotal={() => this.toggleTotal()}
                    /> : <div/> }
                    </div>
                    <div className="daily-plot">
                        <h4 className="plot-title">Weekly Average by Genus</h4>
                        <div style={{display:"flex"}}>
                            <h3 className="day-arrow" onClick={() => this.back()} style={{paddingRight: '10px'}}>{'<'}</h3>
                            <h3>{this.state.weekName}</h3>
                            <h3 className="day-arrow" onClick={() => this.next()} style={{paddingLeft: '10px'}}>{'>'}</h3>
                        </div>
                        <TotalPlot
                            averages={averages}
                        />
                    </div>
                </div>
                <div className='footer'>
                    <p className='disclaimer'><b>Note:</b> This is real time data from an automated classifier. Cell identification and concentrations are not necessarily manually confirmed.</p>
                </div>
            </div>
        );
    }
}

export default (Page);