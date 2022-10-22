import './css/main.css';
import TotalPlot from './components/TotalPlot'

function App() {
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
        <div className="daily-plot">
          <h4>Daily Cell Counts</h4>
          <h3>October 15, 2022</h3>
          <TotalPlot/>
        </div>
      </div>
    </main>
  );
}

export default App;
