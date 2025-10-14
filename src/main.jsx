import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // This file will contain your Tailwind CSS directives

// Preload critical CSS to prevent FOUC (Flash of Unstyled Content)
const link = document.createElement('link');
link.rel = 'preload';
link.as = 'style';
link.href = '/src/index.css';
document.head.appendChild(link);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

