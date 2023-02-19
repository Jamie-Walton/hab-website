import './css/main.css';
import Page from './components/Page';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path="/HABTracker" element={<Page/>} />
      </Routes>
    </Router>
  );
}

export default App;
