import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Suivi from './Suivi';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/suivi" element={<Suivi />} />
    </Routes>
  </Router>
);