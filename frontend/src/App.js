import './css/main.css';
import Page from './components/Page';

function App() {

  return (
    <main>
      <div className="header">
        <h2 className="subheading">Kudela Lab</h2>
        <h1 className="main-heading">HAB Tracker</h1>
        <h3 className="description-heading">
          Keep track of harmful algae at the Santa Cruz Wharf in California.
        </h3>
      </div>
      {<Page/>}
    </main>
  );
}

export default App;
