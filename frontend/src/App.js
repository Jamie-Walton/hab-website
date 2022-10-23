import './css/main.css';
import TotalPlot from './components/TotalPlot'
import TimePlot from './components/TimePlot'

function App() {

  const counts = [
    {
        "name": "8:00",
        "Akashiwo": 1000,
        "Alexandrium": 8000,
        "Ceratium": 9000,
        "Dinophysis": 9590,
        "Cochlodinium": 3000,
        "Lingulodinium": 4000,
        "Prorocentrum": 2629,
        "Pseudo-Nitzschia": 1918,
        "Pennate": 900,
    },
    {
        "name": "10:00",
        "Akashiwo": 1100,
        "Alexandrium": 9000,
        "Ceratium": 9000,
        "Dinophysis": 9000,
        "Cochlodinium": 9000,
        "Lingulodinium": 9000,
        "Prorocentrum": 9000,
        "Pseudo-Nitzschia": 9000,
        "Pennate": 9000,
    },
    {
        "name": "12:00",
        "Akashiwo": 900,
        "Alexandrium": 9000,
        "Ceratium": 9000,
        "Dinophysis": 9000,
        "Cochlodinium": 9000,
        "Lingulodinium": 9000,
        "Prorocentrum": 9000,
        "Pseudo-Nitzschia": 9000,
        "Pennate": 9000,
    },
    {
        "name": "14:00",
        "Akashiwo": 950,
        "Alexandrium": 9000,
        "Ceratium": 9000,
        "Dinophysis": 9000,
        "Cochlodinium": 9000,
        "Lingulodinium": 9000,
        "Prorocentrum": 9000,
        "Pseudo-Nitzschia": 9000,
        "Pennate": 9000,
    },
    {
        "name": "16:00",
        "Akashiwo": 973,
        "Alexandrium": 9000,
        "Ceratium": 9000,
        "Dinophysis": 9000,
        "Cochlodinium": 9000,
        "Lingulodinium": 9000,
        "Prorocentrum": 9000,
        "Pseudo-Nitzschia": 9000,
        "Pennate": 9000,
    },
    ]

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

  return (
    <main>
      <div className="header">
        <h2 className="subheading">Kudela Lab</h2>
        <h1 className="main-heading">HAB Tracker</h1>
        <h3 className="description-heading">
          Keep track of the harmful algae blooms at the Santa Wharf in California.
        </h3>
      </div>
      <div className="page">
        <h4 className="page-title">Daily HAB Cell Counts</h4>
        <div style={{display:"flex"}}>
          <h3 className="day-arrow" style={{paddingRight: '10px'}}>{'<'}</h3>
          <h3>October 15, 2022</h3>
          <h3 className="day-arrow" style={{paddingLeft: '10px'}}>{'>'}</h3>
        </div>
      <div className="daily-plot">
          <h4 className="plot-title">Cell Counts Throughout the Day</h4>
          <TimePlot 
            counts={counts}
            thresholds={thresholds}
          />
        </div>
        <div className="daily-plot">
          <h4 className="plot-title">Total Cell Counts</h4>
          <TotalPlot/>
        </div>
      </div>
    </main>
  );
}

export default App;
