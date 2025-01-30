// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';  // Import global styles here if you have any

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);