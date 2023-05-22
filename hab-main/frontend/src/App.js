import React, { Component } from 'react';
import KudelaLab from './pages/KudelaLab';
import HumboldtLab from './pages/HumboldtLab';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './css/main.css';

class App extends Component {

  render() {
    return (
      <Router>
          <Routes>
              <Route exact path='/' element={<KudelaLab/>} />
              <Route path='/humboldt' element={<HumboldtLab/>} />
              <Route path='/Humboldt' element={<HumboldtLab/>} />
          </Routes>
      </Router>
    );
  }
}

export default App;
