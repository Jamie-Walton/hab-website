import React, { Component } from 'react';
import KudelaLab from './pages/KudelaLab';
import BoulderLab from './pages/BoulderLab';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './css/main.css';

class App extends Component {

  render() {
    return (
      <Router>
          <Routes>
              <Route exact path='/' element={<KudelaLab/>} />
              <Route path='/boulder' element={<BoulderLab/>} />
          </Routes>
      </Router>
    );
  }
}

export default App;
