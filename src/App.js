import logo from './logo.svg';
import './App.css';
import React from 'react';
import LoginPrac from './LoginPrac';
import ActiveLogin from './ActiveLogin';
import ActiveAfterLogin from './ActiveAfterLogin';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    
    <Router>
    <Routes>
      <Route path="/" element={<ActiveLogin />} />
      <Route path="/login" element={<ActiveLogin />} />
      <Route path="/after-login" element={<ActiveAfterLogin />} />
    </Routes>
  </Router>
  );
}

export default App;
