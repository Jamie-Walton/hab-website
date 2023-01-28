import React from "react";

class DatePicker extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
          week: 1,
          weekName: null,
          startDate: null,
          endDate: null,
      }
      this.handleDateChange = this.handleDateChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        this.setState({
            startDate: this.props.startDate,
            endDate: this.props.endDate,
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                startDate: this.props.startDate,
                endDate: this.props.endDate,
            })
        }
    }

    back() {
        this.props.nav(this.state.week+1);
        this.setState({ week: this.state.week+1 });
    }

    next() {
        if (this.state.week > 1) {
            this.props.nav(this.state.week-1);
            this.setState({ week: this.state.week-1 });
        }
    }

    handleDateChange(event) {
        const name = event.target.name;
        this.setState({ [name]: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const startDateSplit = this.state.startDate.split('/');
        const endDateSplit = this.state.endDate.split('/');
        var startDate = this.state.startDate;
        var endDate = this.state.endDate;

        if (startDateSplit[1].length == 1) {
            startDate = startDate.slice(0,3) + '0' + startDate.slice(3,10);
            this.setState({ startDate: startDate });
        }
        if (endDateSplit[1].length == 1) {
            endDate = endDate.slice(0,3) + '0' + endDate.slice(3,10);
            this.setState({ endDate: endDate });
        }
        if (startDateSplit[2].length == 2) {
            startDate = startDate.slice(0,6) + '20' + startDate.slice(6,8);
            this.setState({ startDate: startDate });
        }
        if (endDateSplit[2].length == 2) {
            endDate = endDate.slice(0,5) + '20' + endDate.slice(5,8);
            this.setState({ endDate: endDate });
        }

        this.props.loadDateRange(startDate, endDate);
    }

    render() {

        return (
            <div className="datepicker-container">
                <h3 className="day-arrow" onClick={() => this.back()} style={{paddingRight: '10px'}}>{'<'}</h3>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        name="startDate"
                        type="text"
                        className="date"
                        value={this.state.startDate}
                        onChange={this.handleDateChange}
                    />
                </form>
                <p className="to-text">to</p>
                <form onSubmit={this.handleSubmit}>
                    <input 
                        name="endDate"
                        type="text"
                        className="date"
                        value={this.state.endDate}
                        onChange={this.handleDateChange}
                    />
                </form>
                <h3 className="day-arrow" onClick={() => this.next()} style={{paddingLeft: '10px'}}>{'>'}</h3>
            </div>
        );

    }
}

export default (DatePicker);