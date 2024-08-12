import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { VoteProvider } from './store'; // Importando o VoteProvider

ReactDOM.render(
  <React.StrictMode>
    <VoteProvider>
      <App />
    </VoteProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
