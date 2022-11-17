import './css/main.css';
import axios from "axios";
import Page from './components/Page';

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
      {<Page/>}
    </main>
  );
}

export default App;
