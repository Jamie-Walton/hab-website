import React from "react";
import axios from "axios";
import TotalPlot from './TotalPlot';
import TimePlot from './TimePlot';
import DatePicker from "./DatePicker";

class Page extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          habList: [],
          thresholds: {},
          counts: [],
          days: [],
          ticks: [],
          week: 1,
          weekName: "",
          timekey: 1,
          showIndividuals: false,
          hideTotal: false,
          warnings: [],
          warningDate: '',
          lastReportedData: '',
      }
    }

    calculateDate(seconds) {
        if (this.state.days.length > 0) {
            const datenum = Date.parse(this.state.days[0]) + seconds;
            const date = new Date((datenum));
            return date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        }
        
    }

    loadData(week) {
        try {
            axios
                .get(`/load/${this.props.name}/` + week +'/')
                .then((res) => {
                    const counts = res.data.counts;
                    const days = res.data.days;
                    var ticks = res.data.seconds_ticks;
                    if (ticks.length < 2) {
                        ticks = [];
                        for (let day = 0; day < days.length; day++) {
                            ticks.push(day * 86400);
                        }
                    }
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
                        ticks: ticks,
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
        axios
            .get(`/load/warnings/${this.props.name}/`)
            .then(res => {
                var resWarnings = res.data.warnings;
                if (resWarnings.includes('Alexandrium_singlet')) {
                    resWarnings.splice(resWarnings.indexOf('Alexandrium_singlet'), 1, 'Alexandrium');
                }
                this.setState({
                    warnings: resWarnings,
                    warningDate: res.data.date
                });
            })

        axios
            .get(`/load/info/${this.props.name}/`)
            .then(res => {
                const habList = res.data.hab_list;
                var thresholds = {};
                for (let i = 0; i < habList.length; i++) {
                    if (habList[i] in res.data.hab_thresholds) {
                        thresholds[habList[i]] = res.data.hab_thresholds[habList[i]];
                    } else {
                        thresholds[habList[i]] = null;
                    }
                }
                this.setState({
                    habList: habList,
                    thresholds: thresholds,
                });
            });
    }

    nav(week) {
        this.loadData(week);
    }

    loadDateRange(start, end) {
        try {
            axios
                .get(`/load/${this.props.name}/${start.split('/').join('')}/${end.split('/').join('')}/`)
                .then((res) => {
                    const counts = res.data.counts;
                    const days = res.data.days;
                    var ticks = res.data.seconds_ticks;

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
                        weekName: `${days[0]} to ${days[days.length-1]}`,
                        timekey: this.state.timekey + 1,
                        ticks: ticks,
                        });

                    });
        } catch {
            console.log();
        }
    }

    toggleIndividuals() {
        this.setState({ showIndividuals: !this.state.showIndividuals });
    }

    toggleTotal() {
        this.setState({ hideTotal: !this.state.hideTotal });
    }

    renderThreshold(thresholds, key) {
        if (thresholds[key] !== null) {
            return(
                <p className="threshold">{`${key}: ${thresholds[key]} c/mL`}</p>
            );
        }
    }

    render() {

        const average = array => array.reduce((a, b) => a + b) / array.length;
        
        if (this.state.counts.length > 0) {
            var averages = 
                Object.keys(this.state.thresholds).map( 
                    name => Object.fromEntries(
                        [
                            ['name', name=='Alexandrium_singlet' ? 'Alexandrium' : name], // TODO: Fix hardcode!
                            ['none', (this.state.thresholds[name] !== null) ? 0 : average(this.state.counts.map(c => c[name]))],
                            ['below', (this.state.thresholds[name] !== null) ? ( (average(this.state.counts.map(c => c[name])) < this.state.thresholds[name]) ? average(this.state.counts.map(c => c[name])) : 0 ) : 0],
                            ['above', (this.state.thresholds[name] !== null) ? ( (average(this.state.counts.map(c => c[name])) > this.state.thresholds[name]) ? average(this.state.counts.map(c => c[name])) : 0 ) : 0],
                        ]
                        )
                    );
        } else {
            var averages = [];
        }

        return(
            <div>
                <div className="header-banner">
                    {this.state.warnings ? 
                    <div className="warning-banner">
                        <p className="warning-species">{this.state.warnings.join(', ')}</p>
                        <p className="warnings">{`exceeded warning thresholds on ${this.state.warningDate}`}</p>
                    </div> :
                    <div className="warning-banner">
                        <p className="no-warnings">{`No HAB species exceeded warning thresholds as of ${this.state.warningDate}`}</p>
                    </div>
                    }
                    <div className="last-reported-data">
                        <p>{`Last reported data: ${this.calculateDate(this.state.ticks[this.state.ticks.length - 1])} PST`}</p>
                    </div>
                </div>
                <div className="page">
                    <h4 className="page-title">HAB Cell Concentration</h4>
                    <DatePicker 
                        days={this.state.days} 
                        loadDateRange={(start, end) => this.loadDateRange(start, end)}
                        nav={(week) => this.nav(week)}
                        startDate={this.state.days[0]}
                        endDate={this.state.days[this.state.days.length-1]}
                    />
                <div className="daily-plot">
                    {(this.state.counts) ?
                    <TimePlot
                        habList={this.state.habList}
                        counts={this.state.counts}
                        days={this.state.days}
                        thresholds={this.state.thresholds}
                        ticks={this.state.ticks}
                        key={this.state.timekey}
                        showIndividuals={this.state.showIndividuals}
                        hideTotal={this.state.hideTotal}
                        toggleIndividuals={() => this.toggleIndividuals()}
                        toggleTotal={() => this.toggleTotal()}
                    /> : <div/> }
                    </div>
                    <div className="daily-plot">
                        <h4 className="plot-title">Weekly Average by Genus</h4>
                        <DatePicker 
                            days={this.state.days} 
                            loadDateRange={(start, end) => this.loadDateRange(start, end)}
                            nav={(week) => this.nav(week)}
                            startDate={this.state.days[0]}
                            endDate={this.state.days[this.state.days.length-1]}
                        />
                        <TotalPlot
                            averages={averages}
                        />
                    </div>
                    <div className="thresholds-container">
                        <p className="thresholds-header">Thresholds</p>
                        {Object.keys(this.state.thresholds).map(key => this.renderThreshold(this.state.thresholds, key))}
                    </div>
                </div>
            </div>
        );
    }
}

export default (Page);