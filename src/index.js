// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

// Create root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);