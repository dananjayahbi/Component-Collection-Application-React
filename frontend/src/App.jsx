import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='*' element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
