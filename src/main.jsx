import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { localDB, isFirebaseConfigured } from './services/storageEngine.js';

// Auto-seed sample demo data on first visit if not using real Firebase and storage is empty
if (!isFirebaseConfigured && !localStorage.getItem('karsa_tiket_events')) {
  localDB.seedData();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
