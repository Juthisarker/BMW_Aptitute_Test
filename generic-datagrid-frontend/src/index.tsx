// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from react-dom/client in React 18
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

// Create a root using ReactDOM.createRoot
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement // Get the root DOM node
);

// Render the App component inside the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log Web Vitals
reportWebVitals(console.log);
