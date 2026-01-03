import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import Main from './main';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
