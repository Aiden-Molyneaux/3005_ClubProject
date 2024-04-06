import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import {BrowserRouter as Router} from 'react-router-dom';
import {AppState} from './AppState.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppState>
      <Router>
        <App />
      </Router>
    </AppState>
  </React.StrictMode>,
)
